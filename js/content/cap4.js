window.ALC_CONTENT=window.ALC_CONTENT||[];
window.ALC_CONTENT.push({
id:"cap4",order:4,title:"4 · Métodos directos",blurb:"Factorizaciones LU, PA=LU, Cholesky y QR para resolver Ax=b.",
lessons:[

{
id:"cap4-lu",title:"Factorización LU = A",keywords:["LU","factorización","Doolittle","triangular","sustitución","Gauss","multiplicadores","costo"],
body:`
<p><strong>Factorizar</strong> = escribir $A$ como producto de matrices más simples. La <strong>LU</strong> escribe
$A=LU$ con $L$ triangular inferior (unos en la diagonal) y $U$ triangular superior.</p>

<div class="box tip"><div class="box-title">¿Para qué sirve?</div>
Resolver $Ax=b$ se parte en dos sistemas <strong>triangulares</strong> (baratos, $\\sim n^2$):
$$Ly=b\\ \\ (\\text{sustitución hacia adelante}),\\qquad Ux=y\\ \\ (\\text{hacia atrás}).$$
Si tenés que resolver con muchos $b$ distintos, factorizás <strong>una sola vez</strong>.</div>

<div class="box def"><div class="box-title">Cómo sale (es la eliminación de Gauss)</div>
Cada paso de eliminación es multiplicar por una matriz $M_k=I-z_ke_k^T$ con los multiplicadores $z^{(k)}_i=\\dfrac{a^{(k-1)}_{ik}}{a^{(k-1)}_{kk}}$.
Como $M_k^{-1}=I+z_ke_k^T$, resulta $\\;U=M_{n-1}\\cdots M_1A\\;$ y
$$L=M_1^{-1}\\cdots M_{n-1}^{-1}=I+\\sum_{i=1}^{n-1}z_ie_i^T.$$
<strong>Truco mágico:</strong> en $L$ se guardan, abajo de la diagonal, exactamente los <em>multiplicadores</em> usados (¡sin más cuentas!).</div>

<h3>Factorizá paso a paso</h3>
<div data-widget="luDemo" data-args='{"A":[[2,1,1],[4,3,3],[8,7,9]]}'></div>

<div class="box note"><div class="box-title">Costo</div>
La factorización LU cuesta $\\sim\\tfrac23 n^3$ operaciones. Las dos sustituciones, $\\sim 2n^2$. Todos los métodos directos clásicos son <strong>cúbicos</strong>: si duplicás $n$, el trabajo se multiplica por $8$.</div>

<div class="box warn"><div class="box-title">⚠️ Puede fallar</div>
Si aparece un <strong>pivote nulo</strong>, la LU sin pivoteo se rompe — aunque $A$ sea inversible. Ej.: $A=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$.
La solución es <strong>pivotear</strong> (próxima lección).</div>
`
},

{
id:"cap4-existencia",title:"Existencia de LU · matrices diagonal dominantes",keywords:["existencia","menores principales","diagonal dominante","EDD","DD","estabilidad","rellenado","ralas"],
body:`
<div class="box theo"><div class="box-title">¿Cuándo existe la LU (sin pivoteo)?</div>
$A\\in\\mathbb{K}^{n\\times n}$ admite factorización $A=LU$ con $L,U$ inversibles
$\\iff$ <strong>todos los menores principales</strong> son no nulos:
$$\\det\\big(A(1:k,\\,1:k)\\big)\\ne0\\quad\\text{para todo }k=1,\\dots,n.$$
($\\det A\\ne0$ <em>solo</em> no alcanza, como muestra el ejemplo $\\left(\\begin{smallmatrix}0&1\\\\1&0\\end{smallmatrix}\\right)$.)</div>

<div class="box def"><div class="box-title">Matrices (estrictamente) diagonal dominantes</div>
$A$ es <strong>diagonal dominante (DD)</strong> si $\\sum_{j\\ne i}|a_{ij}|\\le|a_{ii}|$ para toda fila, y <strong>estrictamente (EDD)</strong> con $<$.
<ul>
<li>Si $A$ es <strong>EDD ⇒ es inversible</strong>.</li>
<li>Si $A$ es EDD ⇒ la eliminación de Gauss <strong>no produce pivotes nulos</strong> (existe LU sin pivoteo).</li>
</ul>
Aparecen seguido (por ejemplo, al discretizar ecuaciones diferenciales).</div>

<div class="box warn"><div class="box-title">La máquina no devuelve la LU exacta</div>
En aritmética finita se obtiene $\\tilde L\\tilde U=A+\\Delta A$, con $|\\Delta A|\\lesssim 2(n-1)\\varepsilon(|A|+|\\tilde L||\\tilde U|)$.
Por eso conviene <strong>controlar el tamaño</strong> de los factores: si $|\\tilde L||\\tilde U|$ es enorme, perdemos control del error. El pivoteo ayuda.</div>

<div class="box note"><div class="box-title">El problema del rellenado</div>
Si $A$ es <strong>rala</strong> (muchos ceros, típico en aplicaciones grandes), sus factores $L,U$ pueden <strong>llenarse de no ceros</strong> (<em>fill-in</em>),
perdiendo la ventaja de memoria. Ejemplo del apunte: una matriz de $3319\\times3319$ con $39753$ no-ceros produce una $L$ con $\\sim2.4$ millones de no-ceros. Esto motiva los <strong>métodos iterativos</strong> (Cap 6).</div>
`
},

{
id:"cap4-plu",title:"PA = LU (pivoteo parcial)",keywords:["pivoteo parcial","permutación","PA=LU","estabilidad","pivoteo completo","Wilkinson","multiplicadores"],
body:`
<p>El <strong>pivoteo parcial</strong> elige en cada columna el pivote de <strong>mayor valor absoluto</strong> y permuta filas.
Esto evita pivotes nulos y mantiene los multiplicadores acotados.</p>

<div class="box def"><div class="box-title">Matriz de permutación</div>
$P$ = identidad con filas permutadas. Cumple $P^{-1}=P^T$, $\\det P=\\pm1$. $PA$ = $A$ con filas reordenadas.</div>

<div class="box theo"><div class="box-title">PA = LU</div>
Con pivoteo parcial siempre se obtiene
$$PA=LU,$$
y los multiplicadores quedan <strong>$|\\ell_{ij}|\\le1$</strong>. Si $\\det A\\ne0$ (en aritmética exacta) no hay pivotes nulos.
<p>Para resolver $Ax=b$: permutá $b$ ($Pb$), luego $Ly=Pb$ y $Ux=y$.</p></div>

<h3>Probalo (tildá "pivoteo parcial")</h3>
<div data-widget="luDemo" data-args='{"A":[[0,1,1],[1,2,4],[3,0,1]]}'></div>

<div class="box note"><div class="box-title">¿Por qué tomar el pivote más grande?</div>
Porque $|\\ell_{ij}|\\le1$ controla $|L|$. No garantiza que $|U|$ sea chico: el <strong>factor de crecimiento</strong> puede llegar a $2^{n-1}$ en el peor caso (ejemplo de Wilkinson),
pero en la <strong>práctica</strong> el crecimiento es benigno ($\\sim\\sqrt n$). Por eso Gauss con pivoteo parcial sigue siendo el método directo más popular (¡y cuesta la mitad que QR!).</div>

<div class="box def"><div class="box-title">Pivoteo completo</div>
Permuta filas <em>y</em> columnas para tomar el mayor pivote de toda la submatriz: $PA\\tilde P=LU$. Controla mejor el crecimiento (cota de Wilkinson) pero es <strong>más caro</strong> (hay que comparar muchos elementos), así que casi no se usa.</div>

<div class="quiz">
<div class="q">¿Cuál es la principal razón del pivoteo parcial?</div>
<button class="opt" data-correct="1" data-exp="Mantener |ℓᵢⱼ|≤1 controla L y evita pivotes nulos/chicos ⇒ estabilidad.">estabilidad numérica (multiplicadores acotados)</button>
<button class="opt" data-exp="El costo es esencialmente el mismo que sin pivoteo.">reducir el costo de O(n³) a O(n²)</button>
<button class="opt" data-exp="No hace falta que A sea simétrica.">hacer la matriz simétrica</button>
<div class="feedback"></div>
</div>
`
},

{
id:"cap4-cholesky",title:"Cholesky: A = LLᵀ",keywords:["Cholesky","definida positiva","SPD","LDLt","raíz cuadrada","simétrica"],
body:`
<p>Cuando $A$ es <strong>simétrica definida positiva (SDP)</strong>, hay una factorización más barata y estable que aprovecha la simetría.</p>

<div class="box theo"><div class="box-title">Definida positiva ⇒ Cholesky</div>
$A$ SDP $\\iff$ es simétrica y $v^{*}Av>0$ para todo $v\\ne0$ $\\iff$ es simétrica con todos los autovalores $>0$.
Entonces existe <strong>única</strong> $C$ triangular inferior con diagonal positiva tal que
$$A=CC^{*}\\quad(\\text{en }\\mathbb{R}:\\ A=LL^T).$$
Sale de $A=LDL^{*}$ con $D>0$, tomando $C=LD^{1/2}$.</div>

<div class="box def"><div class="box-title">Algoritmo (columna a columna)</div>
$$c_{jj}=\\sqrt{a_{jj}-\\sum_{k<j}c_{jk}^2},\\qquad c_{ij}=\\frac{1}{c_{jj}}\\Big(a_{ij}-\\sum_{k<j}c_{ik}c_{jk}\\Big),\\ i>j.$$
Si en algún paso el radicando es $\\le0$, la matriz <strong>no era definida positiva</strong> (¡es un test de SDP!).</div>

<h3>Calculá Cholesky</h3>
<div data-widget="choleskyDemo" data-args='{"A":[[4,2,2],[2,5,1],[2,1,3]]}'></div>

<div class="box note"><div class="box-title">Ventajas</div>
<ul>
<li>Cuesta $\\sim\\tfrac13 n^3$: la <strong>mitad</strong> que LU (explota la simetría).</li>
<li>Es <strong>estable sin pivoteo</strong>: no hace falta permutar.</li>
<li>Da, gratis, un <strong>test de definida positividad</strong>.</li>
</ul></div>

<div class="ejercicio"><div class="ej-head">Ejercicio</div>
¿Por qué $A=\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$ no tiene Cholesky?
<div class="ej-sol">Es simétrica pero sus autovalores son $3$ y $-1$ (no todos positivos): no es definida positiva. Al intentar el algoritmo, $c_{11}=1$ y luego $a_{22}-c_{21}^2=1-4=-3<0$ ⇒ raíz de negativo. Probalo en el widget.</div>
<button class="toggle-sol">Ver solución</button></div>
`
},

{
id:"cap4-qr",title:"Factorización QR",keywords:["QR","ortogonal","Gram-Schmidt","Householder","triangular","columnas independientes","estable"],
body:`
<p>La eliminación gaussiana triangula con matrices triangulares (que pueden crecer). La idea de <strong>QR</strong> es triangular usando
matrices <strong>ortogonales</strong> (norma $1$, no amplifican errores).</p>

<div class="box theo"><div class="box-title">Factorización QR</div>
Toda $A\\in\\mathbb{K}^{m\\times n}$ con columnas L.I. se escribe
$$A=QR,$$
con $Q\\in\\mathbb{K}^{m\\times n}$ de <strong>columnas ortonormales</strong> ($Q^{*}Q=I$) y $R\\in\\mathbb{K}^{n\\times n}$ triangular superior.
Si $A$ es cuadrada inversible, $Q$ es unitaria/ortogonal.</div>

<div class="box def"><div class="box-title">De dónde sale: Gram-Schmidt</div>
Ortonormalizando las columnas $a_1,\\dots,a_n$ se obtienen los $q_i$ y los coeficientes $r_{ij}$:
$$a_1=r_{11}q_1,\\quad a_2=r_{12}q_1+r_{22}q_2,\\quad\\dots,\\quad a_n=\\sum_{i\\le n}r_{in}q_i.$$
$\\langle q_1,\\dots,q_k\\rangle=\\langle a_1,\\dots,a_k\\rangle$ para todo $k$ (espacios columna anidados).</div>

<h3>Factorizá (probá clásico vs modificado)</h3>
<div data-widget="qrDemo" data-args='{"A":[[1,1,0],[1,0,1],[0,1,1]]}'></div>

<div class="box tip"><div class="box-title">¿Por qué QR?</div>
Resolver $Ax=b$ con $A=QR$ ⇒ $Rx=Q^{*}b$ (un sistema triangular). Es <strong>más estable</strong> que LU porque $Q$ no amplifica errores
($\\kappa_2(Q)=1$). Para $A$ cuadrada, Gram-Schmidt cuesta $\\sim 2n^3$ y la versión por reflexiones de Householder $\\sim\\tfrac43 n^3$ (el doble que LU): por eso para sistemas cuadrados se prefiere Gauss; pero QR
es <strong>la herramienta</strong> para <a data-goto="cap8-normales">cuadrados mínimos</a> y autovalores (algoritmo QR, Cap 5).</div>

<div class="box note"><div class="box-title">Gram-Schmidt modificado y Householder</div>
El GS <strong>modificado</strong> (proyectores de rango $n-1$ aplicados secuencialmente) es más estable que el clásico.
En la práctica profesional la QR se calcula con <strong>reflexiones de Householder</strong> (aún más estables), pero la idea conceptual es la misma. Cambiá entre "clásico" y "modificado" en el widget y compará $Q^TQ$.</div>
`
}

]
});
