// ==============================
// 🎨 CANVAS HOLI ENGINE
// ==============================
const canvas = document.getElementById("holiCanvas");
const ctx = canvas.getContext("2d");

// Retina-safe canvas
function resizeCanvas(){
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
resizeCanvas();
addEventListener("resize", resizeCanvas);

let particles = [];
let hearts = [];

// 🌈 Color generator
function color(){
  return `hsl(${Math.random()*360},100%,60%)`;
}

// ✨ Particle class
class Particle{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.size=Math.random()*4+2;
    this.vx=(Math.random()-0.5)*2;
    this.vy=(Math.random()-0.5)*2;
    this.life=200;
    this.color=color();
  }

  update(){
    this.x+=this.vx;
    this.y+=this.vy;
    this.life--;
  }

  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=this.color;
    ctx.globalAlpha=Math.max(0,this.life/200);
    ctx.fill();
  }
}

// ❤️ Floating Hearts
class Heart{
  constructor(){
    this.x = Math.random()*canvas.width;
    this.y = innerHeight + 20;
    this.size = Math.random()*10 + 8;
    this.speed = Math.random()*1 + 0.5;
    this.color = color();
    this.life = 400;
  }

  update(){
    this.y -= this.speed;
    this.life--;
  }

  draw(){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.size/10, this.size/10);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life / 400;

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(5,-5,10,5,0,12);
    ctx.bezierCurveTo(-10,5,-5,-5,0,0);
    ctx.fill();

    ctx.restore();
  }
}

// 💥 Splash
function splash(x,y,count=80){
  for(let i=0;i<count;i++){
    particles.push(new Particle(x,y));
  }
}

// Continuous background splashes
setInterval(()=>{
  splash(Math.random()*innerWidth,Math.random()*innerHeight,10);
},400);

// Floating hearts spawn
setInterval(()=>{
  if(hearts.length < 30){
    hearts.push(new Heart());
  }
},800);

// Desktop click
canvas.addEventListener("click",e=>{
  splash(e.clientX,e.clientY,120);
});

// Mobile touch
canvas.addEventListener("touchstart",e=>{
  const t=e.touches[0];
  splash(t.clientX,t.clientY,120);
});

// Animation loop
function animate(){
  ctx.fillStyle="rgba(0,0,0,0.15)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  hearts = hearts.filter(h => h.life > 0);
  hearts.forEach(h=>{ h.update(); h.draw(); });

  particles = particles.filter(p => p.life > 0);
  particles.forEach(p=>{ p.update(); p.draw(); });

  requestAnimationFrame(animate);
}
animate();


// ==============================
// 😂 GREETING ENGINE
// ==============================
const jokes=[
"May your WiFi be fast and colors faster 🌈😂",
"Hope your crush throws gulal not attitude 💀🌸",
"May your Holi be brighter than your future ✨😂",
"Don’t drink bhang and text your ex 💀🌈",
"Stay colorful, not chaotic 😂🎨"
];

let currentGreeting="";

function generateGreeting(){
  const name=document.getElementById("nameInput").value || "Friend";
  const joke=jokes[Math.random()*jokes.length|0];
  currentGreeting=`Happy Holi ${name}! ${joke}`;
  document.getElementById("funnyText").innerText=currentGreeting;
}

function copyGreeting(){
  if(!currentGreeting) return alert("Generate a wish first 😄");
  navigator.clipboard.writeText(currentGreeting);
  alert("Copied! Send to friends 🌈");
}


// ==============================
// 🎶 SONG UPLOAD
// ==============================
const audio=document.getElementById("music");
const upload=document.getElementById("songUpload");

upload.addEventListener("change",e=>{
  const file=e.target.files[0];
  if(!file) return;

  const reader=new FileReader();
  reader.onload=e=>{
    audio.src=e.target.result;
    audio.play();
  };
  reader.readAsDataURL(file);
});


// ==============================
// 🔗 SHARE LINK
// ==============================
function createShareLink(){
  if(!currentGreeting){
    alert("Generate greeting first 😄");
    return;
  }

  const payload={ text: currentGreeting };

  const encoded=btoa(
    encodeURIComponent(JSON.stringify(payload))
  );

  const link=`${location.origin}${location.pathname}?c=${encoded}`;
  navigator.clipboard.writeText(link);
  alert("Short link copied 🌈✨");
}


// ==============================
// 🔄 LOAD FROM LINK
// ==============================
(function(){
  const params=new URLSearchParams(location.search);
  const data=params.get("c");
  if(!data) return;

  try{
    const decoded=JSON.parse(
      decodeURIComponent(atob(data))
    );

    if(decoded.text){
      currentGreeting=decoded.text;
      document.getElementById("funnyText").innerText=decoded.text;
    }
  }catch(e){
    console.log("Invalid Holi link");
  }
})();
