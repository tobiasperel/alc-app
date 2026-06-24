/* =========================================================================
   widgets.js — demos interactivas. window.WIDGETS[name](el, args)
   ========================================================================= */
(function(){
"use strict";
const LA=window.LA;
const kt=(tex,d=false)=>{try{return katex.renderToString(tex,{throwOnError:false,displayMode:d,trust:true});}catch(e){return tex;}};
const h=(html)=>{const t=document.createElement("template");t.innerHTML=html.trim();return t.content.firstChild;};
const shell=(el,ico,title,sub)=>{
  el.classList.add("widget");
  el.innerHTML=`<div class="widget-head"><span class="w-ico">${ico}</span><div><strong>${title}</strong>${sub?` <small>· ${sub}</small>`:""}</div></div><div class="widget-body"></div>`;
  return el.querySelector(".widget-body");
};
// editor de matriz
function gridEditor({r,c,vals,step="any",w=50}){
  const node=document.createElement("div");node.className="matrix-grid";
  node.style.gridTemplateColumns=`repeat(${c},auto)`;
  const inputs=[];
  for(let i=0;i<r;i++){inputs[i]=[];for(let j=0;j<c;j++){
    const inp=document.createElement("input");inp.type="number";inp.step=step;inp.style.width=w+"px";
    inp.value=vals&&vals[i]&&vals[i][j]!=null?vals[i][j]:0;node.appendChild(inp);inputs[i][j]=inp;}}
  return {node,read:()=>inputs.map(row=>row.map(x=>parseFloat(x.value)||0)),
    set:(m)=>{for(let i=0;i<r;i++)for(let j=0;j<c;j++)inputs[i][j].value=m[i][j];},inputs};
}
const matBox=(A,tag)=>`<div style="display:inline-block;text-align:center;margin:4px"><div class="matrix-render">${LA.matStr(A)}</div>${tag?`<div class="mtag">${tag}</div>`:""}</div>`;
const tex=(t,d=false)=>{const s=document.createElement("span");s.innerHTML=kt(t,d);return s;};

/* mini gráfico de líneas */
function lineChart(canvas,series,{logy=false,labels}={}){
  const ctx=canvas.getContext("2d"),W=canvas.width,H=canvas.height,pad=34;
  ctx.clearRect(0,0,W,H);
  const xs=series[0].map((_,i)=>i);
  let all=[].concat(...series.map(s=>s));
  let lo=Math.min(...all),hi=Math.max(...all);
  if(logy){all=all.map(v=>Math.log10(Math.max(v,1e-16)));lo=Math.min(...all);hi=Math.max(...all);series=series.map(s=>s.map(v=>Math.log10(Math.max(v,1e-16))));}
  if(hi===lo)hi=lo+1;
  const X=i=>pad+(W-pad-8)*i/Math.max(1,xs.length-1);
  const Y=v=>H-pad-(H-pad-8)*(v-lo)/(hi-lo);
  const css=getComputedStyle(document.body);
  ctx.strokeStyle=css.getPropertyValue("--line");ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(pad,8);ctx.lineTo(pad,H-pad);ctx.lineTo(W-8,H-pad);ctx.stroke();
  ctx.fillStyle=css.getPropertyValue("--ink-soft");ctx.font="10px monospace";
  ctx.fillText(logy?`10^${hi.toFixed(0)}`:hi.toFixed(2),2,12);
  ctx.fillText(logy?`10^${lo.toFixed(0)}`:lo.toFixed(2),2,H-pad);
  ctx.fillText("iteración",W/2-20,H-6);
  const colors=[css.getPropertyValue("--accent"),css.getPropertyValue("--accent-2"),"#e11d48","#d97706"];
  series.forEach((s,k)=>{ctx.strokeStyle=colors[k%colors.length];ctx.lineWidth=2;ctx.beginPath();
    s.forEach((v,i)=>{const x=X(i),y=Y(v);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
    s.forEach((v,i)=>{ctx.fillStyle=colors[k%colors.length];ctx.beginPath();ctx.arc(X(i),Y(v),2.2,0,7);ctx.fill();});});
  if(labels){ctx.font="11px sans-serif";labels.forEach((lab,k)=>{ctx.fillStyle=colors[k%colors.length];ctx.fillText(lab,W-100,16+k*14);});}
}

const W={};

/* ===== 1. Calculadora de operaciones ===== */
W.matrixOps=(el,a={})=>{
  const body=shell(el,"🧮","Calculadora matricial","probá operaciones");
  const A0=a.A||[[1,2],[3,4]],B0=a.B||[[1,0],[0,1]];
  body.innerHTML=`<div class="controls">
    <label>A <select class="dimA"></select></label>
    <span class="ga"></span>
    <label>B <select class="dimB"></select></label>
    <span class="gb"></span></div>
    <div class="controls">
      <select class="op">
        <option value="mul">A · B (producto)</option><option value="add">A + B</option>
        <option value="sub">A − B</option><option value="tA">Aᵀ</option>
        <option value="det">det(A)</option><option value="inv">A⁻¹</option><option value="scal">k·A</option>
      </select>
      <label class="kwrap" hidden>k <input type="number" class="k" value="2" step="any" style="width:54px"></label>
      <button class="btn calc">Calcular</button></div>
    <div class="out"></div>`;
  const dims=[1,2,3,4];
  const fill=s=>dims.forEach(d=>s.insertAdjacentHTML("beforeend",`<option ${d===2?"selected":""}>${d}</option>`));
  fill(body.querySelector(".dimA"));fill(body.querySelector(".dimB"));
  let gA=gridEditor({r:A0.length,c:A0[0].length,vals:A0}),gB=gridEditor({r:B0.length,c:B0[0].length,vals:B0});
  body.querySelector(".ga").appendChild(gA.node);body.querySelector(".gb").appendChild(gB.node);
  const rebuild=()=>{const ra=+body.querySelector(".dimA").value,rb=+body.querySelector(".dimB").value;
    const ng=gridEditor({r:ra,c:ra,vals:gA.read()});body.querySelector(".ga").replaceChild(ng.node,gA.node);gA=ng;
    const ngb=gridEditor({r:rb,c:rb,vals:gB.read()});body.querySelector(".gb").replaceChild(ngb.node,gB.node);gB=ngb;};
  body.querySelector(".dimA").onchange=rebuild;body.querySelector(".dimB").onchange=rebuild;
  body.querySelector(".op").onchange=e=>body.querySelector(".kwrap").hidden=e.target.value!=="scal";
  body.querySelector(".calc").onclick=()=>{
    const A=gA.read(),B=gB.read(),op=body.querySelector(".op").value,out=body.querySelector(".out");
    try{let res,tag;
      if(op==="mul"){if(A[0].length!==B.length)throw new Error("Dimensiones incompatibles: cols(A) ≠ filas(B)");res=LA.matmul(A,B);tag="A·B";}
      else if(op==="add"){res=LA.madd(A,B);tag="A+B";}
      else if(op==="sub"){res=LA.msub(A,B);tag="A−B";}
      else if(op==="tA"){res=LA.transpose(A);tag="Aᵀ";}
      else if(op==="scal"){res=LA.mscale(A,+body.querySelector(".k").value);tag="k·A";}
      else if(op==="det"){out.innerHTML=`<div class="kpi"><b>${LA.fmt(LA.det(A))}</b><span>det(A)</span></div>`;return;}
      else if(op==="inv"){res=LA.inv(A);tag="A⁻¹";}
      out.innerHTML=matBox(res,tag);
    }catch(e){out.innerHTML=`<div class="box warn">${e.message}</div>`;}
  };
};

/* ===== 2. Eliminación gaussiana + clasificación ===== */
W.gaussElim=(el,a={})=>{
  const body=shell(el,"📐","Eliminación gaussiana","escalonado paso a paso + clasificación");
  const A0=a.A||[[1,5,5,2],[2,2,-3,-1],[-1,-9,2,9]];
  const aug=a.augmented!==false; // por defecto última col = términos indep.
  body.innerHTML=`<div class="controls">
     <label>filas <input type="number" class="r" min="1" max="6" value="${A0.length}"></label>
     <label>cols <input type="number" class="c" min="1" max="7" value="${A0[0].length}"></label>
     <label><input type="checkbox" class="aug" ${aug?"checked":""}> matriz ampliada (Ax=b)</label>
     <button class="btn go">Escalonar</button></div>
     <div class="ge"></div><div class="steps out"></div>`;
  let g=gridEditor({r:A0.length,c:A0[0].length,vals:A0});body.querySelector(".ge").appendChild(g.node);
  const reb=()=>{const r=+body.querySelector(".r").value,c=+body.querySelector(".c").value;
    const ng=gridEditor({r,c,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;};
  body.querySelector(".r").onchange=reb;body.querySelector(".c").onchange=reb;
  body.querySelector(".go").onclick=()=>{
    const M=g.read(),out=body.querySelector(".out");const {R,steps,rank}=LA.rref(M,{reduced:true});
    let html=`<div class="steps">${steps.map(s=>`<div class="step"><div class="step-op">${s.op}</div><div class="matrix-render">${LA.matStr(s.A)}</div></div>`).join("")||"<div class='hint'>Ya estaba escalonada.</div>"}`;
    html+=`<div class="step"><div class="step-op">Forma escalonada reducida (RREF)</div><div class="matrix-render">${LA.matStr(R)}</div></div></div>`;
    // clasificación si es ampliada
    if(body.querySelector(".aug").checked){
      const n=M[0].length-1;const Acoef=R.map(r=>r.slice(0,n));
      const rankA=LA.rref(M.map(r=>r.slice(0,n))).rank, rankAb=rank;
      let cls,col;
      if(rankAb>rankA){cls="Sistema INCOMPATIBLE (no tiene solución): apareció una fila 0…0 | ≠0";col="bad";}
      else if(rankA===n){cls="Sistema COMPATIBLE DETERMINADO: solución única";col="good";}
      else{cls=`Sistema COMPATIBLE INDETERMINADO: ∞ soluciones (${n-rankA} variable(s) libre(s))`;col="warn";}
      html+=`<div class="box ${col}" style="margin-top:10px"><strong>rg(A)=${rankA}, rg(A|b)=${rankAb}, n=${n} incógnitas.</strong><br>${cls}</div>`;
    }else{html+=`<div class="box note" style="margin-top:10px">Rango = ${rank} (filas no nulas).</div>`;}
    out.innerHTML=html;
  };
};

/* ===== 3. LU / PLU ===== */
W.luDemo=(el,a={})=>{
  const body=shell(el,"🔻","Factorización LU / PLU","triangulación por matrices triangulares");
  const A0=a.A||[[2,1,1],[4,3,3],[8,7,9]];
  body.innerHTML=`<div class="controls"><label>n <input type="number" class="n" min="2" max="5" value="${A0.length}"></label>
    <label><input type="checkbox" class="piv"> pivoteo parcial (PLU)</label>
    <button class="btn go">Factorizar</button></div><div class="ge"></div><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0.length,vals:A0});body.querySelector(".ge").appendChild(g.node);
  body.querySelector(".n").onchange=()=>{const n=+body.querySelector(".n").value;const ng=gridEditor({r:n,c:n,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;};
  body.querySelector(".go").onclick=()=>{
    const A=g.read(),out=body.querySelector(".out"),piv=body.querySelector(".piv").checked;
    try{
      if(piv){const {P,L,U}=LA.plu(A);
        out.innerHTML=`<p>Se obtiene <b>PA = LU</b>:</p>${matBox(P,"P")}${matBox(L,"L")}${matBox(U,"U")}
        <p class="hint">Verificación PA − LU (debe ser 0):</p>${matBox(LA.msub(LA.matmul(P,A),LA.matmul(L,U)))}`;
      }else{const {L,U,steps}=LA.lu(A);
        out.innerHTML=`<div class="steps">${steps.map(s=>`<div class="step"><div class="step-op">${s.op} &nbsp;→&nbsp; multiplicador guardado en L</div><div class="flex">${matBox(s.L,"L")}${matBox(s.U,"U")}</div></div>`).join("")}</div>
        <p>Resultado <b>A = LU</b>:</p>${matBox(L,"L")}${matBox(U,"U")}<p class="hint">A − LU:</p>${matBox(LA.msub(A,LA.matmul(L,U)))}`;
      }
    }catch(e){out.innerHTML=`<div class="box warn">${e.message}</div>`;}
  };
};

/* ===== 4. Cholesky ===== */
W.choleskyDemo=(el,a={})=>{
  const body=shell(el,"✳️","Cholesky  A = L Lᵀ","matrices simétricas definidas positivas");
  const A0=a.A||[[4,2,2],[2,5,1],[2,1,3]];
  body.innerHTML=`<div class="controls"><label>n <input type="number" class="n" min="2" max="5" value="${A0.length}"></label><button class="btn go">Calcular</button> <span class="hint">(usá una matriz simétrica y DP)</span></div><div class="ge"></div><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0.length,vals:A0});body.querySelector(".ge").appendChild(g.node);
  body.querySelector(".n").onchange=()=>{const n=+body.querySelector(".n").value;const ng=gridEditor({r:n,c:n,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;};
  body.querySelector(".go").onclick=()=>{const A=g.read(),out=body.querySelector(".out");
    if(!LA.isSymmetric(A)){out.innerHTML=`<div class="box warn">La matriz no es simétrica.</div>`;return;}
    try{const {L}=LA.cholesky(A);out.innerHTML=`${matBox(L,"L")}${matBox(LA.transpose(L),"Lᵀ")}<p class="hint">L·Lᵀ (debe dar A):</p>${matBox(LA.matmul(L,LA.transpose(L)))}`;}
    catch(e){out.innerHTML=`<div class="box warn">${e.message}</div>`;}
  };
};

/* ===== 5. QR (Gram-Schmidt) ===== */
W.qrDemo=(el,a={})=>{
  const body=shell(el,"⊥","Factorización QR (Gram-Schmidt)","ortonormaliza las columnas");
  const A0=a.A||[[1,1,0],[1,0,1],[0,1,1]];
  body.innerHTML=`<div class="controls"><label>filas <input type="number" class="r" min="2" max="5" value="${A0.length}"></label><label>cols <input type="number" class="c" min="2" max="5" value="${A0[0].length}"></label>
    <label>variante <select class="mod"><option value="1">modificado</option><option value="0">clásico</option></select></label><button class="btn go">Factorizar</button></div><div class="ge"></div><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0[0].length,vals:A0});body.querySelector(".ge").appendChild(g.node);
  const reb=()=>{const r=+body.querySelector(".r").value,c=+body.querySelector(".c").value;const ng=gridEditor({r,c,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;};
  body.querySelector(".r").onchange=reb;body.querySelector(".c").onchange=reb;
  body.querySelector(".go").onclick=()=>{const A=g.read(),out=body.querySelector(".out");
    try{const {Q,R}=LA.qr(A,{modified:body.querySelector(".mod").value==="1"});
      out.innerHTML=`${matBox(Q,"Q")}${matBox(R,"R")}<p class="hint">QᵀQ (≈ I, columnas ortonormales):</p>${matBox(LA.matmul(LA.transpose(Q),Q))}<p class="hint">Q·R (≈ A):</p>${matBox(LA.matmul(Q,R))}`;
    }catch(e){out.innerHTML=`<div class="box warn">${e.message}</div>`;}};
};

/* ===== 6. Bolas unitarias de normas ===== */
W.normBall=(el)=>{
  const body=shell(el,"⬡","Bolas unitarias","{v ∈ ℝ² : ‖v‖ₚ = 1}");
  body.innerHTML=`<div class="controls"><label>p = <input type="range" class="p" min="1" max="8" step="0.1" value="2"> <span class="pv">2</span></label>
    <label><input type="checkbox" class="inf"> p = ∞</label></div><canvas width="320" height="320"></canvas>
    <div class="hint">p=1 ⇒ rombo · p=2 ⇒ círculo · p→∞ ⇒ cuadrado.</div>`;
  const cv=body.querySelector("canvas"),ctx=cv.getContext("2d");
  const draw=()=>{const W=cv.width,H=cv.height,cx=W/2,cy=H/2,S=120;ctx.clearRect(0,0,W,H);
    const css=getComputedStyle(document.body);ctx.strokeStyle=css.getPropertyValue("--line");
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    let p=parseFloat(body.querySelector(".p").value);if(body.querySelector(".inf").checked)p=Infinity;
    ctx.strokeStyle=css.getPropertyValue("--accent");ctx.lineWidth=2.5;ctx.beginPath();
    for(let t=0;t<=360;t++){const th=t*Math.PI/180,co=Math.cos(th),si=Math.sin(th);
      let r;if(p===Infinity)r=1/Math.max(Math.abs(co),Math.abs(si));else r=Math.pow(Math.pow(Math.abs(co),p)+Math.pow(Math.abs(si),p),-1/p);
      const x=cx+S*r*co,y=cy-S*r*si;t?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.stroke();};
  body.querySelector(".p").oninput=e=>{body.querySelector(".pv").textContent=(+e.target.value).toFixed(1);draw();};
  body.querySelector(".inf").onchange=draw;draw();
};

/* ===== 7. Número de condición ===== */
W.condDemo=(el,a={})=>{
  const body=shell(el,"🎯","Número de condición κ(A)","sensibilidad del sistema Ax=b");
  const A0=a.A||[[1,1],[1,1.0001]];
  body.innerHTML=`<div class="controls"><label>n <input type="number" class="n" min="2" max="4" value="${A0.length}"></label><button class="btn go">Analizar</button></div><div class="ge"></div><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0.length,vals:A0});body.querySelector(".ge").appendChild(g.node);
  body.querySelector(".n").onchange=()=>{const n=+body.querySelector(".n").value;const ng=gridEditor({r:n,c:n,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;};
  body.querySelector(".go").onclick=()=>{const A=g.read(),out=body.querySelector(".out");
    try{const {sigma}=LA.svd(A);const s1=sigma[0],sn=sigma[sigma.length-1];const k2=sn>1e-14?s1/sn:Infinity;
      out.innerHTML=`<div class="flex"><div class="kpi"><b>${LA.fmt(s1)}</b><span>σ₁ (máx)</span></div>
        <div class="kpi"><b>${LA.fmt(sn)}</b><span>σₙ (mín)</span></div>
        <div class="kpi"><b>${k2===Infinity?"∞":LA.fmt(k2,2)}</b><span>κ₂(A)=σ₁/σₙ</span></div>
        <div class="kpi"><b>${k2===Infinity?"—":Math.log10(k2).toFixed(1)}</b><span>dígitos perdidos ≈ log₁₀κ</span></div></div>
        <div class="box ${k2>1e6?"warn":"tip"}">${k2>1e6?"Matriz MAL condicionada: pequeños errores en los datos se amplifican muchísimo.":"Matriz bien condicionada: el problema es estable."}</div>`;
    }catch(e){out.innerHTML=`<div class="box warn">${e.message}</div>`;}};
};

/* ===== 8. Método de la potencia ===== */
W.powerDemo=(el,a={})=>{
  const body=shell(el,"⚡","Método de la potencia","converge al autovalor dominante");
  const A0=a.A||[[2,1],[1,3]];
  body.innerHTML=`<div class="controls"><label>n <input type="number" class="n" min="2" max="4" value="${A0.length}"></label><label>iteraciones <input type="number" class="it" value="12" min="1" max="40"></label><button class="btn go">Iterar</button></div><div class="ge"></div><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0.length,vals:A0});body.querySelector(".ge").appendChild(g.node);
  body.querySelector(".n").onchange=()=>{const n=+body.querySelector(".n").value;const ng=gridEditor({r:n,c:n,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;};
  body.querySelector(".go").onclick=()=>{const A=g.read(),out=body.querySelector(".out");const it=+body.querySelector(".it").value;
    const v0=Array(A.length).fill(1).map((x,i)=>x+0.13*i);const seq=LA.powerMethod(A,v0,it);
    const rows=seq.map((s,k)=>`<tr><td>${k}</td><td class="mono">${s.v.map(x=>LA.fmt(x,3)).join(", ")}</td><td class="mono">${LA.fmt(s.lambda,5)}</td></tr>`).join("");
    out.innerHTML=`<table class="tbl"><tr><th>k</th><th>v⁽ᵏ⁾ (normalizado)</th><th>λ (cociente de Rayleigh)</th></tr>${rows}</table>
      <div class="kpi"><b>λ₁ ≈ ${LA.fmt(seq[seq.length-1].lambda,6)}</b><span>autovalor dominante estimado</span></div>`;};
};

/* ===== 9. Algoritmo QR (autovalores) ===== */
W.qrAlgoDemo=(el,a={})=>{
  const body=shell(el,"🔁","Algoritmo QR","A⁽ᵏ⁺¹⁾ = R⁽ᵏ⁾Q⁽ᵏ⁾ → triangular");
  const A0=a.A||[[4,1,0],[1,3,1],[0,1,2]];
  body.innerHTML=`<div class="controls"><label>n <input type="number" class="n" min="2" max="4" value="${A0.length}"></label><label>iteraciones <input type="number" class="it" value="15" min="1" max="60"></label><button class="btn go">Ejecutar</button></div><div class="ge"></div><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0.length,vals:A0});body.querySelector(".ge").appendChild(g.node);
  body.querySelector(".n").onchange=()=>{const n=+body.querySelector(".n").value;const ng=gridEditor({r:n,c:n,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;};
  body.querySelector(".go").onclick=()=>{const A=g.read(),out=body.querySelector(".out");const it=+body.querySelector(".it").value;
    const seq=LA.qrAlgorithm(A,it);const last=seq[seq.length-1];
    const ev=LA.eigenvalues(A).map(l=>LA.fmt(l.re,4)+(Math.abs(l.im)>1e-6?(l.im>0?"+":"−")+LA.fmt(Math.abs(l.im),3)+"i":""));
    out.innerHTML=`<div class="flex">${matBox(seq[0],"A⁽⁰⁾")}${matBox(seq[Math.floor(it/3)]||seq[1],"A⁽ᵏ⁾")}${matBox(last,"A⁽final⁾ ≈ △")}</div>
      <p>Autovalores ≈ <b class="mono">${ev.join(",  ")}</b></p>
      <div class="hint">La sucesión converge a una forma triangular (o casi-triangular, con bloques 2×2 si hay autovalores complejos) con los autovalores en la diagonal.</div>`;};
};

/* ===== 10. Discos de Gershgorin ===== */
W.gershgorinDemo=(el,a={})=>{
  const body=shell(el,"⊙","Círculos de Gershgorin","localizan los autovalores");
  const A0=a.A||[[5,1,0],[1,0,-1],[0,1,-3]];
  body.innerHTML=`<div class="controls"><label>n <input type="number" class="n" min="2" max="4" value="${A0.length}"></label><button class="btn go">Dibujar</button></div><div class="ge"></div><canvas width="380" height="300"></canvas><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0.length,vals:A0});body.querySelector(".ge").appendChild(g.node);
  body.querySelector(".n").onchange=()=>{const n=+body.querySelector(".n").value;const ng=gridEditor({r:n,c:n,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;};
  body.querySelector(".go").onclick=()=>{const A=g.read();const cv=body.querySelector("canvas"),ctx=cv.getContext("2d");
    const discs=LA.gershgorin(A);let ev=[];try{ev=LA.eigenvalues(A);}catch(e){}
    const hasComplex=ev.some(l=>Math.abs(l.im)>1e-6);
    const xs=discs.flatMap(d=>[d.center-d.radius,d.center+d.radius]).concat(ev.map(l=>l.re));
    const ys=ev.map(l=>l.im).concat(discs.map(d=>d.radius),discs.map(d=>-d.radius));
    let lo=Math.min(...xs,-1),hi=Math.max(...xs,1),ylo=Math.min(...ys,-1),yhi=Math.max(...ys,1);
    const W=cv.width,H=cv.height,pad=30;
    const spanx=Math.max(hi-lo,1)*1.15,midx=(hi+lo)/2;const spany=Math.max(yhi-ylo,1)*1.15,midy=(yhi+ylo)/2;
    const sc=Math.min((W-2*pad)/spanx,(H-2*pad)/spany);
    const X=x=>W/2+(x-midx)*sc,Y=y=>H/2-(y-midy)*sc;ctx.clearRect(0,0,W,H);
    const css=getComputedStyle(document.body);ctx.strokeStyle=css.getPropertyValue("--line");
    ctx.beginPath();ctx.moveTo(0,Y(0));ctx.lineTo(W,Y(0));ctx.moveTo(X(0),0);ctx.lineTo(X(0),H);ctx.stroke();
    ctx.fillStyle=css.getPropertyValue("--ink-soft");ctx.font="10px sans-serif";ctx.fillText("Re",W-18,Y(0)-4);ctx.fillText("Im",X(0)+4,12);
    discs.forEach(d=>{ctx.beginPath();ctx.fillStyle="rgba(79,70,229,.13)";ctx.strokeStyle=css.getPropertyValue("--accent");ctx.lineWidth=1.5;
      ctx.arc(X(d.center),Y(0),Math.max(d.radius*sc,1),0,7);ctx.fill();ctx.stroke();});
    ev.forEach(l=>{ctx.fillStyle="#e11d48";ctx.beginPath();ctx.arc(X(l.re),Y(l.im),4,0,7);ctx.fill();});
    body.querySelector(".out").innerHTML=`<div class="hint">Discos D(aᵢᵢ, Rᵢ) en azul; autovalores en rojo (eje vertical = parte imaginaria). Todo autovalor cae en la unión de discos.</div>`+
      `<div style="margin-top:6px">${ev.map(l=>`<span class="pill">λ ≈ ${LA.fmt(l.re,3)}${Math.abs(l.im)>1e-6?(l.im>0?" + ":" − ")+LA.fmt(Math.abs(l.im),3)+"i":""}</span>`).join("")}</div>`+
      `<div style="margin-top:4px">${discs.map(d=>`<span class="pill">D(${LA.fmt(d.center)}, R=${LA.fmt(d.radius)})</span>`).join("")}</div>`;
  };
};

/* ===== 11. Proceso de Markov ===== */
W.markovDemo=(el,a={})=>{
  const body=shell(el,"🔗","Proceso de Markov","columnas que suman 1 → estado de equilibrio");
  const A0=a.A||[[0.9,0.15,0.25],[0.075,0.8,0.25],[0.025,0.05,0.5]];const v0=a.v0||[1,0,0];
  body.innerHTML=`<div class="controls"><label>n <input type="number" class="n" min="2" max="4" value="${A0.length}"></label><label>pasos <input type="number" class="it" value="30" min="1" max="200"></label><button class="btn go">Evolucionar</button></div>
    <p class="hint">Matriz de transición (cada columna suma 1):</p><div class="ge"></div>
    <p class="hint">Estado inicial v⁽⁰⁾:</p><div class="gv"></div><canvas width="380" height="200"></canvas><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0.length,vals:A0,step:"0.01"});body.querySelector(".ge").appendChild(g.node);
  let gv=gridEditor({r:A0.length,c:1,vals:v0.map(x=>[x]),step:"any"});body.querySelector(".gv").appendChild(gv.node);
  body.querySelector(".n").onchange=()=>{const n=+body.querySelector(".n").value;const ng=gridEditor({r:n,c:n,vals:g.read(),step:"0.01"});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;
    const nv=gridEditor({r:n,c:1,vals:Array(n).fill([0]),step:"any"});body.querySelector(".gv").replaceChild(nv.node,gv.node);gv=nv;};
  body.querySelector(".go").onclick=()=>{const A=g.read(),it=+body.querySelector(".it").value;let v=gv.read().map(r=>r[0]);
    const series=A.map(()=>[]);const states=[v.slice()];
    for(let k=0;k<it;k++){v=LA.matvec(A,v);states.push(v.slice());}
    states.forEach(s=>s.forEach((x,i)=>series[i].push(x)));
    lineChart(body.querySelector("canvas"),series,{labels:series.map((_,i)=>"estado "+(i+1))});
    const fin=states[states.length-1];const sum=fin.reduce((a,b)=>a+b,0);
    body.querySelector(".out").innerHTML=`<p>Estado límite v⁽∞⁾ ≈ <b class="mono">(${fin.map(x=>LA.fmt(x,4)).join(", ")})</b></p>
      <div class="hint">Es autovector de autovalor 1 (proporciones estables). Suma total conservada = ${LA.fmt(sum,3)}.</div>`;};
};

/* ===== 12. Métodos iterativos ===== */
W.iterDemo=(el,a={})=>{
  const body=shell(el,"♻️","Métodos iterativos","Jacobi · Gauss-Seidel · SOR");
  const A0=a.A||[[4,1,0],[1,4,1],[0,1,4]],b0=a.b||[1,2,3];
  body.innerHTML=`<div class="controls"><label>n <input type="number" class="n" min="2" max="5" value="${A0.length}"></label>
     <label>método <select class="m"><option value="jacobi">Jacobi</option><option value="gauss">Gauss-Seidel</option><option value="sor">SOR</option></select></label>
     <label class="ow" hidden>ω <input type="number" class="om" value="1.2" step="0.05" min="0.1" max="1.95" style="width:60px"></label>
     <label>iter <input type="number" class="it" value="20" min="1" max="100"></label><button class="btn go">Resolver</button></div>
     <p class="hint">A:</p><div class="ge"></div><p class="hint">b:</p><div class="gb"></div>
     <canvas width="380" height="200"></canvas><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0.length,vals:A0}),gb=gridEditor({r:A0.length,c:1,vals:b0.map(x=>[x])});
  body.querySelector(".ge").appendChild(g.node);body.querySelector(".gb").appendChild(gb.node);
  body.querySelector(".m").onchange=e=>body.querySelector(".ow").hidden=e.target.value!=="sor";
  body.querySelector(".n").onchange=()=>{const n=+body.querySelector(".n").value;
    const ng=gridEditor({r:n,c:n,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;
    const nb=gridEditor({r:n,c:1,vals:Array(n).fill([0])});body.querySelector(".gb").replaceChild(nb.node,gb.node);gb=nb;};
  body.querySelector(".go").onclick=()=>{const A=g.read(),b=gb.read().map(r=>r[0]),out=body.querySelector(".out");
    const method=body.querySelector(".m").value,omega=+body.querySelector(".om").value,it=+body.querySelector(".it").value;
    try{const seq=LA.iterativeSolve(A,b,{method,omega,iters:it});
      lineChart(body.querySelector("canvas"),[seq.map(s=>s.res)],{logy:true,labels:["‖Ax−b‖₂"]});
      let rho="—";try{rho=LA.fmt(LA.spectralRadius(LA.iterMatrix(A,{method,omega})),4);}catch(e){}
      const xf=seq[seq.length-1].x;
      out.innerHTML=`<p>x⁽${it}⁾ ≈ <b class="mono">(${xf.map(v=>LA.fmt(v,5)).join(", ")})</b></p>
        <div class="flex"><div class="kpi"><b>${rho}</b><span>ρ(matriz iteración)</span></div>
        <div class="kpi"><b>${LA.fmt(seq[seq.length-1].res,2)}</b><span>residuo final</span></div></div>
        <div class="box ${parseFloat(rho)<1?"tip":"warn"}">${parseFloat(rho)<1?"ρ &lt; 1 ⇒ el método converge.":"ρ ≥ 1 ⇒ el método NO converge."} La pendiente del gráfico (escala log) es el orden de convergencia.</div>`;
    }catch(e){out.innerHTML=`<div class="box warn">${e.message}</div>`;}};
};

/* ===== 13. SVD + elipse ===== */
W.svdDemo=(el,a={})=>{
  const body=shell(el,"◫","SVD  A = UΣVᵀ","valores singulares y geometría");
  const A0=a.A||[[3,2,2],[2,3,-2]];
  body.innerHTML=`<div class="controls"><label>filas <input type="number" class="r" min="1" max="4" value="${A0.length}"></label><label>cols <input type="number" class="c" min="1" max="4" value="${A0[0].length}"></label><button class="btn go">Descomponer</button></div><div class="ge"></div><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0[0].length,vals:A0});body.querySelector(".ge").appendChild(g.node);
  const reb=()=>{const r=+body.querySelector(".r").value,c=+body.querySelector(".c").value;const ng=gridEditor({r,c,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;};
  body.querySelector(".r").onchange=reb;body.querySelector(".c").onchange=reb;
  body.querySelector(".go").onclick=()=>{const A=g.read(),out=body.querySelector(".out");
    try{const {U,S,V,sigma}=LA.svd(A);
      let html=`<div class="flex">${matBox(U,"U")}${matBox(S,"Σ")}${matBox(LA.transpose(V),"Vᵀ")}</div>
        <p>Valores singulares: <b class="mono">${sigma.map(s=>LA.fmt(s,4)).join(",  ")}</b></p>
        <p class="hint">U·Σ·Vᵀ (≈ A):</p>${matBox(LA.matmul(LA.matmul(U,S),LA.transpose(V)))}`;
      if(A.length===2&&A[0].length===2){html+=`<p class="hint">La transformación lleva el círculo unitario (azul) a una elipse de semiejes σ₁, σ₂ (violeta):</p><canvas width="300" height="300"></canvas>`;}
      out.innerHTML=html;
      if(A.length===2&&A[0].length===2){const cv=out.querySelector("canvas"),ctx=cv.getContext("2d"),Wd=cv.width,cx=Wd/2,cy=Wd/2,sc=70;
        const css=getComputedStyle(document.body);ctx.strokeStyle=css.getPropertyValue("--line");ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(Wd,cy);ctx.moveTo(cx,0);ctx.lineTo(cx,Wd);ctx.stroke();
        ctx.strokeStyle="#3b82f6";ctx.lineWidth=1.5;ctx.beginPath();for(let t=0;t<=360;t++){const th=t*Math.PI/180,x=cx+sc*Math.cos(th),y=cy-sc*Math.sin(th);t?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
        ctx.strokeStyle=css.getPropertyValue("--accent");ctx.lineWidth=2.5;ctx.beginPath();for(let t=0;t<=360;t++){const th=t*Math.PI/180;const p=LA.matvec(A,[Math.cos(th),Math.sin(th)]);const x=cx+sc*p[0],y=cy-sc*p[1];t?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
    }catch(e){out.innerHTML=`<div class="box warn">${e.message}</div>`;}};
};

/* ===== 14. Compresión por SVD ===== */
W.svdCompress=(el)=>{
  const body=shell(el,"🖼️","Compresión de imágenes con SVD","aproximación de rango bajo");
  // imagen 12x10 (un "rombo/anillo") en [0,1]
  const m=12,n=10;const img=[];for(let i=0;i<m;i++){img[i]=[];for(let j=0;j<n;j++){
    const di=Math.abs(i-(m-1)/2)/(m/2),dj=Math.abs(j-(n-1)/2)/(n/2);const r=di+dj;img[i][j]=(r>0.35&&r<0.85)?0.1:0.95;}}
  body.innerHTML=`<div class="controls"><label>rango k = <input type="range" class="k" min="1" max="${Math.min(m,n)}" value="2"> <span class="kv">2</span></label></div>
    <div class="flex"><div><div class="hint">original</div><canvas class="orig" width="120" height="144"></canvas></div>
    <div><div class="hint">reconstruida (k valores singulares)</div><canvas class="rec" width="120" height="144"></canvas></div></div><div class="out"></div>`;
  const {U,V,sigma}=LA.svd(img);
  const drawImg=(cv,A)=>{const ctx=cv.getContext("2d"),cw=cv.width/n,ch=cv.height/m;for(let i=0;i<m;i++)for(let j=0;j<n;j++){const v=Math.max(0,Math.min(1,A[i][j]));const g=Math.round(v*255);ctx.fillStyle=`rgb(${g},${g},${g})`;ctx.fillRect(j*cw,i*ch,cw+1,ch+1);}};
  drawImg(body.querySelector(".orig"),img);
  const update=()=>{const k=+body.querySelector(".k").value;body.querySelector(".kv").textContent=k;
    const Ak=LA.zeros(m,n);for(let t=0;t<k;t++)for(let i=0;i<m;i++)for(let j=0;j<n;j++)Ak[i][j]+=sigma[t]*U[i][t]*V[j][t];
    drawImg(body.querySelector(".rec"),Ak);
    const orig=m*n,comp=k*(m+n+1);
    body.querySelector(".out").innerHTML=`<div class="flex"><div class="kpi"><b>${orig}</b><span>números (original)</span></div><div class="kpi"><b>${comp}</b><span>números (rango ${k})</span></div><div class="kpi"><b>${Math.round(100*comp/orig)}%</b><span>almacenamiento</span></div></div>
    <div class="hint">σ = (${sigma.map(s=>LA.fmt(s,2)).join(", ")}). Con pocos valores singulares ya se recupera casi toda la imagen.</div>`;};
  body.querySelector(".k").oninput=update;update();
};

/* ===== 15. Cuadrados mínimos (ajuste) ===== */
W.lsqDemo=(el,a={})=>{
  const body=shell(el,"📉","Cuadrados mínimos","ajuste polinomial por ecuaciones normales");
  const pts0=a.points||[[-1,-0.9],[-0.5,-0.4],[0,0.2],[0.5,0.3],[1,1.1],[1.5,1.4]];
  body.innerHTML=`<div class="controls"><label>grado <input type="number" class="d" min="0" max="5" value="1"></label>
    <label>puntos (x,y por línea): </label></div>
    <textarea class="pts" rows="4" style="width:100%;font-family:var(--mono);background:var(--panel-2);color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:8px">${pts0.map(p=>p.join(", ")).join("\n")}</textarea>
    <div class="controls"><button class="btn go">Ajustar</button></div><canvas width="380" height="260"></canvas><div class="out"></div>`;
  body.querySelector(".go").onclick=()=>{const out=body.querySelector(".out");
    const pts=body.querySelector(".pts").value.trim().split("\n").map(l=>l.split(/[\s,]+/).map(Number)).filter(p=>p.length>=2&&!isNaN(p[0]));
    const d=+body.querySelector(".d").value;
    const Avd=pts.map(p=>{const row=[];for(let k=0;k<=d;k++)row.push(Math.pow(p[0],k));return row;});
    const bb=pts.map(p=>p[1]);
    try{const AtA=LA.matmul(LA.transpose(Avd),Avd),Atb=LA.matvec(LA.transpose(Avd),bb);const coef=LA.solve(AtA,Atb);
      const cv=body.querySelector("canvas"),ctx=cv.getContext("2d"),Wd=cv.width,Hd=cv.height,pad=30;
      const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);let xlo=Math.min(...xs),xhi=Math.max(...xs),ylo=Math.min(...ys),yhi=Math.max(...ys);
      const xm=(xhi-xlo)*0.15||1,ym=(yhi-ylo)*0.2||1;xlo-=xm;xhi+=xm;ylo-=ym;yhi+=ym;
      const X=x=>pad+(Wd-2*pad)*(x-xlo)/(xhi-xlo),Y=y=>Hd-pad-(Hd-2*pad)*(y-ylo)/(yhi-ylo);
      ctx.clearRect(0,0,Wd,Hd);const css=getComputedStyle(document.body);ctx.strokeStyle=css.getPropertyValue("--line");
      ctx.beginPath();ctx.moveTo(pad,Hd-pad);ctx.lineTo(Wd-pad,Hd-pad);ctx.moveTo(pad,pad);ctx.lineTo(pad,Hd-pad);ctx.stroke();
      ctx.strokeStyle=css.getPropertyValue("--accent");ctx.lineWidth=2;ctx.beginPath();
      for(let px=0;px<=100;px++){const x=xlo+(xhi-xlo)*px/100;let y=0;for(let k=0;k<=d;k++)y+=coef[k]*Math.pow(x,k);px?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y));}ctx.stroke();
      ctx.fillStyle=css.getPropertyValue("--accent-2");pts.forEach(p=>{ctx.beginPath();ctx.arc(X(p[0]),Y(p[1]),4,0,7);ctx.fill();});
      const poly=coef.map((c,k)=>`${LA.fmt(c,3)}${k===0?"":k===1?"·x":"·x^{"+k+"}"}`).join(" + ");
      out.innerHTML=`<p>Polinomio: ${kt("p(x)="+poly.replace(/\+ -/g,"- "))}</p><div class="hint">Resuelto con las ecuaciones normales AᵀA·a = Aᵀb.</div>`;
    }catch(e){out.innerHTML=`<div class="box warn">${e.message}</div>`;}};
  body.querySelector(".go").click();
};

/* ===== 16. Autovalores 2x2 / nxn ===== */
W.eigDemo=(el,a={})=>{
  const body=shell(el,"λ","Autovalores y autovectores","polinomio característico y diagonalización");
  const A0=a.A||[[2,3],[2,1]];
  body.innerHTML=`<div class="controls"><label>n <input type="number" class="n" min="2" max="4" value="${A0.length}"></label><button class="btn go">Calcular</button></div><div class="ge"></div><div class="out"></div>`;
  let g=gridEditor({r:A0.length,c:A0.length,vals:A0});body.querySelector(".ge").appendChild(g.node);
  body.querySelector(".n").onchange=()=>{const n=+body.querySelector(".n").value;const ng=gridEditor({r:n,c:n,vals:g.read()});body.querySelector(".ge").replaceChild(ng.node,g.node);g=ng;};
  body.querySelector(".go").onclick=()=>{const A=g.read(),out=body.querySelector(".out");
    if(A.length===2){const a11=A[0][0],a12=A[0][1],a21=A[1][0],a22=A[1][1];
      const tr=a11+a22,de=a11*a22-a12*a21,disc=tr*tr-4*de;
      const term=(c,suf)=>{if(Math.abs(c)<1e-12)return"";return` ${c<0?"-":"+"} ${LA.fmt(Math.abs(c))}${suf}`;};
      const poly=`\\lambda^2${term(-tr,"\\lambda")}${term(de,"")}`;
      let html=`<p>Polinomio característico: ${kt(`\\chi(\\lambda)=${poly}`)}</p>`;
      if(disc>=0){const s=Math.sqrt(disc),l1=(tr+s)/2,l2=(tr-s)/2;
        html+=`<p>Autovalores: ${kt(`\\lambda_1=${LA.fmt(l1)},\\quad \\lambda_2=${LA.fmt(l2)}`)}</p>`;
        [l1,l2].forEach((l,i)=>{const M=[[a11-l,a12],[a21,a22-l]];let v;
          if(Math.abs(M[0][0])>1e-9||Math.abs(M[0][1])>1e-9)v=[-M[0][1],M[0][0]];else v=[-M[1][1],M[1][0]];
          const nv=LA.vnorm(v);if(nv>1e-9)v=v.map(x=>x/nv);
          html+=`<p>Para ${kt(`\\lambda_${i+1}`)}: autovector ${kt(`v_${i+1}=`)} <span class="mono">(${v.map(x=>LA.fmt(x,3)).join(", ")})</span></p>`;});
        html+=disc>1e-9?`<div class="box tip">Dos autovalores distintos ⇒ A es <b>diagonalizable</b>: A = C D C⁻¹.</div>`:`<div class="box warn">Autovalor doble: revisar multiplicidad geométrica.</div>`;
      }else{const re=tr/2,im=Math.sqrt(-disc)/2;html+=`<p>Autovalores complejos: ${kt(`\\lambda=${LA.fmt(re)}\\pm${LA.fmt(im)}i`)}</p>`;}
      out.innerHTML=html;
    }else{// nxn
      let ev,vec;if(LA.isSymmetric(A)){const e=LA.jacobiEig(A);ev=e.values;vec=e.vectors;
        out.innerHTML=`<p>Matriz simétrica ⇒ autovalores reales y base ortonormal de autovectores.</p>
          <p>Autovalores: <b class="mono">${ev.map(x=>LA.fmt(x,4)).join(",  ")}</b></p>${matBox(vec,"autovectores (columnas)")}`;
      }else{const evs=LA.eigenvalues(A).map(l=>LA.fmt(l.re,4)+(Math.abs(l.im)>1e-6?(l.im>0?"+":"−")+LA.fmt(Math.abs(l.im),3)+"i":""));
        out.innerHTML=`<p>Autovalores ≈ <b class="mono">${evs.join(",  ")}</b></p><div class="hint">(estimados con el algoritmo QR, incluyendo pares complejos conjugados)</div>`;}
    }};
};

/* ===== 17. Producto interno / proyección ===== */
W.projDemo=(el,a={})=>{
  const body=shell(el,"↘","Proyección ortogonal","Pᵥ(w) sobre la recta de v (en ℝ²)");
  body.innerHTML=`<div class="controls"><label>v=(<input type="number" class="vx" value="3" style="width:48px">,<input type="number" class="vy" value="1" style="width:48px">)</label>
    <label>w=(<input type="number" class="wx" value="1" style="width:48px">,<input type="number" class="wy" value="3" style="width:48px">)</label><button class="btn go">Proyectar</button></div><canvas width="320" height="320"></canvas><div class="out"></div>`;
  const draw=()=>{const v=[+body.querySelector(".vx").value,+body.querySelector(".vy").value];const w=[+body.querySelector(".wx").value,+body.querySelector(".wy").value];
    const beta=LA.dot(v,w)/LA.dot(v,v);const p=v.map(x=>x*beta);
    const cv=body.querySelector("canvas"),ctx=cv.getContext("2d"),Wd=cv.width,cx=Wd/2,cy=Wd/2,sc=35;ctx.clearRect(0,0,Wd,Wd);
    const css=getComputedStyle(document.body);ctx.strokeStyle=css.getPropertyValue("--line");ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(Wd,cy);ctx.moveTo(cx,0);ctx.lineTo(cx,Wd);ctx.stroke();
    const arrow=(vec,col,lab)=>{ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+vec[0]*sc,cy-vec[1]*sc);ctx.stroke();ctx.beginPath();ctx.arc(cx+vec[0]*sc,cy-vec[1]*sc,3,0,7);ctx.fill();ctx.fillText(lab,cx+vec[0]*sc+4,cy-vec[1]*sc);};
    // recta de v
    ctx.strokeStyle=css.getPropertyValue("--ink-soft");ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(cx-v[0]*sc*3,cy+v[1]*sc*3);ctx.lineTo(cx+v[0]*sc*3,cy-v[1]*sc*3);ctx.stroke();ctx.setLineDash([]);
    arrow(v,css.getPropertyValue("--accent-2"),"v");arrow(w,"#e11d48","w");arrow(p,css.getPropertyValue("--accent"),"P(w)");
    ctx.strokeStyle=css.getPropertyValue("--ink-soft");ctx.beginPath();ctx.moveTo(cx+w[0]*sc,cy-w[1]*sc);ctx.lineTo(cx+p[0]*sc,cy-p[1]*sc);ctx.stroke();
    body.querySelector(".out").innerHTML=`${kt(`P_v(w)=\\frac{v^Tw}{\\|v\\|^2}v=${LA.fmt(beta,3)}\\,v=(${LA.fmt(p[0],3)},${LA.fmt(p[1],3)})`,true)}<div class="hint">w − P(w) es ⊥ a v (segmento gris).</div>`;};
  body.querySelector(".go").onclick=draw;draw();
};

window.WIDGETS=W;
})();
