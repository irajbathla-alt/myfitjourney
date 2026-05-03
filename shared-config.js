window.MFJ_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFaX1x1qPqDqGj1OWpLoJR5mhXx1LA7qARA8ipEQEib-1MJ1DRWyVgi7jvatpJ5rw/exec";
window.MFJ_APP_KEY = "MFJ_PUBLIC_APP";
window.MFJ_SECRET = "JFC" + "2026" + "PRIVATEKEY";
window.MFJ_PROGRAMS = [
  { id:"strength", name:"Strength Builder", sub:"8 Weeks · Progressive Overload", body:"Build serious muscle and hit new personal bests.", pills:["Muscle Build","8 Weeks","5 Days/Week","Compound Lifts"], color:"#82b4e8", activeClass:"active-strength", btnClass:"prog-dl-strength" },
  { id:"shred", name:"4 Weeks 2 Shred", sub:"28 Days · Get Ripped · DTPXtreme", body:"Get shredded with focused training and nutrition.", pills:["Fat Loss","28 Days","4 Days/Week","Daily Cardio"], color:"#f0a070", activeClass:"active-shred", btnClass:"prog-dl-shred" },
  { id:"bikini", name:"Bikini Program", sub:"8 Weeks · Sculpt & Tone", body:"Sculpt a toned physique with glute and lower-body focus.", pills:["Sculpt","8 Weeks","5 Days/Week","Glute Focus"], color:"#f0a0c8", activeClass:"active-bikini", btnClass:"prog-dl-bikini" }
];
window.MFJ_PROGRAMS_KEY = "mfj_admin_programs";
window.getMfjPrograms = function(){
  const base = Array.isArray(window.MFJ_PROGRAMS) ? window.MFJ_PROGRAMS : [];
  let admin = [];
  try { admin = JSON.parse(localStorage.getItem(window.MFJ_PROGRAMS_KEY) || "[]"); } catch(_e) {}
  return [...base, ...admin].filter(p => p && p.id && p.name);
};

(function applyMfjCosmeticPolish(){
  function ready(fn){
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function(){
    const style = document.createElement("style");
    style.textContent = `
      body{background:radial-gradient(circle at 50% -10%,rgba(255,255,255,.08),transparent 34%),#000!important;}
      .wrap{max-width:430px!important;}
      .badge{box-shadow:0 0 38px rgba(255,255,255,.08), inset 0 0 18px rgba(255,255,255,.035)!important;}
      .wordmark{letter-spacing:4.8px!important;text-shadow:0 10px 38px rgba(255,255,255,.08)!important;}
      .wordmark-sub{color:rgba(255,255,255,.28)!important;}
      .tagline{color:rgba(255,255,255,.52)!important;letter-spacing:3px!important;font-size:9px!important;line-height:1.7!important;margin-bottom:11px!important;}
      .prog-label{color:rgba(255,255,255,.38)!important;}
      .nav-btn{transition:all .22s ease!important;}
      .nav-btn:hover{transform:translateY(-1px)!important;background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.22)!important;}
      .tab{box-shadow:inset 0 1px 0 rgba(255,255,255,.035)!important;}
      .prog-card{position:relative!important;overflow:hidden!important;border-color:rgba(255,255,255,.16)!important;background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.018))!important;box-shadow:0 22px 70px rgba(0,0,0,.52),0 0 34px rgba(255,255,255,.035)!important;padding:12px!important;}
      .prog-card::before{content:"";position:absolute;inset:-1px;background:linear-gradient(120deg,rgba(255,255,255,.12),transparent 42%,rgba(255,255,255,.04));opacity:.45;pointer-events:none;}
      .prog-card-title,.prog-card-sub,.prog-card-body,.prog-pills,.prog-dl{position:relative;z-index:1;}
      .prog-card-title{font-size:14px!important;letter-spacing:1.35px!important;}
      .prog-card-sub{color:rgba(255,255,255,.65)!important;opacity:1!important;}
      .prog-card-body{color:rgba(255,255,255,.68)!important;}
      .prog-pill{background:rgba(255,255,255,.035)!important;border-color:rgba(255,255,255,.16)!important;color:rgba(255,255,255,.62)!important;}
      .stats{background:rgba(255,255,255,.018)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.035)!important;}
      .btn-login{box-shadow:0 14px 36px rgba(255,255,255,.08)!important;}
      .btn-subscribe{letter-spacing:1.65px!important;box-shadow:0 12px 36px rgba(0,217,126,.28)!important;}
      .mfj-included{width:100%;margin:-3px 0 9px;padding:8px 10px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.018);font-size:8px;line-height:1.65;letter-spacing:1.55px;text-transform:uppercase;color:rgba(255,255,255,.36);}
      .cta-note{color:rgba(255,255,255,.28)!important;line-height:1.55!important;}
      .mfj-footer{margin-top:8px;font-size:8px;letter-spacing:1.7px;text-transform:uppercase;color:rgba(255,255,255,.16);}
      .admin-link{opacity:.28!important;transition:opacity .2s ease!important;}
      .admin-link:hover{opacity:.75!important;}
      @media (max-height:740px){.mfj-footer{display:none}.mfj-included{padding:6px 8px}.prog-card{padding:10px!important}}
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
