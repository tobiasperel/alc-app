window.ALC_CONTENT=window.ALC_CONTENT||[];
window.ALC_CONTENT.push({
id:"cap6",order:6,title:"6 · Métodos iterativos",blurb:"Jacobi, Gauss-Seidel, SOR, método del gradiente y gradiente conjugado.",
lessons:[

{
id:"cap6-idea",title:"Idea general y convergencia",keywords:["iterativo","matriz de iteración","radio espectral","convergencia","ralas","splitting","B+C"],
body:`
<p>Los métodos directos son $O(n^3)$ y producen <em>rellenado</em> en matrices ralas. Los <strong>iterativos</strong> generan una sucesión
$x^{(k)}\\to x$ repitiendo un paso barato ($\\sim n^2$, un producto matriz-vector). Sirven cuando $n$ es enorme y $A$ es rala.</p>

<div class="box def"><div class="box-title">Esquema general (splitting)</div>
Partí $A=B+C$ con $B$ <strong>fácil de invertir</strong>. De $Ax=b$:
$$Bx=-Cx+b\\ \\Rightarrow\\ x=\\underbrace{-B^{-1}C}_{M_I}\\,x+\\underbrace{B^{-1}b}_{\\tilde b}.$$
Iterás $x^{(k+1)}=M_I\\,x^{(k)}+\\tilde b$. $M_I$ es la <strong>matriz de iteración</strong>.</div>

<div class="box theo"><div class="box-title">Teorema de convergencia</div>
El error $e_k=x-x^{(k)}$ cumple $e_{k+1}=M_I e_k=M_I^{k+1}e_0$. Por lo tanto:
$$x^{(k)}\\to x\\ \\text{para todo }x^{(0)}\\iff M_I^k\\to0\\iff \\boxed{\\rho(M_I)<1}.$$
Y la <strong>velocidad</strong>: $\\|e_k\\|\\lesssim C\\,\\rho(M_I)^k$. Cuanto menor el radio espectral, más rápido converge.</div>

<div class="box tip"><div class="box-title">Cómo se mide en la práctica</div>
Se mira el <strong>residuo</strong> $r_k=Ax^{(k)}-b$ (no necesitamos la solución exacta). En escala logarítmica, la pendiente de $\\|r_k\\|$ es $\\log_{10}\\rho(M_I)$. Para bajar el error un factor $10^{-t}$ hacen falta $\\approx t/(-\\log_{10}\\rho)$ iteraciones.</div>

<div class="box note">La discretización de la ecuación del calor $u''=f$ da un sistema <strong>tridiagonal y simétrico</strong>; en 2D/3D, ralo y SDP. Son el caso típico donde brillan los iterativos.</div>
`
},

{
id:"cap6-richardson",title:"Método de Richardson",keywords:["Richardson","omega","óptimo","SDP","condición","radio espectral"],
body:`
<p>El más simple: $B=\\omega^{-1}I$ (múltiplo de la identidad). Entonces la matriz de iteración es</p>
$$M_I=I-\\omega A,\\qquad x^{(k+1)}=x^{(k)}-\\omega\\,(Ax^{(k)}-b).$$

<div class="box theo"><div class="box-title">Convergencia (A simétrica definida positiva)</div>
Con autovalores $0<\\lambda_1\\le\\cdots\\le\\lambda_n$, los de $M_I$ son $1-\\omega\\lambda_i$. Converge $\\iff$
$$0<\\omega<\\frac{2}{\\rho(A)}=\\frac{2}{\\lambda_n}.$$</div>

<div class="box theo"><div class="box-title">$\\omega$ óptimo</div>
$\\rho(M_I)=\\max\\{|1-\\omega\\lambda_1|,|1-\\omega\\lambda_n|\\}$ se minimiza igualando ambos:
$$\\omega_{\\text{opt}}=\\frac{2}{\\lambda_1+\\lambda_n},\\qquad \\rho(M_I)=\\frac{\\lambda_n-\\lambda_1}{\\lambda_n+\\lambda_1}=\\frac{\\kappa(A)-1}{\\kappa(A)+1}.$$
<strong>La convergencia se deteriora cuando $\\kappa(A)$ es grande</strong> ($\\rho\\to1$). Este es el gran tema de los iterativos: el condicionamiento manda.</div>

<div class="box warn">Para el ejemplo del pistón ($\\kappa\\approx2144$), $\\rho(M_I)\\approx0.999$: harían falta $\\sim60000$ iteraciones para ganar 3 dígitos. Por eso Richardson "puro" rara vez se usa: motiva métodos mejores.</div>
`
},

{
id:"cap6-clasicos",title:"Jacobi, Gauss-Seidel y SOR",keywords:["Jacobi","Gauss-Seidel","SOR","relajación","omega","convergencia","tridiagonal","EDD","SPD"],
body:`
<p>Escribí $A=L+D+U$ (estrictamente inferior + diagonal + estrictamente superior). Las elecciones clásicas de $B$:</p>

<table class="tbl">
<tr><th>Método</th><th>$B$</th><th>Matriz de iteración</th></tr>
<tr><td><strong>Jacobi</strong></td><td>$D$</td><td>$M_J=-D^{-1}(L+U)$</td></tr>
<tr><td><strong>Gauss-Seidel</strong></td><td>$L+D$</td><td>$M_{GS}=-(L+D)^{-1}U$</td></tr>
<tr><td><strong>SOR</strong> ($\\omega$)</td><td>$\\tfrac1\\omega D+L$</td><td>$M_\\omega=(D+\\omega L)^{-1}\\big((1-\\omega)D-\\omega U\\big)$</td></tr>
</table>

<div class="box def"><div class="box-title">Sin invertir nada (forma componente a componente)</div>
$$\\text{Jacobi: } x_i^{(k+1)}=\\frac{1}{a_{ii}}\\Big(b_i-\\sum_{j\\ne i}a_{ij}x_j^{(k)}\\Big),$$
$$\\text{Gauss-Seidel: } x_i^{(k+1)}=\\frac{1}{a_{ii}}\\Big(b_i-\\sum_{j<i}a_{ij}x_j^{(k+1)}-\\sum_{j>i}a_{ij}x_j^{(k)}\\Big).$$
GS usa los valores <strong>ya actualizados</strong> (suele converger más rápido, pero no se paraleliza). SOR mezcla: $x^{(k+1)}=(1-\\omega)x^{(k)}+\\omega\\,(\\text{paso GS})$.</div>

<h3>Compará los métodos (y barré ω en SOR)</h3>
<div data-widget="iterDemo" data-args='{"A":[[4,1,0],[1,4,1],[0,1,4]],"b":[1,2,3]}'></div>

<div class="box theo"><div class="box-title">Resultados de convergencia (memorizá)</div>
<ul>
<li>Si $A$ es <strong>EDD</strong> ⇒ Jacobi y Gauss-Seidel convergen.</li>
<li>Si $A$ es <strong>simétrica definida positiva</strong> ⇒ Gauss-Seidel converge.</li>
<li>Si $A$ es <strong>tridiagonal</strong> ⇒ $\\rho(M_{GS})=\\rho(M_J)^2$ (GS es "el doble de rápido").</li>
<li><strong>SOR</strong>: condición <em>necesaria</em> $0<\\omega<2$ (porque $\\det M_\\omega=(1-\\omega)^n$ ⇒ $\\rho\\ge|1-\\omega|$). Con el $\\omega$ óptimo, SOR puede ser muchísimo más rápido que GS.</li>
</ul></div>

<div class="box tip">En el widget, cambiá a SOR y movés $\\omega$: vas a encontrar un valor (cerca de $1.9$ en el ejemplo del pistón) donde $\\rho$ cae a $\\approx0.9$ y la convergencia se dispara.</div>
`
},

{
id:"cap6-gradiente",title:"Método del gradiente (descenso más rápido)",keywords:["gradiente","descenso","minimización","SDP","cuadrática","residuo","línea"],
body:`
<p>Si $A$ es <strong>simétrica definida positiva</strong>, resolver $Ax=b$ equivale a <strong>minimizar</strong> la cuadrática</p>
$$J(z)=\\tfrac12 z^TAz-z^Tb,\\qquad \\nabla J(z)=Az-b.$$

<div class="box theo"><div class="box-title">Equivalencia problema ↔ minimización</div>
$x$ minimiza $J$ $\\iff \\nabla J(x)=0\\iff Ax=b$. (Para SDP el mínimo es único: $J$ es estrictamente convexa.)</div>

<div class="box def"><div class="box-title">Búsqueda por líneas</div>
Dada una dirección $z_i$, el paso óptimo a lo largo de la recta $x_i+t z_i$ es
$$\\lambda_i=\\frac{z_i^T(b-Ax_i)}{z_i^TAz_i}=\\frac{z_i^Tr_i}{z_i^TAz_i},\\qquad r_i=b-Ax_i.$$
El <strong>gradiente / descenso más rápido</strong> toma $z_i=r_i$ (la dirección de mayor decrecimiento):
$$x_{i+1}=x_i+\\frac{r_i^Tr_i}{r_i^TAr_i}\\,r_i.$$</div>

<div class="box warn">Problema: converge <strong>lento</strong> cuando $\\kappa(A)$ es grande (zigzaguea entre las paredes del "valle" alargado de $J$). Cada paso es óptimo en su línea, pero la <em>dirección</em> elegida es pobre. La solución: elegir mejores direcciones ⇒ gradiente conjugado.</div>
`
},

{
id:"cap6-gc",title:"Gradiente conjugado",keywords:["gradiente conjugado","conjugadas","A-ortogonal","Krylov","Chebyshev","convergencia","cota","kappa"],
body:`
<p>La estrella de los iterativos para sistemas SDP grandes y ralos. La idea: minimizar no en una línea sino en subespacios crecientes,
pero <strong>manteniendo el costo de búsqueda por líneas</strong> eligiendo direcciones especiales.</p>

<div class="box def"><div class="box-title">Direcciones conjugadas (A-ortogonales)</div>
Una matriz SDP define el producto interno $\\langle x,y\\rangle_A=x^TAy$ y la norma $\\|x\\|_A=\\sqrt{x^TAx}$.
Direcciones $z_i$ son <strong>conjugadas</strong> si $z_i^TAz_j=0$ ($i\\ne j$). Con ellas, minimizar línea a línea equivale a minimizar en todo el subespacio generado:
$$\\min_{x_i+\\langle z_i\\rangle}J = \\min_{x_0+\\langle z_0,\\dots,z_i\\rangle}J.$$
⇒ el método <strong>termina en a lo sumo $n$ pasos</strong> (en aritmética exacta).</div>

<div class="box def"><div class="box-title">El algoritmo (forma recursiva)</div>
Las direcciones se generan A-ortogonalizando los residuos (¡sin Gram-Schmidt completo!):
$$\\begin{aligned}
&\\lambda_i=\\frac{r_i^Tr_i}{z_i^TAz_i},\\quad x_{i+1}=x_i+\\lambda_i z_i,\\quad r_{i+1}=r_i-\\lambda_i Az_i,\\\\
&z_{i+1}=r_{i+1}+\\frac{r_{i+1}^Tr_{i+1}}{r_i^Tr_i}\\,z_i.
\\end{aligned}$$
Cada paso es <strong>un</strong> producto matriz-vector ($Az_i$): barato y solo guarda unos vectores.</div>

<div class="box theo"><div class="box-title">Subespacios de Krylov y cota de convergencia</div>
Los iterados viven en el espacio de Krylov $\\mathcal{K}_i=\\langle r_0,Ar_0,\\dots,A^{i-1}r_0\\rangle$. Usando aproximación polinomial (polinomios de Chebyshev) se prueba
$$\\|x-x_i\\|_A\\le 2\\left(\\frac{\\sqrt{\\kappa(A)}-1}{\\sqrt{\\kappa(A)}+1}\\right)^{i}\\|x-x_0\\|_A.$$
¡Aparece $\\sqrt{\\kappa}$ en vez de $\\kappa$! Por eso GC es <strong>mucho</strong> más rápido que el gradiente simple. (En el ejemplo del pistón, error $10^{-4}$ en una fracción de segundo.)</div>

<div class="box tip"><div class="box-title">Preacondicionamiento (idea)</div>
Como la velocidad depende de $\\kappa$, se resuelve un sistema equivalente con $\\kappa$ menor (precondicionador $\\approx A^{-1}$ barato). Es la práctica estándar, aunque excede este apunte.</div>

<div class="box note"><div class="box-title">🏁 Cierre del Cap 6</div>
Directos (Cap 4) vs iterativos (Cap 6): los primeros dan la solución exacta en $O(n^3)$; los segundos, una aproximación en pocas iteraciones cuando $A$ es grande, rala y (ojalá) bien condicionada. Seguí con <a data-goto="cap7-motiv">SVD</a>, la factorización más poderosa de todas.</div>
`
}

]
});
