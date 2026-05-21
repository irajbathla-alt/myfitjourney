window.MFJ_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby6XZ5ThRxOf1SXhLuioSzp_LGWoyR3jyiSp4XSoeYzWgp-sGCJLBSlPSIXA-UDRz8/exec";
window.MFJ_APP_KEY = "MFJ_PUBLIC_APP";
window.MFJ_SECRET = "JFC" + "2026" + "PRIVATEKEY";
window.MFJ_PROGRAMS = [
  { id:"strength", name:"Strength Builder", sub:"8 Weeks · Progressive Overload", body:"Build serious muscle and hit new personal bests.", pills:["8 Weeks","5 Days/Week","Compound Lifts"], color:"#82b4e8", activeClass:"active-strength", btnClass:"prog-dl-strength" },
  { id:"shred", name:"4 Weeks 2 Shred", sub:"28 Days · Get Ripped · DTPXtreme", body:"Get shredded with focused training and nutrition.", pills:["28 Days","4 Days/Week","Daily Cardio"], color:"#f0a070", activeClass:"active-shred", btnClass:"prog-dl-shred" },
  { id:"bikini", name:"Bikini Program", sub:"8 Weeks · Sculpt & Tone", body:"Sculpt a toned physique with glute and lower-body focus.", pills:["8 Weeks","5 Days/Week","Glute Focus"], color:"#f0a0c8", activeClass:"active-bikini", btnClass:"prog-dl-bikini" }
];
window.MFJ_PROGRAMS_KEY = "mfj_admin_programs";
window.getMfjPrograms = function(){
  const base = Array.isArray(window.MFJ_PROGRAMS) ? window.MFJ_PROGRAMS : [];
  let admin = [];
  try { admin = JSON.parse(localStorage.getItem(window.MFJ_PROGRAMS_KEY) || "[]"); } catch(_e) {}
  return [...base, ...admin].filter(p => p && p.id && p.name);
};

(function applyMfjCosmeticPolish(){
  if (window.MFJ_DISABLE_POLISH) return;
  function ready(fn){
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function(){
    const style = document.createElement("style");
    style.textContent = `
      body{background:radial-gradient(circle at 50% -10%,rgba(255,255,255,.08),transparent 34%),#000!important;}
      body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.014) 1px,transparent 1px);background-size:42px 42px;mask-image:radial-gradient(circle at center,black,transparent 72%);opacity:.35;}
      .wrap{max-width:430px!important;}
      .badge{box-shadow:0 0 38px rgba(255,255,255,.08), inset 0 0 18px rgba(255,255,255,.035)!important;}
      .badge::after{content:"";position:absolute;width:4px;height:4px;border-radius:999px;background:#00D97E;box-shadow:0 0 16px rgba(0,217,126,.85);transform:translate(15px,-15px);}
      .wordmark{letter-spacing:4.8px!important;text-shadow:0 10px 38px rgba(255,255,255,.08)!important;}
      .wordmark-sub{color:rgba(255,255,255,.28)!important;}
      .tagline{color:rgba(255,255,255,.52)!important;letter-spacing:3px!important;font-size:9px!important;line-height:1.7!important;margin-bottom:11px!important;}
      .prog-label{color:rgba(255,255,255,.38)!important;}
      .nav-btn{transition:all .22s ease!important;}
      .nav-btn:hover{transform:translateY(-1px)!important;background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.22)!important;}
      .tab{box-shadow:inset 0 1px 0 rgba(255,255,255,.035)!important;}
      .tab.active-strength,.tab.active-shred,.tab.active-bikini{transform:translateY(-1px)!important;box-shadow:0 10px 26px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08)!important;}
      .prog-card{position:relative!important;overflow:hidden!important;border-color:rgba(255,255,255,.16)!important;background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.018))!important;box-shadow:0 22px 70px rgba(0,0,0,.52),0 0 34px rgba(255,255,255,.035)!important;padding:12px!important;animation:cardFade .32s ease both!important;}
      @keyframes cardFade{from{opacity:.65;transform:translateY(5px) scale(.99)}to{opacity:1;transform:none}}
      .prog-card::before{content:"";position:absolute;inset:-1px;background:linear-gradient(120deg,rgba(255,255,255,.12),transparent 42%,rgba(255,255,255,.04));opacity:.45;pointer-events:none;}
      .prog-card::after{content:"PREMIUM PLAN";position:absolute;right:10px;top:10px;font-size:7px;letter-spacing:1.4px;color:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:3px 7px;background:rgba(0,0,0,.18);}
      .prog-card-title,.prog-card-sub,.prog-card-body,.prog-pills,.prog-dl{position:relative;z-index:1;}
      .prog-card-title{font-size:14px!important;letter-spacing:1.35px!important;padding-right:94px!important;}
      .prog-card-sub{color:rgba(255,255,255,.65)!important;opacity:1!important;}
      .prog-card-body{color:rgba(255,255,255,.68)!important;}
      .prog-pill{background:rgba(255,255,255,.035)!important;border-color:rgba(255,255,255,.16)!important;color:rgba(255,255,255,.62)!important;}
      .prog-dl{box-shadow:inset 0 1px 0 rgba(255,255,255,.06)!important;}
      .stats{background:rgba(255,255,255,.018)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.035)!important;}
      .stat-n{font-size:16px!important;}
      .stat:hover{background:rgba(255,255,255,.04)!important;}
      .btn-login{box-shadow:0 14px 36px rgba(255,255,255,.08)!important;}
      .btn-subscribe{letter-spacing:1.65px!important;box-shadow:0 12px 36px rgba(0,217,126,.28)!important;}
      .btn-login,.btn-subscribe,.prog-dl,.submit{transition:transform .22s ease,box-shadow .22s ease,filter .22s ease!important;}
      .btn-login:hover,.btn-subscribe:hover,.submit:hover{transform:translateY(-2px) scale(1.01)!important;}
      .mfj-included{width:100%;margin:-3px 0 9px;padding:8px 10px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.018);font-size:8px;line-height:1.65;letter-spacing:1.55px;text-transform:uppercase;color:rgba(255,255,255,.36);}
      .cta-note{color:rgba(255,255,255,.28)!important;line-height:1.55!important;}
      .mfj-footer{margin-top:8px;font-size:8px;letter-spacing:1.7px;text-transform:uppercase;color:rgba(255,255,255,.16);}
      .admin-link{opacity:.18!important;transition:opacity .2s ease!important;}
      .admin-link:hover{opacity:.75!important;}
      .card,.panel{background:linear-gradient(145deg,#0d0d0d,#090909)!important;border-color:rgba(255,255,255,.13)!important;box-shadow:0 34px 95px rgba(0,0,0,.72),0 0 42px rgba(255,255,255,.03)!important;}
      input,select{border-color:rgba(255,255,255,.12)!important;background:rgba(255,255,255,.045)!important;}
      input:focus,select:focus{border-color:rgba(0,217,126,.45)!important;box-shadow:0 0 0 3px rgba(0,217,126,.08)!important;}
      .success-icon{box-shadow:0 0 32px rgba(0,217,126,.42)!important;}
      #message::after{content:"";display:block;width:46px;height:2px;margin:13px auto 0;border-radius:999px;background:linear-gradient(90deg,transparent,#00D97E,transparent);animation:mfjPulse 1.35s ease-in-out infinite;}
      @keyframes mfjPulse{0%,100%{opacity:.25;transform:scaleX(.75)}50%{opacity:1;transform:scaleX(1)}}
      @media (max-height:740px){.mfj-footer{display:none}.mfj-included{padding:6px 8px}.prog-card{padding:10px!important}}
      @media (max-width:380px){.wordmark{letter-spacing:3.8px!important}.prog-card-title{padding-right:0!important}.prog-card::after{display:none}.mfj-included{font-size:7px;letter-spacing:1.1px}}
    `;
    document.head.appendChild(style);

    const tagline = document.querySelector(".tagline");
    if(tagline) tagline.textContent = "Train With Purpose · Track Your Journey";

    const subscribe = document.querySelector(".btn-subscribe");
    if(subscribe) subscribe.innerHTML = "Start Your Journey — $2 / Week";

    const ctaNote = document.querySelector(".cta-note");
    if(ctaNote) ctaNote.innerHTML = "Cancel Anytime &nbsp;·&nbsp; Instant Signup &nbsp;·&nbsp; Access Approved Within 24hrs";

    const stats = document.querySelector(".stats");
    if(stats && !document.querySelector(".mfj-included")){
      const included = document.createElement("div");
      included.className = "mfj-included";
      included.innerHTML = "Workout Plans · Member Dashboard · Program Access · Progress Tracking";
      stats.parentNode.insertBefore(included, stats);
    }

    const cta = document.querySelector(".cta-note");
    if(cta && !document.querySelector(".mfj-footer")){
      const footer = document.createElement("div");
      footer.className = "mfj-footer";
      footer.textContent = "© My Fit Journey · Premium Fitness Programs";
      cta.insertAdjacentElement("afterend", footer);
    }
  });
})();

(function enableMfjFocusSession(){
  function onReady(fn){
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  onReady(function(){
    const app = document.querySelector('.app');
    const content = document.getElementById('content');
    if(!app || !content) return;

    const KEY = 'mfj_focus_session_mode';
    const style = document.createElement('style');
    style.textContent = `
      .mfj-focus-toggle{position:fixed;right:14px;bottom:calc(env(safe-area-inset-bottom) + 16px);z-index:120;border:1px solid rgba(255,255,255,.2);background:rgba(5,5,6,.92);color:#fff;border-radius:999px;padding:10px 14px;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.4)}
      .mfj-focus-session header .brand,.mfj-focus-session header .topRow,.mfj-focus-session header .meta,.mfj-focus-session header .actions .pill,.mfj-focus-session header .actions .ghost,.mfj-focus-session header .actions .primary{display:none!important}
      .mfj-focus-session header{position:sticky;top:0;padding:8px 14px!important;min-height:48px}
      .mfj-focus-session .panelHead p{display:none!important}
      .mfj-focus-session .content{gap:10px!important}
      .mfj-focus-session .card{opacity:.35;transform:scale(.98);transition:all .2s ease}
      .mfj-focus-session .card.mfj-focus-current{opacity:1;transform:scale(1);border-color:rgba(255,255,255,.35)!important;box-shadow:0 0 0 1px rgba(255,255,255,.16),0 14px 30px rgba(0,0,0,.45)!important}
      .mfj-focus-session .progressWrap{position:sticky;bottom:0;z-index:55}
      .mfj-focus-session .mfj-focus-toggle{background:#00D97E;color:#000;border-color:rgba(0,0,0,.25)}
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.className = 'mfj-focus-toggle';
    btn.type = 'button';

    function updateFocusCard(){
      const cards = [...document.querySelectorAll('.content .card')];
      cards.forEach(c=>c.classList.remove('mfj-focus-current'));
      const uncheckedChip = document.querySelector('.content .chip:not(.checked)');
      const target = uncheckedChip ? uncheckedChip.closest('.card') : cards[0];
      if(target) target.classList.add('mfj-focus-current');
    }

    function setMode(on){
      document.body.classList.toggle('mfj-focus-session', on);
      btn.textContent = on ? 'Exit Focus' : 'Focus Session';
      localStorage.setItem(KEY, on ? '1' : '0');
      if(on) updateFocusCard();
    }

    btn.addEventListener('click', function(){ setMode(!document.body.classList.contains('mfj-focus-session')); });
    document.body.appendChild(btn);

    content.addEventListener('click', function(ev){
      const chip = ev.target.closest('.chip');
      if(!chip || !document.body.classList.contains('mfj-focus-session')) return;
      setTimeout(updateFocusCard, 0);
    });

    const startOn = localStorage.getItem(KEY) === '1';
    setMode(startOn);
  });
})();
