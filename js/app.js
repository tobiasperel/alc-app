/* =========================================================================
   app.js — framework del curso: TOC, router, render KaTeX, widgets, progreso
   ========================================================================= */
(function(){
"use strict";

const CHAPTERS = (window.ALC_CONTENT||[]).slice().sort((a,b)=>a.order-b.order);
const LESSONS=[]; // lista plana en orden
CHAPTERS.forEach(ch=>ch.lessons.forEach(ls=>LESSONS.push({...ls,chap:ch})));
const byId=id=>LESSONS.find(l=>l.id===id);

/* ---------- progreso ---------- */
const PKEY="alc-progress-v1";
const loadProg=()=>{try{return JSON.parse(localStorage.getItem(PKEY))||{}}catch(e){return{}}};
const saveProg=p=>localStorage.setItem(PKEY,JSON.stringify(p));
let progress=loadProg();
function pct(){const tot=LESSONS.length||1;const done=LESSONS.filter(l=>progress[l.id]).length;return Math.round(100*done/tot);}
function chapPct(ch){const t=ch.lessons.length||1;const d=ch.lessons.filter(l=>progress[l.id]).length;return Math.round(100*d/t);}

/* ---------- KaTeX ---------- */
function renderMath(el){
  if(!window.renderMathInElement)return;
  try{renderMathInElement(el,{delimiters:[
    {left:"$$",right:"$$",display:true},
    {left:"\\[",right:"\\]",display:true},
    {left:"$",right:"$",display:false},
    {left:"\\(",right:"\\)",display:false}
  ],throwOnError:false,trust:true});}catch(e){console.warn(e);}
}

/* ---------- TOC ---------- */
function buildTOC(){
  const toc=document.getElementById("toc");
  let html=`<div class="toc-lessons" style="padding-left:0;margin-bottom:10px">
    <li data-goto="home"><span class="dot" style="border:none">🏠</span> Inicio</li></div>`;
  CHAPTERS.forEach(ch=>{
    html+=`<div class="toc-chapter ${ch.order>0?'collapsed':''}" data-chap="${ch.id}">
      <div class="toc-chap-head" data-toggle="${ch.id}">
        <span class="chap-num">${ch.order===0?'·':ch.order}</span>
        <span>${ch.title}</span><span class="chevron">▾</span>
      </div>
      <ul class="toc-lessons">
        ${ch.lessons.map(l=>`<li data-goto="${l.id}"><span class="dot"></span><span>${l.title}</span></li>`).join("")}
      </ul></div>`;
  });
  toc.innerHTML=html;
  toc.querySelectorAll("[data-toggle]").forEach(h=>h.addEventListener("click",()=>{
    h.parentElement.classList.toggle("collapsed");
  }));
  toc.querySelectorAll("[data-goto]").forEach(li=>li.addEventListener("click",()=>go(li.dataset.goto)));
}
function refreshTOC(activeId){
  document.querySelectorAll(".toc-lessons li").forEach(li=>{
    const id=li.dataset.goto;
    li.classList.toggle("active",id===activeId);
    li.classList.toggle("done",!!progress[id]);
  });
  // abrir el capítulo activo
  const l=byId(activeId);
  if(l){const chDiv=document.querySelector(`.toc-chapter[data-chap="${l.chap.id}"]`);if(chDiv)chDiv.classList.remove("collapsed");}
}

/* ---------- progreso UI ---------- */
function refreshProgress(){
  const p=pct();
  document.getElementById("progressFill").style.width=p+"%";
  document.getElementById("progressText").textContent=p+"%";
}

/* ---------- montaje de widgets / interacciones ---------- */
function mountWidgets(root){
  root.querySelectorAll("[data-widget]").forEach(el=>{
    const name=el.dataset.widget;let args={};
    try{args=el.dataset.args?JSON.parse(el.dataset.args):{}}catch(e){console.warn("args",e);}
    if(window.WIDGETS&&window.WIDGETS[name]){
      try{window.WIDGETS[name](el,args);}catch(e){el.innerHTML=`<div class="box warn">Error en widget ${name}: ${e.message}</div>`;console.error(e);}
    }
  });
}
function bindInteractions(root){
  // ejercicios: mostrar solución
  root.querySelectorAll(".toggle-sol").forEach(b=>b.addEventListener("click",()=>{
    const ej=b.closest(".ejercicio");ej.classList.toggle("open");
    b.textContent=ej.classList.contains("open")?"Ocultar solución":"Ver solución";
  }));
  // quiz
  root.querySelectorAll(".quiz").forEach(q=>{
    const fb=q.querySelector(".feedback");
    q.querySelectorAll(".opt").forEach(opt=>opt.addEventListener("click",()=>{
      if(q.dataset.answered)return;q.dataset.answered="1";
      const ok=opt.dataset.correct==="1";
      opt.classList.add(ok?"correct":"wrong");
      if(!ok)q.querySelector('.opt[data-correct="1"]').classList.add("correct");
      if(fb){fb.innerHTML=ok?'<span style="color:var(--good)">✓ ¡Correcto!</span> ':'<span style="color:var(--bad)">✗ </span>';
        fb.innerHTML+=opt.dataset.exp||q.dataset.exp||"";renderMath(fb);}
    }));
  });
  // links internos
  root.querySelectorAll("[data-goto]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();go(a.dataset.goto);}));
}

/* ---------- render de lección ---------- */
function renderLesson(id){
  const l=byId(id);const art=document.getElementById("lesson");
  document.getElementById("lessonNav").style.display="flex";
  art.innerHTML=`<div class="lesson-kicker">${l.chap.title}</div>
    <h1>${l.title}</h1>${typeof l.body==="function"?l.body():l.body}`;
  renderMath(art);mountWidgets(art);bindInteractions(art);
  // nav buttons
  const idx=LESSONS.indexOf(byId(id));
  const prev=document.getElementById("prevBtn"),next=document.getElementById("nextBtn"),cb=document.getElementById("completeBtn");
  prev.disabled=idx<=0;next.disabled=idx>=LESSONS.length-1;
  prev.onclick=()=>idx>0&&go(LESSONS[idx-1].id);
  next.onclick=()=>idx<LESSONS.length-1&&go(LESSONS[idx+1].id);
  const done=!!progress[id];
  cb.classList.toggle("done",done);cb.textContent=done?"✓ Visto":"Marcar como visto ✓";
  cb.onclick=()=>{progress[id]=!progress[id];saveProg(progress);refreshTOC(id);refreshProgress();
    cb.classList.toggle("done",!!progress[id]);cb.textContent=progress[id]?"✓ Visto":"Marcar como visto ✓";};
  window.scrollTo({top:0,behavior:"instant"});
}

/* ---------- portada ---------- */
function renderHome(){
  document.getElementById("lessonNav").style.display="none";
  const art=document.getElementById("lesson");
  art.innerHTML=`
  <div class="home-hero">
    <h1>Álgebra Lineal Computacional</h1>
    <p>Curso interactivo para preparar el final. Recorré la materia <strong>tema por tema</strong>,
    con teoría, ejemplos resueltos, ejercicios del apunte y <strong>demos que calculan en vivo</strong>
    (eliminación, LU, QR, autovalores, SVD, métodos iterativos y más).</p>
    <div class="chip-row">
      <span class="pill">Basado en las notas de Acosta–Laplagne (UBA)</span>
      <span class="pill">Tu progreso se guarda en este dispositivo</span>
    </div>
  </div>
  <div class="box tip"><div class="box-title">🚀 ¿Cómo usar la app?</div>
    Avanzá en orden con <em>Siguiente →</em>. Tocá <em>“Marcar como visto”</em> para llevar el control.
    En las cajas violetas hay <strong>demos interactivas</strong>: cambiá las matrices y mirá cómo cambian las cuentas.
    Usá el <strong>buscador</strong> de arriba para saltar a cualquier definición o método.</div>
  <h2>Mapa de la materia</h2>
  <div class="card-grid">${CHAPTERS.filter(c=>c.order>0).map(ch=>`
    <div class="cap-card" data-goto="${ch.lessons[0].id}">
      <div class="cap-card-num">Capítulo ${ch.order}</div>
      <h3>${ch.title}</h3><p>${ch.blurb||""}</p>
      <div class="cap-card-bar"><span style="width:${chapPct(ch)}%"></span></div>
    </div>`).join("")}</div>
  <h2>Antes de empezar</h2>
  <div class="card-grid">${CHAPTERS[0].lessons.map(l=>`
    <div class="cap-card" data-goto="${l.id}"><div class="cap-card-num">Intro</div><h3>${l.title}</h3></div>`).join("")}</div>`;
  bindInteractions(art);refreshTOC("home");
  window.scrollTo({top:0,behavior:"instant"});
}

/* ---------- router ---------- */
function go(id){location.hash="#/"+id;}
function route(){
  const id=(location.hash||"").replace(/^#\//,"")||"home";
  closeSidebar();
  if(id==="home"||!byId(id))renderHome();
  else{renderLesson(id);refreshTOC(id);}
}
window.addEventListener("hashchange",route);

/* ---------- búsqueda ---------- */
const searchIndex=LESSONS.map(l=>{
  const tmp=document.createElement("div");tmp.innerHTML=typeof l.body==="function"?"":l.body;
  const text=(tmp.textContent||"").toLowerCase();
  return {id:l.id,title:l.title,chap:l.chap.title,kw:((l.keywords||[]).join(" ")+" "+text).toLowerCase()};
});
function doSearch(q){
  const box=document.getElementById("searchResults");
  q=q.trim().toLowerCase();
  if(!q){box.hidden=true;return;}
  const terms=q.split(/\s+/);
  const res=searchIndex.map(it=>{
    let score=0;const hay=(it.title.toLowerCase()+" "+it.chap.toLowerCase()+" "+it.kw);
    terms.forEach(t=>{if(it.title.toLowerCase().includes(t))score+=5;if(hay.includes(t))score+=1;});
    return {...it,score};
  }).filter(r=>r.score>0).sort((a,b)=>b.score-a.score).slice(0,8);
  box.hidden=res.length===0;
  box.innerHTML=res.map((r,i)=>`<div class="sr-item${i===0?' active':''}" data-goto="${r.id}">${r.title}<small>${r.chap}</small></div>`).join("");
  box.querySelectorAll(".sr-item").forEach(it=>it.addEventListener("mousedown",e=>{e.preventDefault();go(it.dataset.goto);document.getElementById("search").value="";box.hidden=true;}));
}

/* ---------- sidebar móvil ---------- */
function openSidebar(){document.getElementById("sidebar").classList.add("open");document.getElementById("sidebarBackdrop").classList.add("show");}
function closeSidebar(){document.getElementById("sidebar").classList.remove("open");document.getElementById("sidebarBackdrop").classList.remove("show");}

/* ---------- init ---------- */
function init(){
  buildTOC();refreshProgress();
  // tema
  const t=localStorage.getItem("alc-theme")||"light";
  if(t==="dark")document.documentElement.dataset.theme="dark";
  document.getElementById("themeToggle").textContent=t==="dark"?"☀️":"🌙";
  document.getElementById("themeToggle").onclick=()=>{
    const dark=document.documentElement.dataset.theme==="dark";
    if(dark)delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme="dark";
    localStorage.setItem("alc-theme",dark?"light":"dark");
    document.getElementById("themeToggle").textContent=dark?"🌙":"☀️";
  };
  document.getElementById("menuToggle").onclick=openSidebar;
  document.getElementById("sidebarBackdrop").onclick=closeSidebar;
  const s=document.getElementById("search");
  s.addEventListener("input",()=>doSearch(s.value));
  s.addEventListener("keydown",e=>{if(e.key==="Enter"){const a=document.querySelector(".sr-item.active");if(a){go(a.dataset.goto);s.value="";document.getElementById("searchResults").hidden=true;}}});
  s.addEventListener("blur",()=>setTimeout(()=>document.getElementById("searchResults").hidden=true,150));
  // flechas teclado
  document.addEventListener("keydown",e=>{
    if(/input|textarea|select/i.test(document.activeElement.tagName))return;
    const cur=(location.hash||"").replace(/^#\//,"");const idx=LESSONS.findIndex(l=>l.id===cur);
    if(e.key==="ArrowRight"&&idx<LESSONS.length-1&&idx>=0)go(LESSONS[idx+1].id);
    if(e.key==="ArrowLeft"&&idx>0)go(LESSONS[idx-1].id);
  });
  // esperar KaTeX
  if(window.renderMathInElement)route();
  else{let n=0;const t2=setInterval(()=>{if(window.renderMathInElement||n++>40){clearInterval(t2);route();}},50);}
}
if(document.readyState!=="loading")init();else document.addEventListener("DOMContentLoaded",init);
})();
