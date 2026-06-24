window.ALC_CONTENT=window.ALC_CONTENT||[];
window.ALC_CONTENT.push({
id:"cap5",order:5,title:"5 · Diagonalización",blurb:"Autovalores/autovectores, diagonalización, Schur, potencia, algoritmo QR, Gershgorin y Markov.",
lessons:[

{
id:"cap5-autovalores",title:"Autovalores y autovectores",keywords:["autovalor","autovector","polinomio característico","det(A-λI)","espectro","eigenvalue"],
body:`
<div class="box def"><div class="box-title">Definición</div>
$\\lambda\\in\\mathbb{C}$ es <strong>autovalor</strong> de $A\\in\\mathbb{K}^{n\\times n}$ si existe $v\\ne0$ (<strong>autovector</strong>) con
$$Av=\\lambda v\\iff (A-\\lambda I)v=0.$$
Hay autovector no nulo $\\iff (A-\\lambda I)$ es singular $\\iff \\det(A-\\lambda I)=0$.</div>

<div class="box def"><div class="box-title">Polinomio característico</div>
$\\chi_A(\\lambda)=\\det(A-\\lambda I)$. Sus raíces son los autovalores. Tiene grado $n$, así que (contando multiplicidad y en $\\mathbb{C}$)
hay <strong>exactamente $n$ autovalores</strong>. El <strong>autoespacio</strong> de $\\lambda$ es $E_\\lambda=\\ker(A-\\lambda I)$.</div>

<div class="box exam"><div class="box-title">📎 Ejemplo</div>
$A=\\begin{pmatrix}2&3\\\\2&1\\end{pmatrix}$: $\\chi_A(\\lambda)=(2-\\lambda)(1-\\lambda)-6=\\lambda^2-3\\lambda-4=(\\lambda-4)(\\lambda+1)$.
Autovalores $\\lambda_1=4,\\ \\lambda_2=-1$. Autovectores: $E_4=\\langle(3,2)\\rangle$, $E_{-1}=\\langle(1,-1)\\rangle$.</div>

<h3>Calculá autovalores y autovectores</h3>
<div data-widget="eigDemo" data-args='{"A":[[2,3],[2,1]]}'></div>

<div class="box note"><div class="box-title">Propiedad útil</div>
$A$ y $A^T$ tienen <strong>los mismos autovalores</strong> (porque $\\det(A-\\lambda I)=\\det((A-\\lambda I)^T)$). ¡Los autovectores en general no coinciden!</div>

<div class="box tip">Por qué importan: para entender $A^k$ (procesos que iteran, como Markov o Fibonacci) conviene una base donde $A$ "actúa escalando". Eso es diagonalizar.</div>
`
},

{
id:"cap5-diagonalizacion",title:"Diagonalización y semejanza",keywords:["diagonalizable","semejante","A=CDC⁻¹","cambio de base","potencias","Fibonacci"],
body:`
<div class="box def"><div class="box-title">Semejanza</div>
$A$ y $B$ son <strong>semejantes</strong> si $B=C^{-1}AC$ para alguna $C$ inversible: son la misma transformación lineal vista en bases distintas.
Matrices semejantes tienen el <strong>mismo polinomio característico</strong> (y por ende mismos autovalores, traza y determinante).</div>

<div class="box theo"><div class="box-title">Diagonalización</div>
Si $A$ tiene una base de autovectores $\\{b_1,\\dots,b_n\\}$ con autovalores $\\lambda_i$, tomando
$$C=(b_1\\mid\\cdots\\mid b_n),\\qquad D=\\mathrm{diag}(\\lambda_1,\\dots,\\lambda_n),$$
se cumple $\\boxed{A=CDC^{-1}}$ y $D=C^{-1}AC$. Decimos que $A$ es <strong>diagonalizable</strong>.</div>

<div class="box tip"><div class="box-title">El superpoder: potencias y funciones</div>
$$A^k=CD^kC^{-1},\\qquad A^{-1}=CD^{-1}C^{-1},\\qquad p(A)=C\\,p(D)\\,C^{-1}.$$
¡Y $D^k$ es elevar cada autovalor a la $k$! Esto resuelve recurrencias y procesos iterados de un saque.</div>

<div class="box exam"><div class="box-title">📎 Fibonacci</div>
$\\begin{pmatrix}a_n\\\\a_{n-1}\\end{pmatrix}=\\begin{pmatrix}1&1\\\\1&0\\end{pmatrix}^{n-2}\\begin{pmatrix}a_2\\\\a_1\\end{pmatrix}$.
Diagonalizando $\\left(\\begin{smallmatrix}1&1\\\\1&0\\end{smallmatrix}\\right)$ (autovalores $\\tfrac{1\\pm\\sqrt5}{2}$) se obtiene la fórmula cerrada de Fibonacci: crece como $\\big(\\tfrac{1+\\sqrt5}{2}\\big)^n$ (¡razón áurea!).</div>

<div class="quiz">
<div class="q">$A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ tiene autovalor doble $\\lambda=1$ con $\\dim E_1=1$. ¿Es diagonalizable?</div>
<button class="opt" data-correct="1" data-exp="Necesitás 2 autovectores L.I.; solo hay un autoespacio de dim 1. Mult. geom. (1) < alg. (2).">No (le falta un autovector)</button>
<button class="opt" data-exp="Tener autovalor repetido no impide diagonalizar; el problema es la falta de autovectores.">Sí, porque es triangular</button>
<button class="opt" data-exp="Sí lo determina: si hay base de autovectores, sí.">No se puede saber sin C</button>
<div class="feedback"></div>
</div>
`
},

{
id:"cap5-multiplicidad",title:"Multiplicidad algebraica y geométrica",keywords:["multiplicidad algebraica","multiplicidad geométrica","criterio","diagonalizable","autovalores distintos","independencia"],
body:`
<div class="box def"><div class="box-title">Las dos multiplicidades</div>
Para un autovalor $\\lambda$ de $A$:
<ul>
<li><strong>Algebraica</strong> $m_a(\\lambda)$: multiplicidad como raíz de $\\chi_A$.</li>
<li><strong>Geométrica</strong> $m_g(\\lambda)=\\dim E_\\lambda=\\dim\\ker(A-\\lambda I)$.</li>
</ul></div>

<div class="box theo"><div class="box-title">Desigualdad fundamental</div>
$$1\\le m_g(\\lambda)\\le m_a(\\lambda).$$
Y la suma de las multiplicidades algebraicas es $n$.</div>

<div class="box theo"><div class="box-title">Criterio de diagonalizabilidad</div>
$A$ es diagonalizable $\\iff$ para <strong>todo</strong> autovalor, $m_g(\\lambda)=m_a(\\lambda)$ $\\iff \\sum_\\lambda \\dim E_\\lambda=n$.
<p><strong>Caso fácil:</strong> si $A$ tiene $n$ autovalores <strong>distintos</strong>, es diagonalizable (cada uno aporta $m_g\\ge1$ y la suma da $n$).</p></div>

<div class="box theo"><div class="box-title">Autovectores de autovalores distintos son L.I.</div>
Si $v_1,\\dots,v_s$ son autovectores con autovalores <strong>distintos</strong> $\\lambda_1,\\dots,\\lambda_s$, entonces $\\{v_1,\\dots,v_s\\}$ es L.I.
<em>Idea:</em> tomá la relación de dependencia más corta y multiplicala por $(A-\\lambda_1 I)$ para obtener una más corta ⇒ absurdo.</div>

<h3>Decidí diagonalizabilidad</h3>
<div data-widget="eigDemo" data-args='{"A":[[-1,3,-1],[-3,5,-1],[-3,3,1]]}'></div>
<p class="hint">Probá también $\\left(\\begin{smallmatrix}1&1&0\\\\0&1&1\\\\0&0&1\\end{smallmatrix}\\right)$: tiene un solo autovalor con pocos autovectores ⇒ no diagonaliza.</p>
`
},

{
id:"cap5-especiales",title:"Matrices especiales y descomposición de Schur",keywords:["Schur","normal","simétrica","hermitiana","ortogonal","unitaria","autovalores reales","base ortonormal","diagonalización ortogonal"],
body:`
<div class="box theo"><div class="box-title">Descomposición de Schur (¡toda matriz!)</div>
Para toda $A\\in\\mathbb{K}^{n\\times n}$ existe $U$ <strong>unitaria</strong> y $T$ <strong>triangular superior</strong> con
$$A=UTU^{*},\\qquad t_{ii}=\\lambda_i.$$
O sea: aunque no toda matriz diagonaliza, <strong>toda matriz es unitariamente semejante a una triangular</strong> con los autovalores en la diagonal. (Se construye paso a paso completando bases ortonormales con Gram-Schmidt.)</div>

<div class="box def"><div class="box-title">Matrices normales</div>
$A$ es <strong>normal</strong> si $AA^{*}=A^{*}A$. Incluye a simétricas, hermitianas, ortogonales y unitarias.</div>

<div class="box theo"><div class="box-title">Teorema espectral</div>
$A$ es <strong>normal</strong> $\\iff$ es <strong>unitariamente diagonalizable</strong>: existe base <strong>ortonormal</strong> de autovectores, $A=UDU^{*}$.
<em>(Idea: en la Schur, una triangular normal debe ser diagonal.)</em></div>

<div class="box note"><div class="box-title">Casos que más se usan</div>
<ul>
<li><strong>Simétrica/Hermitiana</strong> ($A=A^{*}$): autovalores <strong>reales</strong>, base ortonormal de autovectores, y $v^{*}Av\\in\\mathbb{R}$. Autovectores de autovalores distintos son <strong>ortogonales</strong>.</li>
<li><strong>Ortogonal/Unitaria</strong> ($Q^{*}Q=I$): todos los autovalores cumplen $|\\lambda|=1$.</li>
<li><strong>Definida positiva</strong>: simétrica con $\\lambda_i>0$. (Conecta con Cholesky.)</li>
</ul></div>

<div class="box exam"><div class="box-title">📎 Diagonalización ortogonal de una simétrica</div>
$A=\\begin{pmatrix}-4&2&-2\\\\2&-7&4\\\\-2&4&-7\\end{pmatrix}$ tiene $\\lambda_1=-12$ (simple) y $\\lambda_2=-3$ (doble).
Como es simétrica, $E_{-12}\\perp E_{-3}$; solo hay que ortonormalizar <em>dentro</em> de $E_{-3}$ (Gram-Schmidt) para obtener una base ortonormal de autovectores y $A=QDQ^T$.</div>

<div class="box tip">Para simétricas: <strong>siempre</strong> diagonalizables ortogonalmente. Esa es la base teórica de la SVD (Cap 7).</div>
`
},

{
id:"cap5-potencia",title:"El método de la potencia",keywords:["método de la potencia","autovalor dominante","Rayleigh","normalizar","convergencia","power method"],
body:`
<p>¿Cómo aproximar autovalores <em>sin</em> resolver $\\chi_A(\\lambda)=0$? Iterando $v^{(k)}=Av^{(k-1)}$ (normalizando) se converge
al autovalor de <strong>mayor módulo</strong>.</p>

<div class="box def"><div class="box-title">El método</div>
Tomá $v^{(0)}$ cualquiera y
$$v^{(k)}=\\frac{Av^{(k-1)}}{\\|Av^{(k-1)}\\|_2},\\qquad r_k=\\frac{(v^{(k)})^TAv^{(k)}}{(v^{(k)})^Tv^{(k)}}\\ (\\text{cociente de Rayleigh}).$$
$r_k\\to\\lambda_1$ (autovalor dominante). El cociente de Rayleigh es el escalar que mejor aproxima el autovalor dado un autovector.</div>

<div class="box theo"><div class="box-title">Por qué converge</div>
Si $A$ diagonaliza con $|\\lambda_1|>|\\lambda_2|\\ge\\cdots$ y escribís $v^{(0)}=\\sum a_iw_i$ (con $a_1\\ne0$):
$$A^kv^{(0)}=\\lambda_1^k\\Big(a_1w_1+a_2\\big(\\tfrac{\\lambda_2}{\\lambda_1}\\big)^kw_2+\\cdots\\Big)\\to(\\text{dirección }w_1),$$
porque $(\\lambda_i/\\lambda_1)^k\\to0$. La <strong>velocidad</strong> depende de $|\\lambda_2/\\lambda_1|$: cuanto más separados, más rápido.</div>

<h3>Iterá el método de la potencia</h3>
<div data-widget="powerDemo" data-args='{"A":[[2,1],[1,3]]}'></div>

<div class="box warn">Si $\\lambda_1$ no es real positivo (p.ej. complejo), $v^{(k)}$ puede no tener límite (gira), pero $r_k$ igual sirve para estimar $|\\lambda_1|$. Si $a_1=0$ (mala suerte con $v^{(0)}$) el método apunta al segundo autovalor.</div>
`
},

{
id:"cap5-norma2-radio",title:"Norma-2 de matrices y radio espectral",keywords:["radio espectral","rho","norma 2","valores singulares","AtA","convergencia","potencias"],
body:`
<div class="box def"><div class="box-title">Radio espectral</div>
$$\\rho(A)=\\max\\{|\\lambda|:\\lambda\\text{ autovalor de }A\\}.$$
No es una norma, pero $\\rho(A)\\le\\|A\\|$ para <strong>toda</strong> norma subordinada, y de hecho
$$\\rho(A)=\\inf_{\\|\\cdot\\|}\\|A\\|=\\lim_{k\\to\\infty}\\|A^k\\|^{1/k}.$$</div>

<div class="box theo"><div class="box-title">Norma-2</div>
<ul>
<li>Si $A$ es <strong>simétrica</strong>: $\\|A\\|_2=\\rho(A)=\\max|\\lambda|$.</li>
<li>En general: $\\|A\\|_2=\\sqrt{\\rho(A^TA)}=\\sigma_1$ (mayor valor singular). $A^TA$ es simétrica semidefinida positiva, con autovalores $\\ge0$.</li>
</ul></div>

<div class="box theo"><div class="box-title">Criterio de convergencia de potencias (clave para Cap 6)</div>
$$A^k\\to 0\\ (\\text{en cualquier norma})\\iff \\rho(A)<1.$$
Este resultado es <strong>el</strong> que decide si un método iterativo converge: el error se multiplica por la matriz de iteración en cada paso.</div>

<div class="box exam"><div class="box-title">📎</div>
Para $A=\\begin{pmatrix}3&2&2\\\\2&3&-2\\end{pmatrix}$: $AA^T$ (de $2\\times2$) tiene autovalores $25$ y $9$ — equivalentemente $A^TA$ ($3\\times3$) tiene $25,9,0$ — así que $\\sigma_1=5,\\sigma_2=3$ y $\\|A\\|_2=\\sqrt{25}=5$. (Esto es la SVD del Cap 7.)</div>
`
},

{
id:"cap5-qr-algo",title:"El algoritmo QR",keywords:["algoritmo QR","RQ","iteración","triangular","todos los autovalores","Krylov","iteración simultánea"],
body:`
<p>El método de la potencia da <em>un</em> autovalor. El <strong>algoritmo QR</strong> los aproxima <strong>todos</strong> a la vez, y es el que usan los paquetes profesionales (<code>eig</code>).</p>

<div class="box def"><div class="box-title">El algoritmo (sorprendentemente simple)</div>
$A^{(0)}=A$. En cada paso:
$$A^{(k)}=Q^{(k)}R^{(k)}\\ (\\text{factorización QR}),\\qquad A^{(k+1)}=R^{(k)}Q^{(k)}.$$
$A^{(k)}$ <strong>converge a una matriz triangular superior</strong> con los autovalores en la diagonal.</div>

<div class="box theo"><div class="box-title">¿Por qué funciona?</div>
Cada $A^{(k+1)}=(Q^{(k)})^TA^{(k)}Q^{(k)}$ es <strong>semejante</strong> a $A^{(k)}$ (mismos autovalores). Es, en el fondo, una "iteración de potencia simultánea" sobre subespacios anidados: $\\langle v_1\\rangle\\subset\\langle v_1,v_2\\rangle\\subset\\cdots$ convergen a los autoespacios, lo que triangula la matriz. (Para matrices simétricas converge a diagonal y las columnas de $\\prod Q^{(k)}$ dan los autovectores.)</div>

<h3>Ejecutá el algoritmo QR</h3>
<div data-widget="qrAlgoDemo" data-args='{"A":[[4,1,0],[1,3,1],[0,1,2]]}'></div>

<div class="box note">En la práctica se usa con <em>shifts</em> y reducción previa a forma de Hessenberg para acelerar (no entra en detalle en este apunte). Si hay autovalores complejos conjugados, $A^{(k)}$ converge a forma "casi-triangular" con bloques $2\\times2$.</div>
`
},

{
id:"cap5-gershgorin",title:"Círculos de Gershgorin",keywords:["Gershgorin","discos","localizar autovalores","diagonal dominante","radio"],
body:`
<p>Una herramienta para <strong>localizar</strong> autovalores sin calcularlos: cotas con discos en el plano complejo.</p>

<div class="box def"><div class="box-title">Discos de Gershgorin</div>
Para $A\\in\\mathbb{C}^{n\\times n}$, definí en cada fila el radio $R_i=\\sum_{j\\ne i}|a_{ij}|$ y el disco cerrado
$$D(a_{ii},R_i)=\\{z\\in\\mathbb{C}:|z-a_{ii}|\\le R_i\\}.$$</div>

<div class="box theo"><div class="box-title">Teorema de Gershgorin</div>
Todo autovalor de $A$ está en la <strong>unión</strong> de los discos $D(a_{ii},R_i)$.</div>

<h3>Dibujá los discos y los autovalores</h3>
<div data-widget="gershgorinDemo" data-args='{"A":[[5,1,0],[1,0,-1],[0,1,-3]]}'></div>

<div class="box tip"><div class="box-title">Conexión con EDD</div>
Si $A$ es <strong>estrictamente diagonal dominante</strong>, $|a_{ii}|>R_i$: ningún disco toca el $0$ ⇒ $0$ no es autovalor ⇒ <strong>$A$ es inversible</strong>.
¡Es otra demostración de que las EDD son inversibles! Y como $\\det A=\\prod\\lambda_i$, Gershgorin acota dónde pueden estar.</div>
`
},

{
id:"cap5-markov",title:"Procesos y matrices de Markov",keywords:["Markov","estocástica","transición","estado de equilibrio","PageRank","autovalor 1","estacionario"],
body:`
<p>Aplicación estrella de la diagonalización: estados que evolucionan $v^{(k)}=Mv^{(k-1)}=M^kv^{(0)}$. El motor original de <strong>Google PageRank</strong>.</p>

<div class="box def"><div class="box-title">Matriz de Markov (estocástica)</div>
$M\\in\\mathbb{R}^{n\\times n}$ es de Markov si tiene entradas $\\ge0$ y <strong>cada columna suma 1</strong>. La entrada $(i,j)$ es la probabilidad de pasar del estado $j$ al $i$.</div>

<div class="box theo"><div class="box-title">Espectro de una matriz de Markov</div>
<ul>
<li>$\\lambda=1$ <strong>siempre</strong> es autovalor (porque $M^T(1,\\dots,1)^T=(1,\\dots,1)^T$, y $A,A^T$ comparten autovalores).</li>
<li>Todo autovalor cumple $|\\lambda|\\le1$.</li>
<li>Si $\\lambda\\ne1$, su autovector tiene componentes que <strong>suman $0$</strong>.</li>
</ul></div>

<div class="box def"><div class="box-title">Estado de equilibrio</div>
$\\pi$ con $M\\pi=\\pi$ (autovector de autovalor $1$, normalizado a probabilidades). Si $1$ es el <strong>único</strong> autovalor de módulo $1$, entonces
$v^{(k)}\\to v^{(\\infty)}$ para cualquier inicio, y $v^{(\\infty)}$ es el estado de equilibrio.</div>

<h3>Evolucioná un proceso de Markov</h3>
<div data-widget="markovDemo" data-args='{"A":[[0.9,0.15,0.25],[0.075,0.8,0.25],[0.025,0.05,0.5]],"v0":[1000,1000,1000]}'></div>

<div class="box tip"><div class="box-title">Análisis vía diagonalización</div>
Escribí $v^{(0)}=\\sum a_iw_i$. Como $v^{(k)}=\\sum a_i\\lambda_i^kw_i$ y todos los $|\\lambda_i|<1$ salvo $\\lambda_1=1$, sobrevive solo $a_1w_1$:
$$v^{(\\infty)}=a_1w_1\\quad(\\text{proporcional al autovector de }\\lambda=1).$$
<strong>Cierre del Cap 5.</strong> Lo que aprendiste sobre $\\rho(A)$ y potencias es la llave del próximo capítulo: <a data-goto="cap6-idea">métodos iterativos</a>.</div>
`
}

]
});
