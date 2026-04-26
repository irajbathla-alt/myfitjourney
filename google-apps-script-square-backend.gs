// My Fit Journey — Google Sheets + Square Backend
// Paste this into Google Apps Script attached to your Google Sheet.
// Deploy as Web App: Execute as Me, Access Anyone.
// Then use this URL in your website SCRIPT_URL.
// For Square webhook, use the deployed URL with ?secret=YOUR_WEBHOOK_SECRET

const SHEET_NAME = 'Members';
const TOKEN_DAYS = 30;
const DEFAULT_PROGRAM = 'shred'; // Change to strength, bikini, p4, p5, or all if needed.
const DEFAULT_ACCESS_DAYS = 7;   // $2/week = 7 days access.

function doGet() {
  return json_({ ok: true, message: 'My Fit Journey backend is running.' });
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = String(payload.action || '').toLowerCase();

    if (action === 'register') return json_(registerMember_(payload));
    if (action === 'login') return json_(loginMember_(payload));
    if (action === 'verify') return json_(verifyMember_(payload));

    // Manual/API activation option from your website or admin tools.
    if (action === 'activate') return json_(manualActivate_(payload));

    // Square webhook automatic detection.
    // Square will not send action=square, so we also detect Square events by payload.type.
    if (action === 'square' || payload.type || payload.event_id) {
      return json_(handleSquareWebhook_(payload, e));
    }

    return json_({ ok: false, message: 'Invalid action.' });
  } catch (err) {
    return json_({ ok: false, message: err.message || 'Server error.' });
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function props_() {
  return PropertiesService.getScriptProperties();
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);

  const requiredHeaders = [
    'Email',
    'PasswordHash',
    'Program',
    'Expiry',
    'Status',
    'Token',
    'TokenExpiry',
    'Name',
    'Phone',
    'SquarePaymentId',
    'SquareCustomerId',
    'SubscriptionId',
    'SquareOrderId',
    'LastPaymentAmount',
    'LastPaymentStatus',
    'CreatedAt',
    'UpdatedAt'
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(requiredHeaders);
    return sh;
  }

  const lastCol = Math.max(1, sh.getLastColumn());
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  requiredHeaders.forEach(h => {
    if (!headers.includes(h)) {
      sh.getRange(1, sh.getLastColumn() + 1).setValue(h);
      headers.push(h);
    }
  });

  return sh;
}

function data_() {
  const sh = sheet_();
  const range = sh.getDataRange();
  const values = range.getValues();
  const headers = values.shift();
  return { sh, headers, values };
}

function col_(headers, name) {
  return headers.indexOf(name);
}

function setCell_(found, header, value) {
  const c = col_(found.headers, header);
  if (c >= 0) found.sh.getRange(found.rowNumber, c + 1).setValue(value);
}

function normalizeEmail_(email) {
  return String(email || '').trim().toLowerCase();
}

function findByEmail_(email) {
  const d = data_();
  const emailCol = col_(d.headers, 'Email');
  const target = normalizeEmail_(email);

  for (let i = 0; i < d.values.length; i++) {
    if (normalizeEmail_(d.values[i][emailCol]) === target) {
      return { sh: d.sh, headers: d.headers, row: d.values[i], rowNumber: i + 2 };
    }
  }

  return { sh: d.sh, headers: d.headers, row: null, rowNumber: null };
}

function hash_(password) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(password || ''),
    Utilities.Charset.UTF_8
  );
  return digest.map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}

function makeToken_() {
  return Utilities.getUuid() + '-' + Utilities.getUuid();
}

function tokenExpiry_() {
  const d = new Date();
  d.setDate(d.getDate() + TOKEN_DAYS);
  return d;
}

function accessExpiry_(days) {
  const d = new Date();
  d.setDate(d.getDate() + Number(days || DEFAULT_ACCESS_DAYS));
  return d;
}

function registerMember_(p) {
  const email = normalizeEmail_(p.email);
  const password = String(p.password || '');
  const name = String(p.name || '').trim();
  const phone = String(p.phone || '').trim();

  if (!email || !password) return { ok: false, message: 'Email and password are required.' };
  if (password.length < 6) return { ok: false, message: 'Password must be at least 6 characters.' };

  const found = findByEmail_(email);
  if (found.row) return { ok: false, message: 'An account with this email already exists. Please sign in.' };

  const now = new Date();
  const token = makeToken_();

  const rowObj = {
    Email: email,
    PasswordHash: hash_(password),
    Program: '',
    Expiry: '',
    Status: 'pending',
    Token: token,
    TokenExpiry: tokenExpiry_(),
    Name: name,
    Phone: phone,
    SquarePaymentId: '',
    SquareCustomerId: '',
    SubscriptionId: '',
    SquareOrderId: '',
    LastPaymentAmount: '',
    LastPaymentStatus: '',
    CreatedAt: now,
    UpdatedAt: now
  };

  found.sh.appendRow(found.headers.map(h => rowObj[h] !== undefined ? rowObj[h] : ''));

  return { ok: true, token, message: 'Account created.' };
}

function loginMember_(p) {
  const email = normalizeEmail_(p.email);
  const password = String(p.password || '');
  const found = findByEmail_(email);

  if (!found.row) return { ok: false, message: 'Account not found. Please create an account first.' };

  const passwordCol = col_(found.headers, 'PasswordHash');
  if (String(found.row[passwordCol]) !== hash_(password)) {
    return { ok: false, message: 'Incorrect email or password.' };
  }

  const token = makeToken_();
  setCell_(found, 'Token', token);
  setCell_(found, 'TokenExpiry', tokenExpiry_());
  setCell_(found, 'UpdatedAt', new Date());

  return { ok: true, token, message: 'Login successful.' };
}

function verifyMember_(p) {
  const email = normalizeEmail_(p.email);
  const token = String(p.token || '').trim();
  const found = findByEmail_(email);

  if (!found.row) return { ok: false, message: 'Account not found.' };

  const tokenCol = col_(found.headers, 'Token');
  const tokenExpiryCol = col_(found.headers, 'TokenExpiry');

  if (!token || String(found.row[tokenCol]) !== token) {
    return { ok: false, message: 'Session expired. Please sign in again.' };
  }

  const tokenExpiry = new Date(found.row[tokenExpiryCol]);
  if (!Number.isNaN(tokenExpiry.getTime()) && new Date() > tokenExpiry) {
    return { ok: false, message: 'Session expired. Please sign in again.' };
  }

  return { ok: true, member: memberFromRow_(found.headers, found.row) };
}

function memberFromRow_(headers, row) {
  const get = name => row[col_(headers, name)] || '';
  return {
    email: get('Email'),
    program: get('Program'),
    expiry: formatDate_(get('Expiry')),
    status: get('Status'),
    name: get('Name'),
    phone: get('Phone')
  };
}

function formatDate_(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function manualActivate_(p) {
  const secret = props_().getProperty('WEBHOOK_SECRET') || '';
  if (secret && String(p.secret || '') !== secret) {
    return { ok: false, message: 'Unauthorized.' };
  }

  const email = normalizeEmail_(p.email);
  const program = String(p.program || DEFAULT_PROGRAM).toLowerCase();
  const days = Number(p.days || DEFAULT_ACCESS_DAYS);
  const paymentId = String(p.paymentId || '').trim();

  return activateMember_(email, {
    program,
    days,
    paymentId,
    paymentStatus: 'manual-active',
    amount: p.amount || ''
  });
}

function activateMember_(email, info) {
  const found = findByEmail_(email);
  if (!found.row) return { ok: false, message: 'Member not found for email: ' + email };

  setCell_(found, 'Program', info.program || DEFAULT_PROGRAM);
  setCell_(found, 'Expiry', accessExpiry_(info.days || DEFAULT_ACCESS_DAYS));
  setCell_(found, 'Status', 'active');
  setCell_(found, 'SquarePaymentId', info.paymentId || '');
  setCell_(found, 'SquareCustomerId', info.customerId || '');
  setCell_(found, 'SubscriptionId', info.subscriptionId || '');
  setCell_(found, 'SquareOrderId', info.orderId || '');
  setCell_(found, 'LastPaymentAmount', info.amount || '');
  setCell_(found, 'LastPaymentStatus', info.paymentStatus || 'active');
  setCell_(found, 'UpdatedAt', new Date());

  return { ok: true, message: 'Member activated.', email: email };
}

function handleSquareWebhook_(payload, e) {
  // Apps Script does not reliably expose Square request headers, so we cannot do true Square-Signature validation here.
  // Use a secret query string in your Square webhook URL:
  // https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?secret=YOUR_WEBHOOK_SECRET
  const expectedSecret = props_().getProperty('WEBHOOK_SECRET') || '';
  const incomingSecret = e && e.parameter ? String(e.parameter.secret || '') : '';

  if (expectedSecret && incomingSecret !== expectedSecret) {
    return { ok: false, message: 'Unauthorized webhook.' };
  }

  const eventType = String(payload.type || '').toLowerCase();
  const obj = payload.data && payload.data.object ? payload.data.object : {};

  // Square may send payment as object.payment depending on event type.
  const payment = obj.payment || obj;
  const subscription = obj.subscription || obj;

  // Ignore failed/cancelled events unless you want to deactivate members.
  if (eventType.indexOf('payment') >= 0) {
    return handleSquarePayment_(payment, eventType);
  }

  if (eventType.indexOf('subscription') >= 0) {
    return handleSquareSubscription_(subscription, eventType);
  }

  return { ok: true, ignored: true, eventType };
}

function handleSquarePayment_(payment, eventType) {
  const paymentId = String(payment.id || '').trim();
  const status = String(payment.status || '').toUpperCase();

  if (!paymentId) return { ok: true, ignored: true, message: 'No payment ID.' };

  // Only activate for completed/approved payment events.
  if (status && ['COMPLETED', 'APPROVED'].indexOf(status) === -1) {
    return { ok: true, ignored: true, message: 'Payment not completed.', status };
  }

  let fullPayment = payment;
  try {
    fullPayment = fetchSquarePayment_(paymentId) || payment;
  } catch (err) {
    // Continue with webhook data if API fetch fails.
  }

  const email = extractEmailFromPayment_(fullPayment);
  if (!email) {
    logSquareIssue_('Missing email for payment ' + paymentId, fullPayment);
    return { ok: false, message: 'Payment found but customer email was missing. Make sure Square checkout collects email.' };
  }

  const amount = fullPayment.amount_money ? Number(fullPayment.amount_money.amount || 0) / 100 : '';
  const customerId = fullPayment.customer_id || '';
  const orderId = fullPayment.order_id || '';

  return activateMember_(email, {
    program: DEFAULT_PROGRAM,
    days: DEFAULT_ACCESS_DAYS,
    paymentId,
    customerId,
    orderId,
    amount,
    paymentStatus: status || eventType
  });
}

function handleSquareSubscription_(subscription, eventType) {
  const subscriptionId = String(subscription.id || '').trim();
  const customerId = String(subscription.customer_id || '').trim();
  const status = String(subscription.status || '').toUpperCase();

  if (status && ['ACTIVE', 'PENDING'].indexOf(status) === -1) {
    return { ok: true, ignored: true, message: 'Subscription not active.', status };
  }

  let email = normalizeEmail_(subscription.buyer_email_address || subscription.email || '');

  if (!email && customerId) {
    try {
      const customer = fetchSquareCustomer_(customerId);
      email = normalizeEmail_(customer.email_address || '');
    } catch (err) {}
  }

  if (!email) {
    logSquareIssue_('Missing email for subscription ' + subscriptionId, subscription);
    return { ok: false, message: 'Subscription found but customer email was missing.' };
  }

  return activateMember_(email, {
    program: DEFAULT_PROGRAM,
    days: DEFAULT_ACCESS_DAYS,
    subscriptionId,
    customerId,
    paymentStatus: status || eventType
  });
}

function extractEmailFromPayment_(payment) {
  let email = normalizeEmail_(
    payment.buyer_email_address ||
    payment.customer_email_address ||
    payment.receipt_email ||
    ''
  );

  if (!email && payment.customer_id) {
    try {
      const customer = fetchSquareCustomer_(payment.customer_id);
      email = normalizeEmail_(customer.email_address || '');
    } catch (err) {}
  }

  return email;
}

function squareAccessToken_() {
  const token = props_().getProperty('SQUARE_ACCESS_TOKEN') || '';
  if (!token) throw new Error('Missing SQUARE_ACCESS_TOKEN in Apps Script Properties.');
  return token;
}

function fetchSquarePayment_(paymentId) {
  const url = 'https://connect.squareup.com/v2/payments/' + encodeURIComponent(paymentId);
  const res = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true,
    headers: {
      Authorization: 'Bearer ' + squareAccessToken_(),
      'Square-Version': '2025-01-23',
      'Content-Type': 'application/json'
    }
  });

  const body = JSON.parse(res.getContentText() || '{}');
  if (res.getResponseCode() >= 300) throw new Error('Square payment fetch failed: ' + res.getContentText());
  return body.payment;
}

function fetchSquareCustomer_(customerId) {
  const url = 'https://connect.squareup.com/v2/customers/' + encodeURIComponent(customerId);
  const res = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true,
    headers: {
      Authorization: 'Bearer ' + squareAccessToken_(),
      'Square-Version': '2025-01-23',
      'Content-Type': 'application/json'
    }
  });

  const body = JSON.parse(res.getContentText() || '{}');
  if (res.getResponseCode() >= 300) throw new Error('Square customer fetch failed: ' + res.getContentText());
  return body.customer;
}

function logSquareIssue_(message, raw) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('SquareWebhookLog');
  if (!sh) {
    sh = ss.insertSheet('SquareWebhookLog');
    sh.appendRow(['CreatedAt', 'Message', 'Raw']);
  }
  sh.appendRow([new Date(), message, JSON.stringify(raw || {})]);
}
