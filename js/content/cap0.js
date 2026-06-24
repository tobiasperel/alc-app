window.ALC_CONTENT=window.ALC_CONTENT||[];
window.ALC_CONTENT.push({
id:"cap0",order:0,title:"Introducción",blurb:"Cómo usar la app y notación.",
lessons:[
{
id:"intro-mapa",title:"Cómo usar este curso",keywords:["intro","mapa","final","estudiar"],
body:`
<div class="box tip"><div class="box-title">🎯 Objetivo</div>
Esta app cubre <strong>toda la materia Álgebra Lineal Computacional</strong> (UBA, Exactas) siguiendo las notas de
Acosta–Laplagne. Está pensada para preparar el final: cada tema arranca de cero, con intuición, definiciones formales,
ejemplos resueltos y <strong>demos que calculan en vivo</strong>.</div>

<h2>Recomendación de recorrido</h2>
<p>Los capítulos son <strong>incrementales</strong>: cada uno usa lo anterior. El camino natural es:</p>
<ol>
<li><strong>Cap 1 — Nociones básicas:</strong> el lenguaje (vectores, matrices, sistemas, espacios, transformaciones). Si venís de Álgebra Lineal, repasalo rápido.</li>
<li><strong>Cap 2 — Números de máquina:</strong> por qué la computadora "miente" y qué es la condición/estabilidad.</li>
<li><strong>Cap 3 — Normas y producto interno:</strong> cómo medir errores, ángulos y ortogonalidad.</li>
<li><strong>Cap 4 — Métodos directos:</strong> LU, PLU, Cholesky, QR (resolver $Ax=b$ exacto).</li>
<li><strong>Cap 5 — Diagonalización:</strong> autovalores, Schur, potencia, algoritmo QR, Markov.</li>
<li><strong>Cap 6 — Métodos iterativos:</strong> Jacobi, Gauss-Seidel, SOR, gradiente conjugado.</li>
<li><strong>Cap 7 — SVD</strong> y <strong>Cap 8 — Cuadrados mínimos:</strong> la corona de la materia.</li>
</ol>

<div class="box note"><div class="box-title">🧩 Cómo aprovechar las demos</div>
En las cajas con borde verás <em>widgets interactivos</em>. Por ejemplo, cargá una matriz y mirá su factorización paso a paso.
<strong>Cambiá los números</strong> y observá qué pasa: es la mejor forma de fijar la intuición antes del examen.</div>

<div class="box tip"><div class="box-title">✅ Tu progreso</div>
El botón <em>"Marcar como visto"</em> (abajo de cada lección) guarda tu avance en este dispositivo. La barra de arriba
muestra el % del curso completado. Usá las flechas ← → del teclado para navegar.</div>

<h2>Qué se suele evaluar</h2>
<ul>
<li>Resolver y <strong>clasificar</strong> sistemas; bases, dimensión, núcleo e imagen.</li>
<li>Hacer factorizaciones <strong>a mano</strong> (LU, PLU, Cholesky, QR) y saber sus hipótesis.</li>
<li>Calcular <strong>autovalores/autovectores</strong>, diagonalizar, decidir diagonalizabilidad.</li>
<li>Analizar <strong>convergencia</strong> de métodos iterativos (radio espectral, EDD, SPD).</li>
<li><strong>SVD</strong>, pseudoinversa y <strong>cuadrados mínimos</strong> (ecuaciones normales).</li>
<li>Conceptos: <strong>condición, estabilidad, error relativo</strong>, costo computacional.</li>
</ul>
`
},
{
id:"intro-notacion",title:"Notación y repaso de complejos",keywords:["notación","complejos","cuerpo","K","módulo","conjugado"],
body:`
<p>En la materia se trabaja sobre un <strong>cuerpo</strong> $\\mathbb{K}$, que será $\\mathbb{R}$ o $\\mathbb{C}$.
Casi todo vale igual en ambos; cuando importe la diferencia, se aclara.</p>

<div class="box def"><div class="box-title">Convenciones de notación</div>
<ul>
<li>Letras <strong>mayúsculas</strong> $A,B,Q$ para matrices; <strong>minúsculas</strong> $v,x,b$ para vectores.</li>
<li>Los vectores de $\\mathbb{K}^n$ se identifican con <strong>matrices columna</strong> $n\\times1$. Así tiene sentido $Av$.</li>
<li>$|v|$ es el vector con las componentes en valor absoluto (ídem $|A|$).</li>
<li>Desigualdades entre vectores/matrices se leen <strong>componente a componente</strong>.</li>
<li>Notación de rangos al estilo Matlab: $v(2:5)$ son las componentes 2 a 5; $A(2:10,\\,7:25)$ un bloque.</li>
<li>Índices: el texto usa base 1 (matemático); Python usa base 0.</li>
</ul></div>

<h2>Complejos: lo que vas a necesitar</h2>
<div class="box note">
<ul>
<li>$i^2=-1$.</li>
<li>Conjugado: si $z=a+ib$ entonces $\\bar z=a-ib$. Vale $\\overline{zw}=\\bar z\\,\\bar w$.</li>
<li>Módulo: $|z|=\\sqrt{a^2+b^2}$ (distancia al origen) y $|zw|=|z||w|$.</li>
<li>$|z|^2=z\\bar z$. Si $z\\ne0$, $z^{-1}=\\dfrac{\\bar z}{|z|^2}$.</li>
<li>$e^{i\\theta}=\\cos\\theta+i\\,\\mathrm{sen}\\,\\theta$, con $|e^{i\\theta}|=1$. Todo $z\\ne0$ se escribe $z=|z|e^{i\\theta}$.</li>
<li><strong>Teorema fundamental del álgebra:</strong> todo polinomio de grado $n\\ge1$ a coeficientes en $\\mathbb{C}$ tiene exactamente $n$ raíces (con multiplicidad) en $\\mathbb{C}$.</li>
</ul></div>

<div class="box tip"><div class="box-title">¿Por qué importan los complejos acá?</div>
Porque los <strong>autovalores</strong> de una matriz real pueden ser complejos (son raíces de un polinomio).
Y para conjugar+transponer matrices usaremos $A^{*}=\\overline{A^{\\,T}}$ (la <em>traspuesta conjugada</em>), que generaliza a la traspuesta.</div>

<div class="quiz" data-exp="">
<div class="q">Si $z = 3 - 4i$, ¿cuánto vale $|z|$?</div>
<button class="opt" data-correct="1" data-exp="$|z|=\\sqrt{3^2+(-4)^2}=\\sqrt{25}=5$.">5</button>
<button class="opt" data-exp="Ese sería $a+b$, no el módulo.">-1</button>
<button class="opt" data-exp="$|z|=\\sqrt{a^2+b^2}$, no $a^2+b^2$.">25</button>
<div class="feedback"></div>
</div>
`
}
]
});
