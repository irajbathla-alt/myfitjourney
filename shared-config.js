window.MFJ_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFaX1x1qPqDqGj1OWpLoJR5mhXx1LA7qARA8ipEQEib-1MJ1DRWyVgi7jvatpJ5rw/exec";
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
