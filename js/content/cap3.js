window.ALC_CONTENT=window.ALC_CONTENT||[];
window.ALC_CONTENT.push({
id:"cap3",order:3,title:"3 · Normas y producto interno",blurb:"Normas vectoriales y matriciales, Cauchy-Schwarz, ortogonalidad, proyecciones, condición.",
lessons:[

{
id:"cap3-normas",title:"Normas en Kⁿ",keywords:["norma","norma 1","norma 2","euclídea","norma infinito","norma p","bola unitaria","equivalencia","triangular"],
body:`
<p>Una <strong>norma</strong> mide el "tamaño" de un vector y nos permite hablar de distancia, convergencia y error.</p>

<div class="box def"><div class="box-title">Norma</div>
$\\|\\cdot\\|:V\\to\\mathbb{R}_{\\ge0}$ es norma si:
<ol>
<li>$\\|av\\|=|a|\\,\\|v\\|$ (homogeneidad);</li>
<li>$\\|v\\|=0\\Rightarrow v=0$ (definida positiva);</li>
<li>$\\|u+v\\|\\le\\|u\\|+\\|v\\|$ (<strong>desigualdad triangular</strong>).</li>
</ol></div>

<div class="box note"><div class="box-title">Las normas-p</div>
$$\\|v\\|_1=\\sum_i|v_i|,\\qquad \\|v\\|_2=\\sqrt{\\sum_i|v_i|^2},\\qquad \\|v\\|_\\infty=\\max_i|v_i|,\\qquad \\|v\\|_p=\\Big(\\sum_i|v_i|^p\\Big)^{1/p}.$$
La norma-2 (euclídea) es la "distancia de toda la vida". Y $\\lim_{p\\to\\infty}\\|v\\|_p=\\|v\\|_\\infty$.</div>

<h3>Las bolas unitarias $\\{v:\\|v\\|_p=1\\}$ en ℝ²</h3>
<div data-widget="normBall"></div>

<div class="box theo"><div class="box-title">Equivalencia de normas</div>
En dimensión <strong>finita</strong>, todas las normas son equivalentes: existen $0<c\\le C$ con $c\\|x\\|_*\\le\\|x\\|\\le C\\|x\\|_*$.
<p>En particular: $\\|x\\|_\\infty\\le\\|x\\|_2\\le\\sqrt n\\,\\|x\\|_\\infty$, $\\ \\|x\\|_2\\le\\|x\\|_1\\le\\sqrt n\\,\\|x\\|_2$, $\\ \\|x\\|_\\infty\\le\\|x\\|_1\\le n\\|x\\|_\\infty$.</p>
<strong>Consecuencia clave:</strong> si una sucesión converge en una norma, converge en todas. (Las constantes empeoran cuando $n\\to\\infty$.)</div>

<div class="box tip">Para <strong>medir errores</strong> usamos $\\|x_a-x_v\\|$. A veces conviene una norma distinta a la 2 (más fácil de acotar): por la equivalencia, las conclusiones cualitativas no cambian.</div>
`
},

{
id:"cap3-pi",title:"Producto interno, Cauchy-Schwarz y ortogonalidad",keywords:["producto interno","producto escalar","Cauchy-Schwarz","ángulo","ortogonal","ortonormal","delta"],
body:`
<div class="box def"><div class="box-title">Producto interno canónico</div>
Para $u,v\\in\\mathbb{K}^n$: $\\ \\langle u,v\\rangle=u^{*}v=\\sum_i \\overline{u_i}\\,v_i$. En $\\mathbb{R}^n$ es $u^Tv=\\sum u_iv_i$.
<p>Propiedades: $\\langle u,v\\rangle=\\overline{\\langle v,u\\rangle}$, lineal en la 2ª variable, y $\\langle Aw,x\\rangle=\\langle w,A^{*}x\\rangle$.
Además $\\|v\\|_2=\\sqrt{\\langle v,v\\rangle}$.</p></div>

<div class="box theo"><div class="box-title">Desigualdad de Cauchy-Schwarz</div>
$$|\\langle u,v\\rangle|\\le \\|u\\|_2\\,\\|v\\|_2.$$
<em>Idea de la prueba (caso real):</em> $p(x)=\\sum_i(u_ix+v_i)^2\\ge0$ es un cuadrático en $x$; su discriminante $\\le0$ da exactamente la desigualdad.
De acá sale la <strong>triangular</strong> para la norma-2.</div>

<div class="box def"><div class="box-title">Ángulo y ortogonalidad</div>
Como $-1\\le\\dfrac{\\langle u,v\\rangle}{\\|u\\|\\|v\\|}\\le1$, se define el ángulo por
$\\cos\\theta=\\dfrac{\\langle u,v\\rangle}{\\|u\\|_2\\|v\\|_2}$.
Dos vectores no nulos son <strong>ortogonales</strong> ($u\\perp v$) si $\\langle u,v\\rangle=0$.</div>

<div class="box def"><div class="box-title">Conjuntos ortonormales</div>
$\\{v_1,\\dots,v_k\\}$ es <strong>ortogonal</strong> si $\\langle v_i,v_j\\rangle=0$ para $i\\ne j$, y <strong>ortonormal</strong> si además $\\|v_i\\|_2=1$
(es decir $\\langle v_i,v_j\\rangle=\\delta_{ij}$).</div>

<div class="box tip"><div class="box-title">Por qué la ortogonalidad es ORO</div>
Si $\\mathcal{B}=\\{v_1,\\dots,v_n\\}$ es base <strong>ortonormal</strong> y $w=\\sum\\alpha_iv_i$, entonces $\\alpha_j=\\langle v_j,w\\rangle$: ¡las coordenadas se obtienen con un producto interno, sin resolver ningún sistema! Matricialmente, si $Q$ tiene esos $v_i$ por columnas, $Q^{*}Q=I$ y "invertir = trasponer-conjugar".
Además vale Pitágoras: $\\|w\\|^2=\\sum_i|\\alpha_i|^2$.</div>
`
},

{
id:"cap3-proyecciones",title:"Proyecciones y Gram-Schmidt",keywords:["proyección","proyector","Gram-Schmidt","ortonormalizar","mínima distancia"],
body:`
<p>La <strong>proyección ortogonal</strong> de $w$ sobre la recta generada por $v\\ne0$ es el punto de esa recta más cercano a $w$:</p>
$$P_v(w)=\\frac{\\langle v,w\\rangle}{\\|v\\|_2^2}\\,v=\\frac{v^{*}w}{v^{*}v}\\,v.$$
<p>Se caracteriza por $(w-P_v(w))\\perp v$. Si $\\|v\\|=1$, queda $P_v(w)=(v^{*}w)\\,v=vv^{*}w$ (matriz $vv^{*}$ de rango 1).</p>

<h3>Mirá la proyección</h3>
<div data-widget="projDemo"></div>

<div class="box def"><div class="box-title">Proyección sobre un subespacio $S$</div>
Si $\\{q_1,\\dots,q_k\\}$ es base <strong>ortonormal</strong> de $S$:
$$P_S(w)=\\sum_{i=1}^k (q_i^{*}w)\\,q_i = QQ^{*}w,\\qquad Q=(q_1\\mid\\cdots\\mid q_k).$$
Cumple $(w-P_S(w))\\perp S$ y es el elemento de $S$ que <strong>minimiza la distancia</strong> a $w$. (Esto es la clave de cuadrados mínimos, Cap 8.)</div>

<div class="box theo"><div class="box-title">Ortonormalización de Gram-Schmidt</div>
A partir de $\\{v_1,\\dots,v_n\\}$ L.I. produce $\\{q_1,\\dots,q_n\\}$ ortonormales con $\\langle q_1,\\dots,q_k\\rangle=\\langle v_1,\\dots,v_k\\rangle$:
$$u_1=v_1,\\qquad u_k=v_k-\\sum_{i=1}^{k-1}P_{u_i}(v_k),\\qquad q_k=\\frac{u_k}{\\|u_k\\|}.$$
"A cada $v_k$ le resto sus componentes en los anteriores." Costo $\\sim 2n^3$. (El paso a matrices da la factorización $QR$ del Cap 4.)</div>

<div class="box warn"><div class="box-title">Gram-Schmidt clásico vs modificado</div>
El <strong>modificado</strong> (restar las proyecciones de forma secuencial, usando los $q_i$ ya calculados) es numéricamente <strong>más estable</strong> que el clásico. Probá ambos en el widget de QR del Cap 4.</div>
`
},

{
id:"cap3-proyectores",title:"Proyectores",keywords:["proyector","idempotente","P^2=P","oblicuo","ortogonal","complementario","suma directa"],
body:`
<div class="box def"><div class="box-title">Proyector</div>
Una matriz $P\\ne0$ es un <strong>proyector</strong> si $P^2=P$ (idempotente). Entonces:
<ul>
<li>Deja fijo su rango: si $v\\in\\mathrm{Im}(P)$, $Pv=v$.</li>
<li>$\\mathrm{Im}(I-P)=\\ker(P)$ y $\\mathrm{Im}(P)=\\ker(I-P)$.</li>
<li>$\\mathbb{K}^n=\\ker(P)\\oplus\\mathrm{Im}(P)$ (suma directa). $I-P$ es el <strong>proyector complementario</strong>.</li>
</ul></div>

<div class="box def"><div class="box-title">Proyector ortogonal</div>
$P$ es <strong>ortogonal</strong> si $\\ker(P)\\perp\\mathrm{Im}(P)$. Equivale a $\\;P=P^{*}\\;$ (proyector hermitiano/simétrico). Si no, es <em>oblicuo</em>.</div>

<div class="box theo"><div class="box-title">Caracterización (muy usada)</div>
Para un proyector $P$ son equivalentes:
<ol>
<li>$P$ es ortogonal;</li>
<li>$\\|v\\|^2=\\|(I-P)v\\|^2+\\|Pv\\|^2$ (Pitágoras) para todo $v$;</li>
<li>$\\|P\\|_2=1$.</li>
</ol></div>

<div class="box note"><div class="box-title">Construcción</div>
Si $A\\in\\mathbb{C}^{n\\times k}$ tiene <strong>columnas ortonormales</strong> ($A^{*}A=I_k$), entonces $P=AA^{*}$ es un proyector ortogonal sobre $\\mathrm{Im}(A)$:
$$P^2=A(A^{*}A)A^{*}=AA^{*}=P,\\qquad P^{*}=P.$$
Y $Pv=\\sum_{i}(q_i^{*}v)q_i$. El proyector de rango 1 $P_v=vv^{*}$ (con $\\|v\\|=1$) y su complementario $P_{v^\\perp}=I-vv^{*}$ son las piezas con que se reescribe Gram-Schmidt y, más adelante, las reflexiones de Householder.</div>
`
},

{
id:"cap3-normas-matrices",title:"Normas de matrices",keywords:["norma matricial","subordinada","inducida","Frobenius","submultiplicativa","unitaria","isometría","radio espectral"],
body:`
<p>A una matriz la pensamos como <strong>transformación lineal</strong>, así que su norma debe medir cuánto puede <em>estirar</em> un vector.</p>

<div class="box def"><div class="box-title">Norma subordinada (inducida)</div>
Dada una norma vectorial $\\|\\cdot\\|$:
$$\\|A\\|=\\max_{x\\ne0}\\frac{\\|Ax\\|}{\\|x\\|}=\\max_{\\|x\\|=1}\\|Ax\\|.$$
De aquí salen: $\\|Ax\\|\\le\\|A\\|\\|x\\|$, $\\ \\|AB\\|\\le\\|A\\|\\|B\\|$ (<strong>submultiplicativa</strong>), $\\ \\|A^k\\|\\le\\|A\\|^k$ y $\\|I\\|=1$.</div>

<div class="box note"><div class="box-title">Fórmulas que se calculan "a ojo"</div>
$$\\|A\\|_1=\\max_j\\sum_i|a_{ij}|\\ (\\text{máx suma de columnas}),\\qquad \\|A\\|_\\infty=\\max_i\\sum_j|a_{ij}|\\ (\\text{máx suma de filas}).$$
$$\\|A\\|_2=\\sqrt{\\rho(A^{*}A)}=\\sigma_1\\ (\\text{mayor valor singular, Cap 7}).$$
Si $A$ es simétrica, $\\|A\\|_2=\\rho(A)=\\max|\\lambda|$ (Cap 5).</div>

<div class="box def"><div class="box-title">Norma de Frobenius (no subordinada)</div>
$$\\|A\\|_F=\\sqrt{\\sum_{i,j}|a_{ij}|^2}=\\sqrt{\\mathrm{tr}(A^{*}A)}.$$
Es como tratar a $A$ como un vector largo. Pese a no ser subordinada, sí es submultiplicativa: $\\|AB\\|_F\\le\\|A\\|_F\\|B\\|_F$ (por Cauchy-Schwarz).</div>

<div class="box theo"><div class="box-title">Matrices unitarias/ortogonales = isometrías</div>
Si $Q^{*}Q=I$: $\\ \\|Qx\\|_2=\\|x\\|_2$ (no cambian longitudes) y $\\langle Qv,Qw\\rangle=\\langle v,w\\rangle$ (no cambian ángulos).
Por eso $\\|Q\\|_2=1$, y además $\\|QA\\|_2=\\|A\\|_2$, $\\|QA\\|_F=\\|A\\|_F$. <strong>Son las matrices ideales para algoritmos estables.</strong></div>

<div class="ejercicio"><div class="ej-head">Ejercicio</div>
Calculá $\\|A\\|_1$ y $\\|A\\|_\\infty$ para $A=\\begin{pmatrix}1&-2\\\\3&4\\end{pmatrix}$.
<div class="ej-sol">$\\|A\\|_1=\\max(|1|+|3|,\\,|-2|+|4|)=\\max(4,6)=6$. $\\|A\\|_\\infty=\\max(|1|+|-2|,\\,|3|+|4|)=\\max(3,7)=7$.</div>
<button class="toggle-sol">Ver solución</button></div>
`
},

{
id:"cap3-cond-matrices",title:"Número de condición de matrices",keywords:["condición","kappa","cond","sensibilidad","Ax=b","singular","mal condicionada"],
body:`
<div class="box def"><div class="box-title">Condición de una matriz</div>
Para $A$ inversible y una norma subordinada:
$$\\kappa(A)=\\|A\\|\\,\\|A^{-1}\\|.$$
Si $A$ es singular, $\\kappa(A)=+\\infty$. Propiedades: $\\kappa(A)\\ge1$, $\\kappa(I)=1$, $\\kappa(\\alpha A)=\\kappa(A)$, $\\kappa(Q)=1$ si $Q$ es unitaria, y $\\kappa(A)=\\kappa(A^{-1})$.</div>

<div class="box theo"><div class="box-title">Sensibilidad de $Ax=b$</div>
Si perturbamos los datos ($A\\to A+\\Delta A$, $b\\to b+\\Delta b$), el error relativo en la solución se acota por
$$\\frac{\\|\\Delta x\\|}{\\|x\\|}\\ \\lesssim\\ \\kappa(A)\\Big(\\frac{\\|\\Delta b\\|}{\\|b\\|}+\\frac{\\|\\Delta A\\|}{\\|A\\|}\\Big).$$
Con solo error en $b$: $\\ \\dfrac{1}{\\kappa(A)}\\dfrac{\\|\\Delta b\\|}{\\|b\\|}\\le\\dfrac{\\|\\Delta x\\|}{\\|x\\|}\\le\\kappa(A)\\dfrac{\\|\\Delta b\\|}{\\|b\\|}.$
<strong>Podés perder hasta $\\log_{10}\\kappa(A)$ dígitos.</strong></div>

<div class="box theo"><div class="box-title">κ mide la distancia (relativa) a las singulares</div>
$$\\frac{1}{\\kappa(A)}=\\inf_{B\\text{ singular}}\\frac{\\|A-B\\|}{\\|A\\|}.$$
$\\kappa$ grande ⇒ $A$ está <em>cerca</em> de ser singular. Ojo: el <strong>determinante NO sirve</strong> para medir esto, porque $\\det(\\alpha A)=\\alpha^n\\det A\\to0$ pero $\\kappa(\\alpha A)=\\kappa(A)$.</div>

<h3>Analizá la condición de una matriz</h3>
<div data-widget="condDemo" data-args='{"A":[[1,1],[1,1.0001]]}'></div>

<div class="box tip">Cambiá la entrada $(2,2)$ de $1.0001$ a $2$ en el widget: verás cómo $\\kappa$ baja muchísimo. La matriz de Hilbert es el ejemplo clásico de matriz <em>terriblemente</em> mal condicionada.</div>
`
}

]
});
