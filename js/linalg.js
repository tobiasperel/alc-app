/* =========================================================================
   linalg.js — Motor de Álgebra Lineal (sin dependencias)
   Expone window.LA con operaciones, factorizaciones, autovalores, SVD,
   métodos iterativos, normas, etc. Trabaja con matrices = array de filas.
   ========================================================================= */
(function(){
"use strict";
const EPS = 1e-10;

/* ---------- básicos ---------- */
const clone = A => Array.isArray(A[0]) ? A.map(r=>r.slice()) : A.slice();
const zeros = (m,n)=>Array.from({length:m},()=>Array(n).fill(0));
const eye = n=>{const I=zeros(n,n);for(let i=0;i<n;i++)I[i][i]=1;return I;};
const rows = A=>A.length, cols = A=>A[0].length;
const transpose = A=>A[0].map((_,j)=>A.map(r=>r[j]));
const isVec = v=>!Array.isArray(v[0]);

function matmul(A,B){
  const m=A.length,n=B[0].length,p=B.length,C=zeros(m,n);
  for(let i=0;i<m;i++)for(let k=0;k<p;k++){const a=A[i][k];if(a===0)continue;for(let j=0;j<n;j++)C[i][j]+=a*B[k][j];}
  return C;
}
const matvec=(A,x)=>A.map(r=>r.reduce((s,v,j)=>s+v*x[j],0));
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const vadd=(a,b)=>a.map((v,i)=>v+b[i]);
const vsub=(a,b)=>a.map((v,i)=>v-b[i]);
const vscale=(a,s)=>a.map(v=>v*s);
const madd=(A,B)=>A.map((r,i)=>r.map((v,j)=>v+B[i][j]));
const msub=(A,B)=>A.map((r,i)=>r.map((v,j)=>v-B[i][j]));
const mscale=(A,s)=>A.map(r=>r.map(v=>v*s));

/* ---------- formato ---------- */
function fmt(x,dec=4){
  if(x===undefined||x===null||Number.isNaN(x))return"·";
  if(Math.abs(x)<1e-12)return"0";
  const r=Math.round(x);
  if(Math.abs(x-r)<1e-9)return String(r);
  let s=x.toFixed(dec);
  s=s.replace(/0+$/,"").replace(/\.$/,"");
  return s;
}
// matriz -> string monoespaciado alineado
function matStr(A,dec=4){
  if(isVec(A))A=A.map(v=>[v]);
  const S=A.map(r=>r.map(v=>fmt(v,dec)));
  const w=S[0].map((_,j)=>Math.max(...S.map(r=>r[j].length)));
  return S.map(r=>"│ "+r.map((s,j)=>s.padStart(w[j])).join("  ")+" │").join("\n");
}
// matriz -> LaTeX pmatrix
function matTex(A,dec=4){
  if(isVec(A))A=A.map(v=>[v]);
  return "\\begin{pmatrix}"+A.map(r=>r.map(v=>fmt(v,dec)).join(" & ")).join(" \\\\ ")+"\\end{pmatrix}";
}

/* ---------- parseo desde texto ---------- */
function parseMatrix(txt){
  const rs=txt.trim().split(/\n|;/).filter(s=>s.trim());
  return rs.map(r=>r.trim().split(/[\s,]+/).map(Number));
}

/* ---------- eliminación gaussiana / RREF con pasos ---------- */
function rref(A0,{reduced=true}={}){
  const A=clone(A0).map(r=>r.map(Number));
  const m=A.length,n=A[0].length,steps=[];const pivots=[];
  let r=0;
  for(let c=0;c<n&&r<m;c++){
    // buscar pivote (máximo en valor absoluto, mejor estabilidad y didáctico)
    let p=r;for(let i=r+1;i<m;i++)if(Math.abs(A[i][c])>Math.abs(A[p][c]))p=i;
    if(Math.abs(A[p][c])<EPS)continue;
    if(p!==r){[A[p],A[r]]=[A[r],A[p]];steps.push({op:`f${r+1} ↔ f${p+1}`,A:clone(A)});}
    pivots.push(c);
    if(reduced){const pv=A[r][c];if(Math.abs(pv-1)>EPS){A[r]=A[r].map(v=>v/pv);steps.push({op:`f${r+1} ÷ ${fmt(pv)}`,A:clone(A)});}}
    for(let i=0;i<m;i++){
      if(i===r)continue;
      if(!reduced&&i<r)continue;
      const f=A[i][c]/A[r][c];
      if(Math.abs(f)<EPS)continue;
      A[i]=A[i].map((v,j)=>v-f*A[r][j]);
      steps.push({op:`f${i+1} − (${fmt(f)})·f${r+1} → f${i+1}`,A:clone(A)});
    }
    r++;
  }
  return {R:A,steps,pivots,rank:pivots.length};
}

/* ---------- sustitución ---------- */
function backSub(U,b){const n=U.length,x=Array(n).fill(0);
  for(let i=n-1;i>=0;i--){let s=b[i];for(let j=i+1;j<n;j++)s-=U[i][j]*x[j];x[i]=s/U[i][i];}return x;}
function fwdSub(L,b){const n=L.length,x=Array(n).fill(0);
  for(let i=0;i<n;i++){let s=b[i];for(let j=0;j<i;j++)s-=L[i][j]*x[j];x[i]=s/L[i][i];}return x;}

/* ---------- LU (Doolittle, sin pivoteo) ---------- */
function lu(A0){
  const n=A0.length,U=clone(A0),L=eye(n),steps=[];
  for(let k=0;k<n-1;k++){
    if(Math.abs(U[k][k])<EPS)throw new Error(`Pivote nulo en posición ${k+1}: se necesita pivoteo (PLU).`);
    for(let i=k+1;i<n;i++){
      const m=U[i][k]/U[k][k];L[i][k]=m;
      for(let j=k;j<n;j++)U[i][j]-=m*U[k][j];
      steps.push({op:`f${i+1} − (${fmt(m)})·f${k+1}`,mult:m,L:clone(L),U:clone(U)});
    }
  }
  return {L,U,steps};
}

/* ---------- PLU (pivoteo parcial) ---------- */
function plu(A0){
  const n=A0.length,U=clone(A0),L=eye(n),P=eye(n),perm=[...Array(n).keys()],steps=[];
  for(let k=0;k<n-1;k++){
    let p=k;for(let i=k+1;i<n;i++)if(Math.abs(U[i][k])>Math.abs(U[p][k]))p=i;
    if(p!==k){
      [U[p],U[k]]=[U[k],U[p]];[P[p],P[k]]=[P[k],P[p]];[perm[p],perm[k]]=[perm[k],perm[p]];
      for(let j=0;j<k;j++){const t=L[p][j];L[p][j]=L[k][j];L[k][j]=t;}
      steps.push({op:`f${k+1} ↔ f${p+1} (pivote ${fmt(U[k][k])})`,swap:true,L:clone(L),U:clone(U),P:clone(P)});
    }
    if(Math.abs(U[k][k])<EPS)continue;
    for(let i=k+1;i<n;i++){
      const m=U[i][k]/U[k][k];L[i][k]=m;
      for(let j=k;j<n;j++)U[i][j]-=m*U[k][j];
      steps.push({op:`f${i+1} − (${fmt(m)})·f${k+1}`,L:clone(L),U:clone(U),P:clone(P)});
    }
  }
  return {P,L,U,perm,steps};
}

/* ---------- Cholesky  A = L Lᵀ ---------- */
function cholesky(A0){
  const n=A0.length,L=zeros(n,n);
  for(let j=0;j<n;j++){
    let s=A0[j][j];for(let k=0;k<j;k++)s-=L[j][k]**2;
    if(s<=EPS)throw new Error("La matriz no es definida positiva (Cholesky falla).");
    L[j][j]=Math.sqrt(s);
    for(let i=j+1;i<n;i++){let t=A0[i][j];for(let k=0;k<j;k++)t-=L[i][k]*L[j][k];L[i][j]=t/L[j][j];}
  }
  return {L};
}

/* ---------- QR (Gram-Schmidt clásico / modificado) ---------- */
function qr(A0,{modified=true}={}){
  const m=A0.length,n=A0[0].length;
  const a=transpose(A0); // columnas
  const q=[],R=zeros(n,n),steps=[];
  for(let j=0;j<n;j++){
    let v=a[j].slice();
    for(let i=0;i<j;i++){
      const r= modified ? dot(q[i],v) : dot(q[i],a[j]);
      R[i][j]=r; v=vsub(v,vscale(q[i],r));
    }
    R[j][j]=Math.sqrt(dot(v,v));
    q[j]=R[j][j]<EPS?v.map(()=>0):vscale(v,1/R[j][j]);
    steps.push({col:j+1,q:q[j].slice(),R:clone(R)});
  }
  const Q=transpose(q);
  return {Q,R,steps};
}

/* ---------- determinante / inversa ---------- */
function det(A0){
  try{const {U,perm}=plu(A0);let d=1;for(let i=0;i<U.length;i++)d*=U[i][i];
    // signo de la permutación
    const p=perm.slice();let sign=1;for(let i=0;i<p.length;i++)while(p[i]!==i){const j=p[i];[p[i],p[j]]=[p[j],p[i]];sign=-sign;}
    return d*sign;
  }catch(e){return 0;}
}
function inv(A0){
  const n=A0.length,M=A0.map((r,i)=>r.concat(eye(n)[i]));
  const {R}=rref(M);
  // verificar que el bloque izquierdo sea identidad
  for(let i=0;i<n;i++)if(Math.abs(R[i][i]-1)>1e-6)throw new Error("Matriz singular: no es inversible.");
  return R.map(r=>r.slice(n));
}
function solve(A,b){const {L,U,perm}=plu(A);const pb=perm.map(i=>b[i]);const y=fwdSub(L,pb);return backSub(U,y);}

/* ---------- normas ---------- */
function vnorm(x,p=2){
  if(p===1)return x.reduce((s,v)=>s+Math.abs(v),0);
  if(p===Infinity||p==="inf")return Math.max(...x.map(Math.abs));
  return Math.sqrt(x.reduce((s,v)=>s+v*v,0));
}
function mnorm(A,p=2){
  const m=A.length,n=A[0].length;
  if(p===1)return Math.max(...Array.from({length:n},(_,j)=>A.reduce((s,r)=>s+Math.abs(r[j]),0)));      // máx suma columnas
  if(p===Infinity||p==="inf")return Math.max(...A.map(r=>r.reduce((s,v)=>s+Math.abs(v),0)));            // máx suma filas
  if(p==="fro")return Math.sqrt(A.reduce((s,r)=>s+r.reduce((t,v)=>t+v*v,0),0));
  // norma-2 = sqrt(autovalor máximo de AᵀA) = σ1
  const AtA=matmul(transpose(A),A);const ev=jacobiEig(AtA).values;return Math.sqrt(Math.max(0,Math.max(...ev)));
}

/* ---------- autovalores simétricos: Jacobi ---------- */
function jacobiEig(A0,{maxSweeps=100,tol=1e-12}={}){
  const n=A0.length,a=clone(A0),V=eye(n);
  const off=()=>{let s=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)s+=a[i][j]**2;return Math.sqrt(2*s);};
  for(let sweep=0;sweep<maxSweeps&&off()>tol;sweep++){
    for(let p=0;p<n-1;p++)for(let q=p+1;q<n;q++){
      if(Math.abs(a[p][q])<1e-300)continue;
      const theta=(a[q][q]-a[p][p])/(2*a[p][q]);
      const t=Math.sign(theta||1)/(Math.abs(theta)+Math.sqrt(theta*theta+1));
      const c=1/Math.sqrt(t*t+1),s=t*c;
      for(let i=0;i<n;i++){const aip=a[i][p],aiq=a[i][q];a[i][p]=c*aip-s*aiq;a[i][q]=s*aip+c*aiq;}
      for(let i=0;i<n;i++){const api=a[p][i],aqi=a[q][i];a[p][i]=c*api-s*aqi;a[q][i]=s*api+c*aqi;}
      for(let i=0;i<n;i++){const vip=V[i][p],viq=V[i][q];V[i][p]=c*vip-s*viq;V[i][q]=s*vip+c*viq;}
    }
  }
  let vals=a.map((r,i)=>r[i]);
  // ordenar descendente por valor (no por módulo)
  const idx=[...vals.keys()].sort((i,j)=>vals[j]-vals[i]);
  return {values:idx.map(i=>vals[i]),vectors:transpose(idx.map(i=>V.map(r=>r[i])))};
}

/* ---------- método de la potencia ---------- */
function powerMethod(A,v0,iters=20){
  let v=vscale(v0,1/vnorm(v0));const seq=[{v:v.slice(),lambda:rayleigh(A,v)}];
  for(let k=0;k<iters;k++){
    const w=matvec(A,v);const nw=vnorm(w);
    if(nw<EPS)break;
    v=vscale(w,1/nw);
    seq.push({v:v.slice(),lambda:rayleigh(A,v)});
  }
  return seq;
}
const rayleigh=(A,v)=>dot(v,matvec(A,v))/dot(v,v);

/* ---------- algoritmo QR (sin shift, para mostrar convergencia) ---------- */
function qrAlgorithm(A0,iters=30){
  let Ak=clone(A0);const seq=[clone(Ak)];
  for(let k=0;k<iters;k++){
    const {Q,R}=qrFull(Ak);
    Ak=matmul(R,Q);
    seq.push(clone(Ak));
  }
  return seq;
}
// QR completo (rellena Q a m×m) — para matrices cuadradas en el algoritmo QR
function qrFull(A0){
  const n=A0.length;const {Q,R}=qr(A0);
  return {Q,R};
}

/* ---------- SVD  A = U Σ Vᵀ  (vía autovalores de AᵀA) ---------- */
function svd(A0){
  const m=A0.length,n=A0[0].length;
  const AtA=matmul(transpose(A0),A0);
  const {values,vectors:V}=jacobiEig(AtA);            // V: n×n columnas = autovectores
  const sig=values.map(v=>Math.sqrt(Math.max(0,v)));
  const p=Math.min(m,n);
  // U: columnas u_i = A v_i / σ_i
  const Vcols=transpose(V);
  const Ucols=[];
  for(let i=0;i<p;i++){
    if(sig[i]>EPS)Ucols.push(vscale(matvec(A0,Vcols[i]),1/sig[i]));
    else Ucols.push(null);
  }
  // completar U a m×m por Gram-Schmidt con canónicos
  const basis=Ucols.filter(Boolean).map(c=>c.slice());
  for(let e=0;e<m&&basis.length<m;e++){
    let v=Array(m).fill(0);v[e]=1;
    for(const q of basis)v=vsub(v,vscale(q,dot(q,v)));
    if(vnorm(v)>1e-7)basis.push(vscale(v,1/vnorm(v)));
  }
  const U=transpose(basis.slice(0,m));
  // Σ m×n
  const S=zeros(m,n);for(let i=0;i<p;i++)S[i][i]=sig[i];
  return {U,S,V,sigma:sig.slice(0,p)};
}

/* ---------- separar A = L + D + U (para iterativos) ---------- */
function splitLDU(A){
  const n=A.length,L=zeros(n,n),D=zeros(n,n),U=zeros(n,n);
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){
    if(i>j)L[i][j]=A[i][j];else if(i===j)D[i][j]=A[i][j];else U[i][j]=A[i][j];
  }
  return {L,D,U};
}

/* ---------- métodos iterativos ---------- */
function iterativeSolve(A,b,{method="jacobi",omega=1,x0=null,iters=25}={}){
  const n=A.length;let x=x0?x0.slice():Array(n).fill(0);
  const seq=[{x:x.slice(),res:vnorm(vsub(matvec(A,x),b))}];
  for(let k=0;k<iters;k++){
    const xn=x.slice();
    for(let i=0;i<n;i++){
      let s=b[i];
      for(let j=0;j<n;j++){
        if(j===i)continue;
        const xj = (method==="jacobi") ? x[j] : xn[j]; // GS/SOR usan ya actualizados
        s-=A[i][j]*xj;
      }
      const gs=s/A[i][i];
      xn[i]=(method==="sor")?(1-omega)*x[i]+omega*gs:gs;
    }
    x=xn;
    seq.push({x:x.slice(),res:vnorm(vsub(matvec(A,x),b))});
  }
  return seq;
}
// matriz de iteración y su radio espectral
function iterMatrix(A,{method="jacobi",omega=1}={}){
  const {L,D,U}=splitLDU(A),n=A.length;
  let B,M; // M⁻¹ = B; matriz iteración = -B·C
  if(method==="jacobi"){const Dinv=zeros(n,n);for(let i=0;i<n;i++)Dinv[i][i]=1/D[i][i];M=mscale(matmul(Dinv,madd(L,U)),-1);}
  else if(method==="gauss"){const LDinv=inv(madd(L,D));M=mscale(matmul(LDinv,U),-1);}
  else if(method==="sor"){const DwL=madd(D,mscale(L,omega));const inv1=inv(DwL);
    const right=msub(mscale(D,1-omega),mscale(U,omega));M=matmul(inv1,right);}
  return M;
}
function spectralRadius(A){
  // simétrico: exacto vía Jacobi. General: fórmula de Gelfand ρ = lim ||A^k||^{1/k}
  // (vale aunque haya autovalores complejos, a diferencia de mirar solo la diagonal del QR-alg).
  if(isSymmetric(A))return Math.max(...jacobiEig(A).values.map(Math.abs));
  const k=40;let M=clone(A);for(let i=1;i<k;i++)M=matmul(M,A);
  const nrm=mnorm(M,"fro");                 // cualquier norma sirve para Gelfand
  if(!isFinite(nrm))return Infinity;
  if(nrm===0)return 0;
  return Math.pow(nrm,1/k);
}
const isSymmetric=A=>A.length===A[0].length&&A.every((r,i)=>r.every((v,j)=>Math.abs(v-A[j][i])<1e-9));

/* autovalores aproximados como {re,im} (reales exactos si es simétrica;
   si no, lee la forma de Schur real: bloques 1×1 reales y 2×2 complejos conjugados) */
function eigenvalues(A){
  const n=A.length;
  if(isSymmetric(A))return jacobiEig(A).values.map(v=>({re:v,im:0}));
  const Ak=qrAlgorithm(A,150).slice(-1)[0];const out=[];let i=0;
  while(i<n){
    const sub=i+1<n?Math.abs(Ak[i+1][i]):0;
    if(sub<1e-5){out.push({re:Ak[i][i],im:0});i++;}
    else{ // bloque 2×2 -> autovalores del bloque
      const a=Ak[i][i],b=Ak[i][i+1],c=Ak[i+1][i],d=Ak[i+1][i+1];
      const tr=a+d,de=a*d-b*c,disc=tr*tr-4*de;
      if(disc>=0){out.push({re:(tr+Math.sqrt(disc))/2,im:0});out.push({re:(tr-Math.sqrt(disc))/2,im:0});}
      else{const im=Math.sqrt(-disc)/2;out.push({re:tr/2,im});out.push({re:tr/2,im:-im});}
      i+=2;
    }
  }
  return out;
}

/* ---------- Gershgorin ---------- */
function gershgorin(A){
  return A.map((r,i)=>({center:r[i],radius:r.reduce((s,v,j)=>j===i?s:s+Math.abs(v),0)}));
}

/* ---------- exportar ---------- */
window.LA={clone,zeros,eye,rows,cols,transpose,isVec,matmul,matvec,dot,vadd,vsub,vscale,
  madd,msub,mscale,fmt,matStr,matTex,parseMatrix,rref,backSub,fwdSub,lu,plu,cholesky,qr,
  det,inv,solve,vnorm,mnorm,jacobiEig,powerMethod,rayleigh,qrAlgorithm,svd,splitLDU,
  iterativeSolve,iterMatrix,spectralRadius,isSymmetric,eigenvalues,gershgorin,EPS};
})();
