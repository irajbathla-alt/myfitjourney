const SHEET_NAME = "Members";
const SECRET = "JFC2026PRIVATEKEY";

const HEADERS = [
  "Email",
  "PasswordHash",
  "Program",
  "Expiry",
  "Status",
  "CreatedAt",
  "UpdatedAt",
  "LastLoginAt",
  "LoginCount",
  "ProgramUpdatedAt"
];

function doPost(e) {
  try {
    const data = parseIncomingBody(e);
    const action = String(data.action || "").trim().toLowerCase();
    const secret = String(data.secret || "").trim();

    if (secret !== SECRET) {
      return jsonResponse({ ok: false, message: "Unauthorized request." });
    }

    if (action === "register") return jsonResponse(registerMember(data));
    if (action === "login") return jsonResponse(loginMember(data));
    if (action === "verify") return jsonResponse(verifyMember(data));
    if (action === "update_program") return jsonResponse(updateProgram(data));

    return jsonResponse({ ok: false, message: "Invalid action." });
  } catch (err) {
    return jsonResponse({ ok: false, message: err.message || "Server error." });
  }
}

function parseIncomingBody(e) {
  const raw = e && e.postData && e.postData.contents ? String(e.postData.contents) : "{}";
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (_err) {
    return {};
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return sheet;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  HEADERS.forEach((header) => {
    if (!currentHeaders.includes(header)) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
    }
  });

  return sheet;
}

function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function getColumn(headers, name) {
  return headers.indexOf(name) + 1;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeProgram(program) {
  return String(program || "shred").trim().toLowerCase() || "shred";
}

function hashPassword(password) {
  const raw = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(password || ""),
    Utilities.Charset.UTF_8
  );

  return raw
    .map((byte) => ("0" + (byte & 0xff).toString(16)).slice(-2))
    .join("");
}

function findMemberRow(sheet, headers, email) {
  const emailCol = getColumn(headers, "Email");
  if (emailCol < 1) return null;

  const values = sheet.getDataRange().getValues();
  const target = normalizeEmail(email);

  for (let i = 1; i < values.length; i++) {
    if (normalizeEmail(values[i][emailCol - 1]) === target) {
      return i + 1;
    }
  }

  return null;
}

function registerMember(data) {
  const sheet = getSheet();
  const headers = getHeaders(sheet);

  const email = normalizeEmail(data.email);
  const password = String(data.password || "");
  const program = normalizeProgram(data.program || data.selectedProgram);

  if (!email) return { ok: false, message: "Email is required." };
  if (!password || password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }

  const now = new Date();
  const row = findMemberRow(sheet, headers, email);

  if (row) {
    const passwordHashCol = getColumn(headers, "PasswordHash");
    const programCol = getColumn(headers, "Program");
    const updatedAtCol = getColumn(headers, "UpdatedAt");
    const programUpdatedAtCol = getColumn(headers, "ProgramUpdatedAt");

    if (passwordHashCol > 0) {
      const existingHash = String(sheet.getRange(row, passwordHashCol).getValue() || "");
      if (existingHash && existingHash !== hashPassword(password)) {
        return { ok: false, message: "Account already exists. Incorrect password." };
      }
      sheet.getRange(row, passwordHashCol).setValue(hashPassword(password));
    }

    if (programCol > 0) sheet.getRange(row, programCol).setValue(program);
    if (updatedAtCol > 0) sheet.getRange(row, updatedAtCol).setValue(now);
    if (programUpdatedAtCol > 0) sheet.getRange(row, programUpdatedAtCol).setValue(now);

    return {
      ok: true,
      message: "Account updated successfully.",
      email: email,
      program: program,
      updated: true
    };
  }

  const newRow = headers.map((header) => {
    switch (header) {
      case "Email": return email;
      case "PasswordHash": return hashPassword(password);
      case "Program": return program;
      case "Expiry": return "";
      case "Status": return "pending";
      case "CreatedAt": return now;
      case "UpdatedAt": return now;
      case "LastLoginAt": return "";
      case "LoginCount": return 0;
      case "ProgramUpdatedAt": return now;
      default: return "";
    }
  });

  sheet.appendRow(newRow);

  return {
    ok: true,
    message: "Account created successfully.",
    email: email,
    program: program,
    status: "pending"
  };
}

function loginMember(data) {
  const sheet = getSheet();
  const headers = getHeaders(sheet);

  const email = normalizeEmail(data.email);
  const password = String(data.password || "");

  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }

  const row = findMemberRow(sheet, headers, email);
  if (!row) {
    return { ok: false, message: "Account not found." };
  }

  const passwordHashCol = getColumn(headers, "PasswordHash");
  const storedHash = String(sheet.getRange(row, passwordHashCol).getValue() || "");
  if (storedHash !== hashPassword(password)) {
    return { ok: false, message: "Incorrect email or password." };
  }

  const now = new Date();
  const lastLoginCol = getColumn(headers, "LastLoginAt");
  const loginCountCol = getColumn(headers, "LoginCount");
  const updatedAtCol = getColumn(headers, "UpdatedAt");

  const count = Number(sheet.getRange(row, loginCountCol).getValue() || 0);
  if (lastLoginCol > 0) sheet.getRange(row, lastLoginCol).setValue(now);
  if (loginCountCol > 0) sheet.getRange(row, loginCountCol).setValue(count + 1);
  if (updatedAtCol > 0) sheet.getRange(row, updatedAtCol).setValue(now);

  return { ok: true, message: "Login successful.", member: getMemberObject(sheet, headers, row) };
}

function verifyMember(data) {
  const sheet = getSheet();
  const headers = getHeaders(sheet);

  const email = normalizeEmail(data.email);
  if (!email) return { ok: false, message: "Email is required." };

  const row = findMemberRow(sheet, headers, email);
  if (!row) return { ok: false, message: "Member not found." };

  return { ok: true, member: getMemberObject(sheet, headers, row) };
}

function updateProgram(data) {
  const sheet = getSheet();
  const headers = getHeaders(sheet);

  const email = normalizeEmail(data.email);
  const program = normalizeProgram(data.program || data.selectedProgram);
  if (!email) return { ok: false, message: "Email is required." };

  const row = findMemberRow(sheet, headers, email);
  if (!row) return { ok: false, message: "Member not found." };

  const now = new Date();
  const programCol = getColumn(headers, "Program");
  const updatedAtCol = getColumn(headers, "UpdatedAt");
  const programUpdatedAtCol = getColumn(headers, "ProgramUpdatedAt");

  if (programCol > 0) sheet.getRange(row, programCol).setValue(program);
  if (updatedAtCol > 0) sheet.getRange(row, updatedAtCol).setValue(now);
  if (programUpdatedAtCol > 0) sheet.getRange(row, programUpdatedAtCol).setValue(now);

  return { ok: true, message: "Program updated.", email: email, program: program };
}

function getMemberObject(sheet, headers, row) {
  const get = (name) => {
    const col = getColumn(headers, name);
    if (col < 1) return "";
    return sheet.getRange(row, col).getValue();
  };

  return {
    email: normalizeEmail(get("Email")),
    program: normalizeProgram(get("Program")),
    expiry: formatDate(get("Expiry")),
    status: String(get("Status") || "").trim().toLowerCase(),
    createdAt: formatDate(get("CreatedAt")),
    updatedAt: formatDate(get("UpdatedAt")),
    lastLoginAt: formatDate(get("LastLoginAt")),
    loginCount: Number(get("LoginCount") || 0),
    programUpdatedAt: formatDate(get("ProgramUpdatedAt"))
  };
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}
