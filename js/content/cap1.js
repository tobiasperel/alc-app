window.ALC_CONTENT=window.ALC_CONTENT||[];
window.ALC_CONTENT.push({
id:"cap1",order:1,title:"1 · Nociones básicas",blurb:"Vectores, matrices, sistemas, espacios, bases, cambio de base, transformaciones lineales.",
lessons:[

/* ---------------- 1.1 vectores y matrices ---------------- */
{
id:"cap1-vectores",title:"Vectores y matrices",keywords:["vector","matriz","Kmn","suma","escalar","numpy","array"],
body:`
<p>Un <strong>vector</strong> de $n$ coordenadas es una lista ordenada $v=(v_1,\\dots,v_n)$ de números reales o complejos.
Escribimos $\\mathbb{R}^n$, $\\mathbb{C}^n$ o, en general, $\\mathbb{K}^n$.</p>

<div class="box def"><div class="box-title">Matrices</div>
$\\mathbb{K}^{m\\times n}$ es el conjunto de matrices con $m$ filas y $n$ columnas. La entrada en la fila $i$, columna $j$ se nota $a_{ij}$.
Identificamos un vector de $\\mathbb{K}^n$ con una <strong>matriz columna</strong> de $n\\times1$.</div>

<h2>Suma y producto por escalar</h2>
<p>Estas dos operaciones (que definen la estructura de <em>espacio vectorial</em>) se hacen <strong>coordenada a coordenada</strong>:</p>
$$ v+u=(v_1+u_1,\\dots,v_n+u_n),\\qquad a\\,v=(a\\,v_1,\\dots,a\\,v_n). $$
<p>Solo se pueden sumar matrices del <strong>mismo tamaño</strong>.</p>

<div class="box note"><div class="box-title">🐍 En Python (numpy)</div>
<pre><span class="py-kw">import</span> numpy <span class="py-kw">as</span> np
v1 = np.array([10, 5, -7, 1])
A  = np.array([[1,2,3,4],[7,1,2,-1]])   <span class="py-com"># matriz 2x4</span>
<span class="py-fn">print</span>(v1 + np.array([5,0,7,2]))         <span class="py-com"># suma coordenada a coordenada</span>
<span class="py-fn">print</span>(A[1,2])                          <span class="py-com"># entrada fila 1, col 2 (¡índices base 0!)</span></pre>
Ojo: el operador <code>*</code> en numpy es producto <strong>coordenada a coordenada</strong> (Hadamard), <em>no</em> el producto de matrices. Para ese usá <code>@</code>.</div>

<h3>Probalo</h3>
<div data-widget="matrixOps" data-args='{"A":[[1,2],[3,4]],"B":[[2,0],[1,2]]}'></div>

<div class="box tip"><div class="box-title">Idea clave para todo el curso</div>
Pensar una matriz $A\\in\\mathbb{K}^{m\\times n}$ de tres formas: como <strong>tabla de números</strong>, como <strong>colección de columnas</strong> (o filas), y como una <strong>transformación lineal</strong> $x\\mapsto Ax$. Cambiar de punto de vista es la mitad de la materia.</div>
`
},

/* ---------------- 1.2 sistemas / eliminación ---------------- */
{
id:"cap1-sistemas",title:"Sistemas lineales y eliminación gaussiana",keywords:["sistema","gauss","escalonar","triangular","sustitución","matriz ampliada","REF"],
body:`
<p>Resolver $Ax=b$ por <strong>eliminación gaussiana</strong> = transformar la <em>matriz ampliada</em> $(A\\mid b)$ en una
<strong>escalonada</strong> mediante operaciones de fila, y luego despejar "hacia atrás".</p>

<div class="box def"><div class="box-title">Operaciones elementales de fila</div>
No cambian el conjunto de soluciones:
<ol>
<li>Sumar a una fila un múltiplo de otra.</li>
<li>Intercambiar dos filas.</li>
<li>Multiplicar una fila por un escalar $\\ne 0$.</li>
</ol></div>

<p>El objetivo es producir, en cada fila, <strong>más ceros iniciales</strong> que en la anterior (forma escalonada). Por ejemplo:</p>
$$\\left(\\begin{array}{ccc|c}1&5&5&2\\\\2&2&-3&-1\\\\-1&-9&2&9\\end{array}\\right)\\xrightarrow{\\ \\text{escalonar}\\ }
\\left(\\begin{array}{ccc|c}1&5&5&2\\\\0&-8&-13&-5\\\\0&0&\\tfrac{27}{2}&\\tfrac{27}{2}\\end{array}\\right)$$
<p>De abajo hacia arriba: $z=1$, luego $y=-1$, luego $x=2$.</p>

<div class="box exam"><div class="box-title">📎 Ejemplo (sistema con infinitas soluciones)</div>
$\\begin{cases}x_1+2x_2-x_3=-1\\\\2x_1+4x_2+x_3=4\\\\3x_3=6\\end{cases}$ escalona a
$\\left(\\begin{array}{ccc|c}1&2&-1&-1\\\\0&0&3&6\\\\0&0&0&0\\end{array}\\right)$.
Despejando: $x_3=2$, $x_1=1-2x_2$, con $x_2$ <strong>libre</strong>. Solución: $S=\\{(1-2x_2,\\,x_2,\\,2):x_2\\in\\mathbb{R}\\}$.</div>

<h3>Escaloná vos (cargá tu sistema)</h3>
<div data-widget="gaussElim"></div>

<div class="ejercicio">
<div class="ej-head">Ejercicio 1.1</div>
Escalonar y clasificar: $\\begin{cases}x-2y=2\\\\2x+y=1\\\\x+3y=-1\\end{cases}$
<div class="ej-sol"><p>Ampliada $\\left(\\begin{smallmatrix}1&-2&2\\\\2&1&1\\\\1&3&-1\\end{smallmatrix}\\right)$.
$f_2-2f_1,\\ f_3-f_1$ dan $\\left(\\begin{smallmatrix}1&-2&2\\\\0&5&-3\\\\0&5&-3\\end{smallmatrix}\\right)$, y $f_3-f_2$ anula la última fila.
Quedan 2 ecuaciones, 2 incógnitas independientes ⇒ <strong>compatible determinado</strong>. De $5y=-3$: $y=-3/5$, $x=2+2y=4/5$.</p>
<p>Verificalo cargándolo en el widget de arriba.</p></div>
<button class="toggle-sol">Ver solución</button>
</div>
`
},

/* ---------------- 1.3 clasificación / rango ---------------- */
{
id:"cap1-clasificacion",title:"Clasificación de sistemas y rango",keywords:["compatible","determinado","indeterminado","incompatible","rango","Rouché","variables libres"],
body:`
<p>Tras escalonar la ampliada $(A\\mid b)$, leemos cuántas soluciones hay. Con $n$ incógnitas:</p>

<table class="tbl">
<tr><th>Tipo</th><th>Cómo se detecta</th><th>Soluciones</th></tr>
<tr><td><strong>Incompatible</strong></td><td>aparece una fila $0\\,\\cdots\\,0\\mid a$ con $a\\ne0$</td><td>ninguna</td></tr>
<tr><td><strong>Compatible determinado</strong></td><td>$\\mathrm{rg}(A)=\\mathrm{rg}(A\\mid b)=n$</td><td>única</td></tr>
<tr><td><strong>Compatible indeterminado</strong></td><td>$\\mathrm{rg}(A)=\\mathrm{rg}(A\\mid b)<n$</td><td>$\\infty$ (hay $n-\\mathrm{rg}$ variables libres)</td></tr>
</table>

<div class="box def"><div class="box-title">Rango</div>
El <strong>rango</strong> de $A$ es la cantidad máxima de filas (o columnas) linealmente independientes; coincide con el número de filas no nulas al escalonar.
<p><strong>Propiedad clave:</strong> rango-fila = rango-columna. Por eso hablamos simplemente de <em>rango</em>.</p></div>

<div class="box theo"><div class="box-title">Teorema de Rouché–Frobenius (versión computacional)</div>
$Ax=b$ tiene solución $\\iff \\mathrm{rg}(A)=\\mathrm{rg}(A\\mid b)$. Si además ese rango es $n$, la solución es única.</div>

<div class="box note"><div class="box-title">Rango de un producto</div>
Para $A\\in\\mathbb{R}^{m\\times n}$, $B\\in\\mathbb{R}^{n\\times p}$:
<ul>
<li>$\\mathrm{rg}(A)=\\mathrm{rg}(A^T)=\\mathrm{rg}(A^TA)=\\mathrm{rg}(AA^T)$.</li>
<li>$\\mathrm{rg}(AB)\\le\\min\\{\\mathrm{rg}(A),\\mathrm{rg}(B)\\}$.</li>
<li>Si $B$ es cuadrada de rango máximo, $\\mathrm{rg}(AB)=\\mathrm{rg}(A)$.</li>
</ul>
<em>Idea:</em> las columnas de $AB$ son combinaciones de las de $A$, y las filas de $AB$ son combinaciones de las de $B$.</div>

<div class="quiz">
<div class="q">Al escalonar $(A\\mid b)$ con $4$ incógnitas obtuviste $3$ filas no nulas y ninguna del tipo $0\\cdots0\\mid\\ne0$. El sistema es…</div>
<button class="opt" data-correct="1" data-exp="$\\mathrm{rg}(A)=\\mathrm{rg}(A|b)=3<4$ ⇒ una variable libre.">Compatible indeterminado (1 variable libre)</button>
<button class="opt" data-exp="Para única necesitarías rango $=4$.">Compatible determinado</button>
<button class="opt" data-exp="No hay fila inconsistente.">Incompatible</button>
<div class="feedback"></div>
</div>
`
},

/* ---------------- 1.4 espacios vectoriales ---------------- */
{
id:"cap1-ev",title:"Espacios y subespacios vectoriales",keywords:["espacio vectorial","subespacio","axiomas","cuerpo","polinomios"],
body:`
<div class="box def"><div class="box-title">Espacio vectorial</div>
Un $\\mathbb{K}$-espacio vectorial es un conjunto $V$ con suma $+:V\\times V\\to V$ y producto por escalar $\\cdot:\\mathbb{K}\\times V\\to V$
que cumplen 8 axiomas (asociatividad y conmutatividad de la suma, neutro $0$, opuesto, $1v=v$, $a(bv)=(ab)v$, y las dos distributivas).</div>

<p><strong>Ejemplos:</strong> $\\mathbb{K}^n$; las matrices $\\mathbb{K}^{m\\times n}$; los polinomios $\\mathbb{K}[x]$; los de grado $\\le d$, $\\mathbb{R}[x]_d$; las sucesiones. Notá que $\\mathbb{C}$ es a la vez $\\mathbb{C}$-e.v. y $\\mathbb{R}$-e.v.</p>
<p><strong>No</strong> son e.v.: "matrices de cualquier tamaño" (no se pueden sumar) ni "polinomios de grado <em>exactamente</em> $d$" (no contienen al $0$).</p>

<div class="box def"><div class="box-title">Subespacio</div>
$U\\subseteq V$ es subespacio si:
<ol><li>$0\\in U$;</li><li>es cerrado por suma: $u,v\\in U\\Rightarrow u+v\\in U$;</li><li>es cerrado por escalar: $u\\in U,\\ \\alpha\\in\\mathbb{K}\\Rightarrow \\alpha u\\in U$.</li></ol>
Todo subespacio es, a su vez, un espacio vectorial.</div>

<div class="box exam"><div class="box-title">📎 Ejemplos de subespacios</div>
<ul>
<li>$\\{v\\in\\mathbb{R}^5: v_1=0\\}$ ✔ (la condición es homogénea).</li>
<li>Matrices diagonales de $3\\times3$ ✔; matrices simétricas $n\\times n$ ✔.</li>
<li>$\\{v\\in\\mathbb{R}^5: v_1=1\\}$ ✘ (¡no contiene al $0$!).</li>
<li>Polinomios de $\\mathbb{R}[x]$ que se anulan en $1$ ✔.</li>
</ul></div>

<div class="box warn"><div class="box-title">Regla mnemotécnica</div>
Si la definición del conjunto tiene una <strong>condición $=$ constante no nula</strong> (como $v_1=1$) o algo no lineal (como $v_1^2=v_2$), <strong>casi seguro NO es subespacio</strong>. Los subespacios se describen con <em>ecuaciones lineales homogéneas</em>.</div>
`
},

/* ---------------- 1.5 independencia, bases, dimensión ---------------- */
{
id:"cap1-bases",title:"Independencia lineal, generadores y bases",keywords:["independencia lineal","base","dimensión","generadores","span","canónica"],
body:`
<div class="box def"><div class="box-title">Independencia lineal</div>
$\\{v_1,\\dots,v_m\\}$ es <strong>linealmente independiente (L.I.)</strong> si la única forma de tener
$\\sum_{i=1}^m a_i v_i = 0$ es con todos los $a_i=0$. Si no, son <strong>dependientes (L.D.)</strong>.</div>

<p><strong>Generado:</strong> $\\langle v_1,\\dots,v_m\\rangle=\\{a_1v_1+\\cdots+a_mv_m\\}$ es el subespacio de todas las combinaciones lineales.</p>

<div class="box def"><div class="box-title">Base y dimensión</div>
Una <strong>base</strong> de $V$ es un conjunto L.I. que genera $V$. Todas las bases de un mismo espacio (de dimensión finita) tienen
la <strong>misma cantidad</strong> de elementos: ese número es la <strong>dimensión</strong> $\\dim V$.</div>

<div class="box exam"><div class="box-title">📎 Bases canónicas</div>
<ul>
<li>$\\mathbb{R}^n$: $\\{e_1,\\dots,e_n\\}$ con $e_i$ el vector que tiene $1$ en la posición $i$. $\\dim=n$.</li>
<li>$\\mathbb{R}[x]_d$: $\\{1,x,x^2,\\dots,x^d\\}$. $\\dim=d+1$.</li>
<li>$\\mathbb{R}[x]$: dimensión infinita.</li>
</ul></div>

<div class="box theo"><div class="box-title">Resultados que se usan todo el tiempo</div>
En un espacio de dimensión $n$:
<ul>
<li>Menos de $n$ vectores <strong>no pueden generar</strong> todo $V$.</li>
<li>Más de $n$ vectores <strong>no pueden ser L.I.</strong></li>
<li>$n$ vectores L.I. <strong>ya son base</strong> (y $n$ generadores también).</li>
<li><strong>Extensión de base:</strong> toda base de un subespacio se puede extender a una base de $V$.</li>
</ul></div>

<h2>Base a partir de generadores (triangulando)</h2>
<p>Para hallar una base de $S=\\langle v_1,\\dots,v_s\\rangle$: poné los $v_i$ como <strong>filas</strong> de una matriz, escaloná, y quedate
con las <strong>filas no nulas</strong>. (El espacio generado por las filas no cambia al escalonar.)</p>
<div class="box note">Ej.: $S=\\langle(1,4,3,-1),(1,0,1,0),(3,3,2,7),(2,6,0,14),(2,3,1,7)\\rangle\\subset\\mathbb{R}^4$ tiene base
$\\{(1,4,3,-1),(0,1,\\tfrac12,-\\tfrac14),(0,0,1,-\\tfrac{31}{10})\\}$, así que $\\dim S=3$.</div>

<h3>Comprobalo escalonando</h3>
<p>Cargá los vectores como filas (sin columna de términos: destildá "matriz ampliada"):</p>
<div data-widget="gaussElim" data-args='{"A":[[1,4,3,-1],[1,0,1,0],[3,3,2,7],[2,6,0,14],[2,3,1,7]],"augmented":false}'></div>
`
},

/* ---------------- 1.6 generadores <-> ecuaciones, suma e intersección ---------------- */
{
id:"cap1-gen-ec",title:"Generadores ↔ ecuaciones · suma e intersección",keywords:["ecuaciones","generadores","suma","intersección","Grassmann","subespacios"],
body:`
<p>Un subespacio de $\\mathbb{K}^n$ se puede describir de dos maneras equivalentes, y conviene saber pasar de una a otra:</p>
<ul>
<li><strong>Por generadores:</strong> $S=\\langle v_1,\\dots,v_s\\rangle$.</li>
<li><strong>Por ecuaciones homogéneas:</strong> $S=\\{x: \\text{ciertas ecuaciones lineales}=0\\}$.</li>
</ul>

<div class="box def"><div class="box-title">De ecuaciones a generadores</div>
$S$ = soluciones de $Ax=0$. Escaloná, identificá <strong>variables libres</strong>, y despejá las dependientes en función de ellas.
Cada variable libre aporta un generador. $\\dim S = n - \\mathrm{rg}(A)$ (teorema de la dimensión).</div>

<div class="box def"><div class="box-title">De generadores a ecuaciones</div>
Planteá $(x_1,\\dots,x_n)=a_1v_1+\\cdots+a_sv_s$ como sistema con incógnitas $a_i$ y datos $x_j$ (matriz con los $v_i$ como columnas, ampliada con la $x$). Escaloná: las filas donde los coeficientes de los $a_i$ se anulan dan las <strong>ecuaciones</strong> que definen $S$ (igualando a $0$ el término en $x$).</div>

<div class="box exam"><div class="box-title">📎 Ejemplo</div>
$S=\\langle(1,0,2,-1),(3,1,0,2)\\rangle$. Triangulando se obtiene
$S=\\{x:\\ -2x_1+6x_2+x_3=0,\\ x_1-5x_2+x_4=0\\}$. (Verificá: ambos generadores anulan las dos ecuaciones.)</div>

<h2>Suma e intersección</h2>
<div class="box def">
$S+T=\\{s+t:s\\in S,\\,t\\in T\\}$ y $S\\cap T=\\{v:v\\in S\\text{ y }v\\in T\\}$. Ambos son subespacios. Truco práctico:
<ul>
<li>Si ambos están por <strong>generadores</strong> ⇒ $S+T$ = unión de generadores (luego sacar base).</li>
<li>Si ambos están por <strong>ecuaciones</strong> ⇒ $S\\cap T$ = unión de ecuaciones.</li>
<li>Si están mezclados, convertí uno al formato del otro.</li>
</ul></div>

<div class="box theo"><div class="box-title">Fórmula de Grassmann</div>
$$\\dim(U+V)=\\dim U+\\dim V-\\dim(U\\cap V).$$
En particular, $U\\oplus V$ (suma directa) ocurre cuando $U\\cap V=\\{0\\}$, y ahí $\\dim(U+V)=\\dim U+\\dim V$.</div>

<div class="ejercicio">
<div class="ej-head">Ejercicio 1.2</div>
$S=\\langle(1,0,-3,1),(2,0,3,-2)\\rangle$ y $T=\\{x: x_1+x_2-x_4=0,\\ x_2+x_3=0\\}\\subset\\mathbb{R}^4$. ¿Es $S\\subseteq T$?
<div class="ej-sol"><p>Como $S$ está por generadores y $T$ por ecuaciones, basta <strong>verificar que cada generador de $S$ cumpla las ecuaciones de $T$</strong>.
Para $(1,0,-3,1)$: $1+0-1=0$ ✔ y $0+(-3)=-3\\ne0$ ✘. Ya falla ⇒ <strong>$S\\not\\subseteq T$</strong>.</p></div>
<button class="toggle-sol">Ver solución</button>
</div>
`
},

/* ---------------- 1.7 producto de matrices y matrices especiales ---------------- */
{
id:"cap1-producto",title:"Producto de matrices y matrices especiales",keywords:["producto","Hadamard","transpuesta","conjugada","inversa","determinante","traza","simétrica","ortogonal","diagonal","triangular"],
body:`
<p>Para $A\\in\\mathbb{K}^{m\\times n}$, $B\\in\\mathbb{K}^{n\\times p}$, el producto $C=AB\\in\\mathbb{K}^{m\\times p}$ tiene entradas</p>
$$c_{ij}=\\sum_{k=1}^n a_{ik}b_{kj}\\quad(\\text{fila } i \\text{ de } A \\text{ por columna } j \\text{ de } B).$$

<div class="box warn"><div class="box-title">No es conmutativo y ≠ Hadamard</div>
En general $AB\\ne BA$, ni siquiera para cuadradas. En numpy, <code>*</code> es producto coordenada a coordenada (Hadamard);
el producto matricial es <code>@</code>. ¡Es asociativo: $A(BC)=(AB)C$!</div>

<h3>Calculá productos, determinantes e inversas</h3>
<div data-widget="matrixOps" data-args='{"A":[[3,5],[2,-9]],"B":[[1,-1],[0,2]]}'></div>

<h2>Transpuesta y conjugada</h2>
<p>$A^T=(a_{ji})$ intercambia filas por columnas. Propiedades: $(A^T)^T=A$ y $\\boxed{(AB)^T=B^TA^T}$.</p>
<div class="box def"><div class="box-title">Traspuesta conjugada $A^{*}$</div>
$A^{*}=\\overline{A^{T}}$ (transponer y conjugar). Si $\\mathbb{K}=\\mathbb{R}$, $A^{*}=A^T$. Cumple $(AB)^{*}=B^{*}A^{*}$ y $(aA+bB)^{*}=\\bar a A^{*}+\\bar b B^{*}$.</div>

<h2>Inversa, determinante, traza</h2>
<ul>
<li><strong>Inversa:</strong> $A\\in\\mathbb{K}^{n\\times n}$ es inversible si existe $B$ con $AB=BA=I$. Entonces $B=A^{-1}$ es única. Si no, $A$ es <em>singular</em>. Se calcula por Gauss-Jordan sobre $(A\\mid I)$.</li>
<li><strong>Determinante:</strong> $\\det(A^T)=\\det A$, $\\det(AB)=\\det A\\det B$, $\\det(kA)=k^n\\det A$. <strong>$\\det A=0\\iff A$ singular.</strong> Intercambiar filas cambia el signo; sumar múltiplos de filas no lo cambia.</li>
<li>Para <strong>triangular</strong> (o diagonal): $\\det = \\prod a_{ii}$ (producto de la diagonal).</li>
<li><strong>Traza:</strong> $\\mathrm{tr}(A)=\\sum a_{ii}$. Lineal y $\\mathrm{tr}(A^T)=\\mathrm{tr}(A)$.</li>
</ul>

<div class="box note"><div class="box-title">Matrices especiales (memorizá)</div>
<table class="tbl">
<tr><th>Nombre</th><th>Condición</th></tr>
<tr><td>Diagonal</td><td>$a_{ij}=0$ si $i\\ne j$</td></tr>
<tr><td>Triangular superior $U$ / inferior $L$</td><td>ceros debajo / arriba de la diagonal</td></tr>
<tr><td>Simétrica</td><td>$A^T=A$</td></tr>
<tr><td>Hermitiana</td><td>$A^{*}=A$</td></tr>
<tr><td>Ortogonal</td><td>$A^TA=AA^T=I$ (entonces $A^{-1}=A^T$)</td></tr>
<tr><td>Unitaria</td><td>$A^{*}A=AA^{*}=I$</td></tr>
</table></div>

<div class="box tip"><div class="box-title">Truco con diagonales</div>
$D\\cdot A$ con $D$ diagonal <strong>escala las filas</strong> de $A$; $A\\cdot D$ <strong>escala las columnas</strong>. Y $D^k$ eleva cada entrada de la diagonal a la $k$.</div>
`
},

/* ---------------- 1.8 multiplicación por bloques ---------------- */
{
id:"cap1-bloques",title:"Multiplicación por bloques",keywords:["bloques","partición","rango 1","combinación lineal","submatrices"],
body:`
<p>Podemos <strong>particionar</strong> una matriz en submatrices (bloques) trazando líneas que van <em>de borde a borde</em>.
Si las particiones son compatibles, el producto se hace "como si los bloques fueran números":</p>
$$\\begin{pmatrix}A_{11}&A_{12}\\\\A_{21}&A_{22}\\end{pmatrix}\\begin{pmatrix}B_{11}&B_{12}\\\\B_{21}&B_{22}\\end{pmatrix}=
\\begin{pmatrix}A_{11}B_{11}+A_{12}B_{21}&A_{11}B_{12}+A_{12}B_{22}\\\\A_{21}B_{11}+A_{22}B_{21}&A_{21}B_{12}+A_{22}B_{22}\\end{pmatrix}.$$

<div class="box warn"><div class="box-title">Condición de compatibilidad</div>
La partición <strong>vertical de $A$</strong> debe coincidir con la <strong>horizontal de $B$</strong>: el número de columnas de $A_{ik}$ debe igualar el número de filas de $B_{kj}$ para que cada $A_{ik}B_{kj}$ tenga sentido.</div>

<h2>Dos lecturas que usaremos sin parar</h2>
<div class="box def"><div class="box-title">1) $Ax$ = combinación lineal de las columnas de $A$</div>
Particionando $A=(A_1\\mid A_2\\mid\\cdots\\mid A_p)$ por columnas y $x$ por filas:
$$Ax = x_1A_1+x_2A_2+\\cdots+x_pA_p.$$
¡Por eso la imagen de $A$ está <em>generada por sus columnas</em>!</div>

<div class="box def"><div class="box-title">2) $AB$ = suma de matrices de rango 1</div>
Particionando $A$ por columnas y $B$ por filas:
$$AB=A_1B_{1\\cdot}+A_2B_{2\\cdot}+\\cdots+A_pB_{p\\cdot},$$
donde cada $A_kB_{k\\cdot}$ (columna por fila) es una matriz de <strong>rango 1</strong>. Esta idea es el corazón de la <strong>SVD</strong> (Cap 7).</div>

<div class="box exam"><div class="box-title">📎 Aplicación: determinantes por bloques</div>
Si $A,B,C$ son cuadradas, $\\det\\begin{pmatrix}A&B\\\\0&C\\end{pmatrix}=\\det(A)\\det(C)$ (triangular por bloques).
Y el producto de dos triangulares inferiores es triangular inferior (se prueba por inducción usando bloques).</div>

<div class="ejercicio">
<div class="ej-head">Ejercicio</div>
Sea $A=(A_1\\mid A_2\\mid A_3)\\in\\mathbb{R}^{3\\times3}$ por columnas. ¿Qué es $A\\,e_2$, con $e_2=(0,1,0)^T$?
<div class="ej-sol">Por la lectura 1: $A\\,e_2=0\\cdot A_1+1\\cdot A_2+0\\cdot A_3 = A_2$, la <strong>segunda columna</strong> de $A$. En general $A e_j$ = columna $j$.</div>
<button class="toggle-sol">Ver solución</button>
</div>
`
},

/* ---------------- 1.9 cambio de base ---------------- */
{
id:"cap1-cambio-base",title:"Cambio de base",keywords:["cambio de base","coordenadas","matriz de cambio","CBE","canónica"],
body:`
<p>Dado $V$ de dimensión $n$ con base $\\mathcal{B}=\\{b_1,\\dots,b_n\\}$, todo $v$ se escribe de forma <strong>única</strong>
$v=a_1b_1+\\cdots+a_nb_n$. Los $(a_1,\\dots,a_n)$ son las <strong>coordenadas de $v$ en $\\mathcal{B}$</strong>, notado $v_{\\mathcal{B}}$.</p>

<div class="box def"><div class="box-title">Matriz de cambio de base</div>
Sea $C_{\\mathcal{B}\\mathcal{E}}$ la matriz que tiene a los vectores de $\\mathcal{B}$ <strong>como columnas</strong> (escritos en la base canónica $\\mathcal{E}$). Entonces:
$$v_{\\mathcal{E}}=C_{\\mathcal{B}\\mathcal{E}}\\,v_{\\mathcal{B}}\\qquad(\\text{de base }\\mathcal{B}\\text{ a canónica}).$$
Como $\\mathcal{B}$ es base, $C_{\\mathcal{B}\\mathcal{E}}$ es <strong>inversible</strong>, y para ir de canónica a $\\mathcal{B}$:
$$v_{\\mathcal{B}}=C_{\\mathcal{E}\\mathcal{B}}\\,v_{\\mathcal{E}},\\qquad C_{\\mathcal{E}\\mathcal{B}}=(C_{\\mathcal{B}\\mathcal{E}})^{-1}.$$</div>

<div class="box exam"><div class="box-title">📎 Ejemplo</div>
$\\mathcal{B}=\\{(1,2,5),(0,1,7),(0,0,-1)\\}$, y $v=(3,-2,1)_{\\mathcal{B}}$.
$$v_{\\mathcal{E}}=\\begin{pmatrix}1&0&0\\\\2&1&0\\\\5&7&-1\\end{pmatrix}\\begin{pmatrix}3\\\\-2\\\\1\\end{pmatrix}=\\begin{pmatrix}3\\\\4\\\\0\\end{pmatrix}.$$
Para el camino inverso, resolvés el sistema (o invertís $C_{\\mathcal{B}\\mathcal{E}}$).</div>

<div class="box tip"><div class="box-title">Receta de examen</div>
<ol><li>Armá $C_{\\mathcal{B}\\mathcal{E}}$ poniendo la base $\\mathcal{B}$ en columnas.</li>
<li>$\\mathcal{B}\\to$ canónica: multiplicá por $C_{\\mathcal{B}\\mathcal{E}}$.</li>
<li>canónica $\\to\\mathcal{B}$: multiplicá por su inversa (o resolvé el sistema, que suele ser más rápido).</li></ol></div>

<div class="ejercicio"><div class="ej-head">Ejercicio 1.6</div>
$\\mathcal{B}=\\{1,(x-1),(x-1)^2\\}$ de $\\mathbb{R}[x]_2$ y $p=(7,-2,1)_{\\mathcal{B}}$. Escribilo en la base canónica $\\{1,x,x^2\\}$.
<div class="ej-sol">$p=7\\cdot1-2(x-1)+(x-1)^2=7-2x+2+(x^2-2x+1)=x^2-4x+10$. O sea $p_{\\mathcal{E}}=(10,-4,1)$.</div>
<button class="toggle-sol">Ver solución</button></div>
`
},

/* ---------------- 1.10 transformaciones lineales ---------------- */
{
id:"cap1-tl",title:"Transformaciones lineales · núcleo e imagen",keywords:["transformación lineal","TL","núcleo","kernel","imagen","teorema de la dimensión","rango nulidad"],
body:`
<p>Una matriz $A\\in\\mathbb{R}^{m\\times n}$ define la función lineal $T_A:\\mathbb{R}^n\\to\\mathbb{R}^m$, $T_A(v)=Av$.</p>

<div class="box def"><div class="box-title">Transformación lineal</div>
$f:V\\to W$ es lineal si $f(v+v')=f(v)+f(v')$ y $f(av)=a\\,f(v)$. El producto por matriz siempre cumple esto.
<p><strong>Consecuencia:</strong> una TL queda determinada por las imágenes de una base. Y las <strong>columnas de $A$ son las imágenes de los $e_i$</strong>.</p></div>

<div class="box warn">Si aparece una constante suelta, no es lineal. Ej.: $f(x_1,x_2)=(3x_1+1,\\,x_2-x_1)$ <strong>no</strong> es lineal (el $+1$ rompe $f(0)=0$).</div>

<div class="box def"><div class="box-title">Imagen y núcleo</div>
$$\\mathrm{Im}(A)=\\{Ax:x\\in\\mathbb{K}^n\\}\\subseteq\\mathbb{K}^m,\\qquad \\ker(A)=\\{x:Ax=0\\}\\subseteq\\mathbb{K}^n.$$
La <strong>imagen está generada por las columnas</strong> de $A$ (¡por la multiplicación por bloques!). El núcleo se obtiene resolviendo $Ax=0$.
Además $\\mathrm{rg}(A)=\\dim\\mathrm{Im}(A)$.</div>

<div class="box theo"><div class="box-title">Teorema de la dimensión (rango–nulidad)</div>
$$n=\\dim\\ker(A)+\\dim\\mathrm{Im}(A).$$
<em>Idea:</em> tomá base $\\{u_1,\\dots,u_t\\}$ del núcleo, extendela a base de $\\mathbb{R}^n$ con $\\{w_1,\\dots,w_{n-t}\\}$; entonces $\\{Aw_1,\\dots,Aw_{n-t}\\}$ es base de la imagen.</div>

<div class="box exam"><div class="box-title">📎 Ejemplo</div>
$A=\\begin{pmatrix}1&0&-2&1\\\\0&2&-1&-2\\\\2&1&1&1\\end{pmatrix}$. Escalonando $A^T$ ⇒ $\\dim\\mathrm{Im}(A)=3$. Escalonando $A$, $\\ker(A)=\\langle(-1,1,0,1)\\rangle$, $\\dim\\ker=1$. Y efectivamente $1+3=4=n$. ✔</div>

<div class="quiz">
<div class="q">Si $A\\in\\mathbb{R}^{3\\times5}$ tiene $\\mathrm{rg}(A)=3$, ¿cuánto vale $\\dim\\ker(A)$?</div>
<button class="opt" data-correct="1" data-exp="$n-\\mathrm{rg}=5-3=2$.">2</button>
<button class="opt" data-exp="Esa sería la dimensión de la imagen.">3</button>
<button class="opt" data-exp="$n=5$ es el espacio de partida, no el núcleo.">5</button>
<div class="feedback"></div>
</div>
`
},

/* ---------------- 1.11 espacios afines ---------------- */
{
id:"cap1-afines",title:"Espacios afines: soluciones de Ax=b",keywords:["afín","solución particular","homogéneo","Ax=b","subespacio corrido"],
body:`
<p>Las soluciones de $Ax=0$ forman un <strong>subespacio</strong>. ¿Y las de $Ax=b$ con $b\\ne0$?</p>

<div class="box theo"><div class="box-title">Estructura de las soluciones</div>
Si $\\tilde x$ es <strong>una</strong> solución de $Ax=b$, entonces el conjunto de <strong>todas</strong> las soluciones es
$$S=\\tilde x+\\ker(A)=\\{\\,\\tilde x+v:\\ Av=0\\,\\}.$$
<em>Idea:</em> si $x,y$ son soluciones, $A(x-y)=b-b=0$, así que $x-y\\in\\ker(A)$.</div>

<p>Es un <strong>subespacio "corrido"</strong> (espacio afín): se obtiene trasladando $\\ker(A)$ por una solución particular. <strong>No</strong> es subespacio (salvo que $b=0$) porque no contiene al $0$.</p>

<div class="box exam"><div class="box-title">📎 Ejemplo</div>
$\\begin{cases}3x+2y+6z=12\\\\x-2y+z=10\\end{cases}$. Una solución particular es $\\tilde x=(3.75,-2.625,1)$ y el núcleo es $\\langle(-0.854,-0.183,0.488)\\rangle$, así que
$$S=(3.75,-2.625,1)+\\langle(-0.854,-0.183,0.488)\\rangle.$$</div>

<div class="box tip"><div class="box-title">Receta</div>
Para describir todas las soluciones de $Ax=b$: (1) hallá <strong>una</strong> solución particular (sustitución hacia atrás), y (2) hallá una base de $\\ker(A)$ resolviendo $Ax=0$. La solución general es "particular + combinaciones del núcleo".</div>

<div class="box note"><div class="box-title">🏁 Cierre del Capítulo 1</div>
Ya tenés el lenguaje: vectores, matrices, sistemas, rango, espacios, bases, transformaciones, núcleo/imagen y la estructura afín de las soluciones.
A partir del Cap 2 entra lo <em>computacional</em>: errores, condición y algoritmos eficientes. ¡Seguí con <a data-goto="cap2-flotante">Números de máquina</a>!</div>
`
}

]
});
