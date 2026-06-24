window.ALC_CONTENT=window.ALC_CONTENT||[];
window.ALC_CONTENT.push({
id:"cap7",order:7,title:"7 · Descomposición en valores singulares",blurb:"SVD: construcción, norma-2, distancia a menor rango, pseudoinversa y compresión.",
lessons:[

{
id:"cap7-motiv",title:"Motivación: más allá de los autovalores",keywords:["SVD","motivación","condición","rectangular","rango","elipse","valores singulares"],
body:`
<p>Los autovalores describen bien a las matrices <em>simétricas</em>, pero fallan para las generales y rectangulares.
La <strong>SVD</strong> es la factorización universal: existe para <em>toda</em> matriz.</p>

<div class="box warn"><div class="box-title">Los autovalores no miden el condicionamiento</div>
$A=\\begin{pmatrix}\\epsilon&0&0\\\\0&\\epsilon&0\\\\0&0&\\epsilon\\end{pmatrix}$ tiene autovalores chicos ($\\epsilon$) pero está <strong>perfectamente condicionada</strong> ($\\kappa=1$).
Y $\\begin{pmatrix}1&1\\\\1&1\\\\1&1+\\epsilon\\end{pmatrix}$ (rectangular) está "casi" en rango 1 si $\\epsilon\\approx0$, algo que ni siquiera tiene autovalores. Necesitamos otra cosa: los <strong>valores singulares</strong>.</p></div>

<div class="box def"><div class="box-title">La intuición geométrica (la elipse)</div>
Toda matriz lleva el <strong>círculo unitario a una elipse</strong> (o elipsoide). Hay dos pares de vectores ortonormales,
$\\{v_1,v_2,\\dots\\}$ (entrada) y $\\{u_1,u_2,\\dots\\}$ (salida), y escalares $\\sigma_1\\ge\\sigma_2\\ge\\cdots\\ge0$ tales que
$$Av_i=\\sigma_i u_i.$$
Los $\\sigma_i$ (longitudes de los semiejes de la elipse) son los <strong>valores singulares</strong>.</div>

<p>Matricialmente, $AV=U\\Sigma$, o sea</p>
$$\\boxed{A=U\\Sigma V^{*}}\\quad U,V\\ \\text{unitarias},\\ \\Sigma\\ \\text{diagonal}\\ (\\ge0).$$
<p>Generaliza la diagonalización de simétricas, pero con <strong>dos bases distintas</strong>: una para el dominio y otra para la imagen.</p>
`
},

{
id:"cap7-construccion",title:"Construcción y existencia de la SVD",keywords:["SVD","construcción","AtA","autovectores","valores singulares","Sigma","U V","existencia"],
body:`
<div class="box def"><div class="box-title">Definición</div>
Dada $A\\in\\mathbb{K}^{m\\times n}$, una <strong>SVD</strong> es $A=U\\Sigma V^{*}$ con $U\\in\\mathbb{K}^{m\\times m}$ y $V\\in\\mathbb{K}^{n\\times n}$
<strong>unitarias</strong>, y $\\Sigma\\in\\mathbb{R}^{m\\times n}$ "diagonal" con $\\sigma_1\\ge\\sigma_2\\ge\\cdots\\ge\\sigma_p\\ge0$ ($p=\\min\\{m,n\\}$). Los $\\sigma_i$ son los <strong>valores singulares</strong>.</div>

<div class="box theo"><div class="box-title">Cómo se construye (¡y se calcula a mano!)</div>
La clave: $A^{*}A$ y $AA^{*}$ son <strong>simétricas semidefinidas positivas</strong> (autovalores $\\ge0$, base ortonormal).
$$A^{*}A=V(\\Sigma^{*}\\Sigma)V^{*},\\qquad AA^{*}=U(\\Sigma\\Sigma^{*})U^{*}.$$
Por lo tanto:
<ol>
<li>Las <strong>columnas de $V$</strong> son autovectores ortonormales de $A^{*}A$.</li>
<li>Los <strong>valores singulares</strong> $\\sigma_i=\\sqrt{\\lambda_i}$ son las raíces de los autovalores (no nulos) de $A^{*}A$, de mayor a menor.</li>
<li>Las <strong>columnas de $U$</strong>: $\\;u_i=\\dfrac{1}{\\sigma_i}A v_i\\;$ (para $\\sigma_i>0$); el resto se completa a base ortonormal.</li>
</ol>
Esto prueba que la SVD <strong>siempre existe</strong>, también para rectangulares.</div>

<h3>Descomponé (mirá la elipse en 2×2)</h3>
<div data-widget="svdDemo" data-args='{"A":[[3,2,2],[2,3,-2]]}'></div>

<div class="box exam"><div class="box-title">📎 Receta de examen</div>
Para $A=\\begin{pmatrix}3&2&2\\\\2&3&-2\\end{pmatrix}$: $A^TA$ tiene autovalores $25,9,0$ ⇒ $\\sigma_1=5,\\sigma_2=3$.
$V$ = autovectores ortonormales de $A^TA$ (3×3); $u_i=\\tfrac1{\\sigma_i}Av_i$ (2 columnas). Verificá $U\\Sigma V^T=A$.</div>
`
},

{
id:"cap7-norma2",title:"Valores singulares, norma-2 y condición",keywords:["valor singular","norma 2","condición","cond2","sigma1","sigman","pseudoinversa"],
body:`
<div class="box theo"><div class="box-title">Norma-2 = mayor valor singular</div>
$$\\|A\\|_2=\\sigma_1(A).$$
<em>Idea:</em> como $U,V$ son isometrías, $\\|Ax\\|_2=\\|\\Sigma V^{*}x\\|_2$, que se maximiza en el primer valor singular. Y si $A$ tiene rango $n$ (columnas L.I.), $\\min_{\\|x\\|=1}\\|Ax\\|_2=\\sigma_n$.</div>

<div class="box theo"><div class="box-title">Condición vía valores singulares</div>
Para $A$ cuadrada inversible:
$$\\kappa_2(A)=\\frac{\\sigma_1}{\\sigma_n}.$$
Para rectangular de rango máximo se define igual con $\\sigma_1/\\sigma_r$, $r=\\min\\{m,n\\}$. Esta es la forma <strong>correcta</strong> de medir el condicionamiento (no el determinante ni los autovalores).</div>

<div class="box note"><div class="box-title">Lo que leen los $\\sigma_i$</div>
<ul>
<li>$\\sigma_i>0$ cuenta el <strong>rango</strong> de $A$ (cantidad de valores singulares no nulos).</li>
<li>$\\mathrm{Im}(A)=\\langle u_1,\\dots,u_r\\rangle$, $\\ker(A)=\\langle v_{r+1},\\dots,v_n\\rangle$.</li>
<li>$\\|A\\|_F=\\sqrt{\\sigma_1^2+\\cdots+\\sigma_r^2}$.</li>
</ul></div>

<div class="quiz">
<div class="q">$A$ es $4\\times4$ con valores singulares $10,\\,8,\\,0.01,\\,0$. ¿Qué podés afirmar?</div>
<button class="opt" data-correct="1" data-exp="Hay un σ=0 ⇒ rango 3 ⇒ singular. Y σ₁/σ₃=10/0.01=1000 entre los no nulos: mal condicionada en su rango.">$A$ es singular (rango 3)</button>
<button class="opt" data-exp="κ usa el menor σ no nulo; pero igualmente hay σ=0 ⇒ singular.">$\\kappa_2(A)=10/8=1.25$</button>
<button class="opt" data-exp="Los σ son ≥0 siempre; estos son válidos.">los valores singulares están mal (no pueden ser 0)</button>
<div class="feedback"></div>
</div>
`
},

{
id:"cap7-rango",title:"Distancia a matrices de menor rango",keywords:["Eckart-Young","mejor aproximación","rango k","truncar SVD","menor rango","Frobenius"],
body:`
<p>La SVD responde: ¿cuál es la matriz de rango $\\le k$ <strong>más cercana</strong> a $A$? Se obtiene <strong>truncando</strong> la SVD.</p>

<div class="box theo"><div class="box-title">Teorema de Eckart–Young</div>
Si $A=U\\Sigma V^{*}$ tiene rango $r$, la mejor aproximación de rango $k<r$ (en norma-2 y en Frobenius) es
$$A_k=U\\Sigma_k V^{*}=\\sum_{i=1}^{k}\\sigma_i\\,u_iv_i^{*},$$
quedándote con los $k$ valores singulares más grandes. El error que cometés es exactamente
$$\\|A-A_k\\|_2=\\sigma_{k+1}.$$</div>

<div class="box def"><div class="box-title">Matriz singular más cercana</div>
Para $A$ inversible, la matriz <strong>singular</strong> más cercana es $A_{n-1}$ (anular $\\sigma_n$), a distancia $\\sigma_n=\\dfrac{\\|A\\|_2}{\\kappa_2(A)}$.
Esto re-deriva: $\\dfrac{1}{\\kappa_2(A)}=\\dfrac{\\text{distancia a singulares}}{\\|A\\|_2}$.</div>

<div class="box tip"><div class="box-title">La idea de "suma de rango 1"</div>
$A=\\sum_i\\sigma_i u_iv_i^{*}$: $A$ es una <strong>suma de matrices de rango 1</strong>, ordenadas por importancia ($\\sigma_i$ decreciente). Quedarte con las primeras es quedarte con "lo esencial". Es la versión rigurosa de la multiplicación por bloques (columna×fila) del Cap 1.</div>

<div class="ejercicio"><div class="ej-head">Ejercicio</div>
Si $A$ tiene $\\sigma=(12,7,0.3,0.05)$, ¿cuál es el error (norma-2) de la mejor aproximación de rango 2?
<div class="ej-sol">$\\|A-A_2\\|_2=\\sigma_3=0.3$. Quedan fuera $\\sigma_3,\\sigma_4$, pero la norma-2 del error es el mayor descartado, $\\sigma_3$.</div>
<button class="toggle-sol">Ver solución</button></div>
`
},

{
id:"cap7-aplicaciones",title:"Aplicaciones: pseudoinversa y compresión",keywords:["pseudoinversa","Moore-Penrose","compresión","reducción de dimensionalidad","SVD","mínima norma"],
body:`
<div class="box def"><div class="box-title">Pseudoinversa de Moore–Penrose</div>
A partir de $A=U\\Sigma V^{*}$:
$$A^{\\dagger}=V\\Sigma^{\\dagger}U^{*},$$
donde $\\Sigma^{\\dagger}$ se obtiene transponiendo $\\Sigma$ e invirtiendo los valores singulares no nulos ($\\sigma_i\\to1/\\sigma_i$).
Generaliza la inversa: si $A$ es inversible, $A^{\\dagger}=A^{-1}$.</div>

<div class="box theo"><div class="box-title">Resuelve cualquier sistema</div>
Para $Ax=b$: $\\;z=A^{\\dagger}b\\;$ es
<ul>
<li>una <strong>solución</strong> si el sistema es compatible (y de <strong>mínima norma-2</strong> si hay infinitas);</li>
<li>la solución de <strong>cuadrados mínimos</strong> si es incompatible (Cap 8).</li>
</ul>
El sistema tiene solución $\\iff AA^{\\dagger}b=b$. Cumple $AA^{\\dagger}A=A$ y $A^{\\dagger}AA^{\\dagger}=A^{\\dagger}$.</div>

<h3>🖼️ Compresión de imágenes por SVD</h3>
<div data-widget="svdCompress"></div>

<div class="box note"><div class="box-title">Reducción de dimensionalidad</div>
Con $m$ individuos y $n$ variables ($A\\in\\mathbb{R}^{m\\times n}$), los valores singulares dicen <strong>cuánta información</strong> aporta cada "dirección".
Quedándote con los $k$ mayores reducís variables perdiendo poco (es la base de PCA). En una imagen, con pocos $\\sigma_i$ ya se reconstruye casi todo: ¡compresión!</div>

<div class="box tip"><div class="box-title">🏁 Cierre del Cap 7</div>
La SVD unifica rango, norma-2, condición, mejor aproximación de bajo rango y pseudoinversa. Su aplicación directa al ajuste de datos es el último capítulo: <a data-goto="cap8-normales">cuadrados mínimos</a>.</div>
`
}

]
});
