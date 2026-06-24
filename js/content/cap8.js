window.ALC_CONTENT=window.ALC_CONTENT||[];
window.ALC_CONTENT.push({
id:"cap8",order:8,title:"8 · Cuadrados mínimos",blurb:"Ecuaciones normales, resolución por QR y SVD, interpolación y Vandermonde.",
lessons:[

{
id:"cap8-normales",title:"Planteo y ecuaciones normales",keywords:["cuadrados mínimos","ecuaciones normales","AtA","residuo","sobredeterminado","ajuste","proyección"],
body:`
<p>¿Y si $Ax=b$ <strong>no tiene solución</strong> (sistema sobredeterminado, $m>n$, datos con ruido)? Buscamos el $x$ que haga
el <strong>residuo</strong> $r=b-Ax$ lo más chico posible en norma-2:</p>
$$\\min_{x\\in\\mathbb{R}^n}\\|Ax-b\\|_2^2.$$

<div class="box def"><div class="box-title">Por qué la norma-2: proyección ortogonal</div>
$Ax$ recorre $\\mathrm{Im}(A)=\\langle a_1,\\dots,a_n\\rangle$. El punto de ese subespacio más cercano a $b$ es la <strong>proyección ortogonal</strong> $P_{\\mathrm{Im}(A)}b$.
La condición de mínimo es que el residuo sea <strong>ortogonal a las columnas</strong> de $A$: $\\;A^T(Ax-b)=0$.</div>

<div class="box theo"><div class="box-title">Ecuaciones normales</div>
$$\\boxed{A^TA\\,x=A^Tb}.$$
<p>Si las <strong>columnas de $A$ son L.I.</strong>, entonces $A^TA$ es <strong>simétrica definida positiva</strong> (inversible), la solución es <strong>única</strong>
y se puede resolver con <strong>Cholesky</strong> (costo $\\sim mn^2+\\tfrac13 n^3$).</p></div>

<h3>Ajustá datos (cambiá el grado del polinomio)</h3>
<div data-widget="lsqDemo"></div>

<div class="box exam"><div class="box-title">📎 Recta de cuadrados mínimos ($n=1$)</div>
Ajustar $y\\approx a_0+a_1x$ a puntos $(x_i,y_i)$: las ecuaciones normales son
$$\\begin{pmatrix}m & \\sum x_i\\\\ \\sum x_i & \\sum x_i^2\\end{pmatrix}\\begin{pmatrix}a_0\\\\a_1\\end{pmatrix}=\\begin{pmatrix}\\sum y_i\\\\ \\sum x_iy_i\\end{pmatrix}.$$
Es la fórmula de regresión lineal de toda la vida.</div>

<div class="box warn"><div class="box-title">El problema de las ecuaciones normales</div>
$\\kappa_2(A^TA)=\\kappa_2(A)^2$: ¡el condicionamiento <strong>empeora al cuadrado</strong>! Por eso, aunque sean populares, no siempre son la mejor vía numérica.</div>
`
},

{
id:"cap8-qr-svd",title:"Resolución por QR y por SVD",keywords:["QR","cuadrados mínimos","SVD","pseudoinversa","mínima norma","Tikhonov","regularización","estable"],
body:`
<p>Dos formas <strong>más estables</strong> que las ecuaciones normales para resolver $\\min\\|Ax-b\\|_2$.</p>

<div class="box theo"><div class="box-title">Vía QR (columnas L.I.)</div>
Con $A=QR$ ($Q^TQ=I$, $R$ triangular), como $\\mathrm{Im}(A)=\\mathrm{Im}(Q)$, la proyección es $P b=QQ^Tb$ y
$$QRx=QQ^Tb\\ \\Rightarrow\\ \\boxed{Rx=Q^Tb}\\ (\\text{sistema triangular}).$$
Es <strong>más estable</strong> que las normales (no eleva $\\kappa$ al cuadrado). Costo (Householder) $\\sim 2mn^2-\\tfrac23 n^3$.</div>

<div class="box theo"><div class="box-title">Vía SVD (caso general, incluso rango deficiente)</div>
Con $A=U\\Sigma V^{*}$ de rango $r$, la solución de cuadrados mínimos de <strong>mínima norma</strong> es
$$x=A^{\\dagger}b=\\sum_{i=1}^{r}\\frac{u_i^{T}b}{\\sigma_i}\\,v_i.$$
Si $r=n$ (rango máximo), la pseudoinversa "funciona como inversa" y recupera la solución única. Si $r<n$, da la de mínima norma-2 (porque agrega solo componentes en el complemento del núcleo).</div>

<div class="box note"><div class="box-title">Todas las soluciones</div>
Si el sistema de cuadrados mínimos tiene infinitas soluciones, todas son
$$x=A^{\\dagger}b+(I-A^{\\dagger}A)y,\\qquad y\\in\\mathbb{K}^n,$$
y $A^{\\dagger}b$ es la única de <strong>norma mínima</strong>.</div>

<div class="box tip"><div class="box-title">Regularización de Tikhonov (idea)</div>
Si $A$ es de rango deficiente o muy mal condicionada, se minimiza $\\|Ax-b\\|^2+\\alpha^2\\|x\\|^2$, cuya solución es
$x_\\alpha=(A^TA+\\alpha^2 I)^{-1}A^Tb$. Cuando $\\alpha\\to0$, $x_\\alpha\\to A^{\\dagger}b$. El término $\\alpha^2\\|x\\|^2$ <strong>penaliza</strong> soluciones grandes y estabiliza el cómputo.</div>

<table class="tbl">
<tr><th>Método</th><th>Cuándo</th><th>Estabilidad</th></tr>
<tr><td>Ecuaciones normales + Cholesky</td><td>columnas L.I., bien condicionado</td><td>$\\kappa^2$ (peor)</td></tr>
<tr><td>QR</td><td>columnas L.I.</td><td>buena</td></tr>
<tr><td>SVD / pseudoinversa</td><td>cualquier caso (rango deficiente)</td><td>la mejor</td></tr>
</table>
`
},

{
id:"cap8-interp",title:"Interpolación polinomial y Vandermonde",keywords:["interpolación","Vandermonde","Lagrange","Runge","polinomio","determinante","mínimos cuadrados"],
body:`
<p>Caso clásico: dados $n+1$ puntos con $x_i$ distintos, hallar el polinomio $p_n$ de grado $\\le n$ con $p_n(x_i)=y_i$.</p>

<div class="box def"><div class="box-title">Sistema de Vandermonde</div>
Proponiendo $p_n(x)=a_0+a_1x+\\cdots+a_nx^n$ e imponiendo $p_n(x_i)=y_i$:
$$\\underbrace{\\begin{pmatrix}1&x_0&\\cdots&x_0^n\\\\1&x_1&\\cdots&x_1^n\\\\\\vdots&&&\\vdots\\\\1&x_n&\\cdots&x_n^n\\end{pmatrix}}_{V}\\begin{pmatrix}a_0\\\\\\vdots\\\\a_n\\end{pmatrix}=\\begin{pmatrix}y_0\\\\\\vdots\\\\y_n\\end{pmatrix}.$$
El determinante es $\\det V=\\prod_{0\\le i<j\\le n}(x_j-x_i)\\ne0$ si los $x_i$ son distintos ⇒ el polinomio interpolante <strong>existe y es único</strong>.</div>

<div class="box note"><div class="box-title">Forma de Lagrange</div>
$$p_n(x)=\\sum_{i=0}^n y_i L_i(x),\\qquad L_i(x)=\\prod_{j\\ne i}\\frac{x-x_j}{x_i-x_j},\\qquad L_i(x_j)=\\delta_{ij}.$$
Da directamente el polinomio sin resolver el sistema.</div>

<div class="box warn"><div class="box-title">⚠️ Fenómeno de Runge</div>
Interpolar con muchos puntos <strong>equiespaciados</strong> puede oscilar terriblemente en los bordes (Vandermonde se vuelve mal condicionada).
Solución: usar menos grado y <strong>ajustar por cuadrados mínimos</strong> (Vandermonde rectangular, $m>n$), o usar nodos de Chebyshev.</div>

<div class="box def"><div class="box-title">Conexión con todo el curso</div>
La matriz de Vandermonde <strong>rectangular</strong> ($m+1$ puntos, grado $n<m$) tiene columnas L.I. (sus primeras $n+1$ filas forman una Vandermonde cuadrada inversible), así que el ajuste por cuadrados mínimos tiene solución única. Lo resolvés con las ecuaciones normales, QR o SVD: ¡todo el capítulo junto!</div>

<h3>Probalo: subí el grado y mirá el sobreajuste</h3>
<div data-widget="lsqDemo" data-args='{"points":[[-1,-0.9],[-0.6,-0.1],[-0.2,0.6],[0.2,0.55],[0.6,0.2],[1,1.1]]}'></div>

<div class="box tip"><div class="box-title">🎓 ¡Terminaste el recorrido!</div>
Recorriste desde vectores y sistemas hasta SVD y cuadrados mínimos. Repasá con la <strong>búsqueda</strong> los temas que te cuesten, y usá las demos para auto-evaluarte resolviendo a mano y verificando. ¡Mucha suerte en el final! 🍀</div>
`
}

]
});
