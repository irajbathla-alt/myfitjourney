(function(){
  const PROGRAM_PAGES = ['shred.html','strength.html','bikini.html'];
  const path = location.pathname.split('/').pop() || 'index.html';
  const isProgram = PROGRAM_PAGES.includes(path) || /^p\d+\.html$/i.test(path);

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function injectStyle(css){
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function getEmail(){
    return (sessionStorage.getItem('mfj_last_email') || localStorage.getItem('mfj_last_email') || '').trim().toLowerCase();
  }

  function createTopBar(){
    if(document.querySelector('.mfj-member-topbar')) return;
    const email = getEmail();
    const bar = document.createElement('div');
    bar.className = 'mfj-member-topbar';
    bar.innerHTML = `
      <a href="dashboard.html" class="mfj-top-link">My Program</a>
      <span class="mfj-top-email">${email || 'Member Mode'}</span>
      <button type="button" class="mfj-top-logout">Logout</button>
    `;
    document.body.appendChild(bar);
    bar.querySelector('.mfj-top-logout').addEventListener('click', function(){
      sessionStorage.removeItem('mfj_last_email');
      localStorage.removeItem('mfj_last_email');
      localStorage.removeItem('mfj_cached_member');
      location.href = 'login.html';
    });
  }

  function showGate(){
    document.body.innerHTML = `
      <main class="mfj-gate">
        <div class="mfj-gate-card">
          <div class="mfj-gate-kicker">My Fit Journey</div>
          <h1>Member Access Required</h1>
          <p>This program is part of the member portal. Please sign in so your membership, assigned program, and expiry can be verified.</p>
          <a href="login.html" class="mfj-gate-primary">Sign In</a>
          <a href="index.html" class="mfj-gate-secondary">Back to Home</a>
        </div>
      </main>
    `;
  }

  injectStyle(`
    .mfj-member-topbar{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 12px);transform:translateX(-50%);z-index:9999;width:min(94vw,620px);display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border-radius:999px;background:rgba(0,0,0,.78);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.16);box-shadow:0 16px 40px rgba(0,0,0,.28);font-family:Inter,system-ui,sans-serif}
    .mfj-top-link,.mfj-top-logout{border:0;border-radius:999px;background:#00D97E;color:#001b10;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:.6px;text-transform:uppercase;padding:8px 11px;cursor:pointer;white-space:nowrap}
    .mfj-top-email{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,.78);font-size:11px;font-weight:700}
    .mfj-gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top,#1b1b1d,#050505 62%);color:#fff;font-family:Inter,system-ui,sans-serif;text-align:center}
    .mfj-gate-card{width:min(92vw,420px);border:1px solid rgba(255,255,255,.14);border-radius:24px;background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.025));box-shadow:0 28px 90px rgba(0,0,0,.55);padding:30px 24px}
    .mfj-gate-kicker{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.48);margin-bottom:10px}
    .mfj-gate h1{font-family:Georgia,serif;font-size:30px;line-height:1.05;margin:0 0 12px}
    .mfj-gate p{font-size:14px;line-height:1.7;color:rgba(255,255,255,.68);margin:0 0 20px}
    .mfj-gate-primary,.mfj-gate-secondary{display:flex;align-items:center;justify-content:center;text-decoration:none;border-radius:14px;padding:13px 14px;font-weight:900;text-transform:uppercase;letter-spacing:1px;font-size:12px;margin-top:10px}
    .mfj-gate-primary{background:#00D97E;color:#001b10}.mfj-gate-secondary{border:1px solid rgba(255,255,255,.14);color:#fff;background:rgba(255,255,255,.05)}
    .mfj-last-session{margin:8px 0 10px;padding:9px 10px;border-radius:12px;border:1px solid rgba(0,217,126,.18);background:rgba(0,217,126,.045);font-size:11px;line-height:1.45;color:inherit;text-align:center}
  `);

  ready(function(){
    if(isProgram){
      const email = getEmail();
      if(!email){ showGate(); return; }
      createTopBar();
      try{
        const key = 'mfj_last_route';
        localStorage.setItem(key, path);
      }catch(_e){}
    }

    if(path === 'login.html'){
      const notice = document.createElement('div');
      notice.className = 'mfj-last-session';
      const last = localStorage.getItem('mfj_last_route');
      if(last){
        notice.innerHTML = `Last opened program: <strong>${last.replace('.html','')}</strong>`;
        const form = document.getElementById('form-area');
        if(form) form.parentNode.insertBefore(notice, form);
      }
    }
  });
})();
