window.ALC_CONTENT=window.ALC_CONTENT||[];
window.ALC_CONTENT.push({
id:"cap2",order:2,title:"2 · Números de máquina y condición",blurb:"Punto flotante, épsilon, errores, cancelación, condición y estabilidad.",
lessons:[

{
id:"cap2-flotante",title:"Representación en punto flotante",keywords:["punto flotante","mantisa","exponente","base","notación científica","doble precisión","bit"],
body:`
<p>La computadora no puede guardar <em>todos</em> los reales: su memoria es finita. Solo representa exactamente los
<strong>números de máquina</strong>. Entender esto explica por qué $0.1+0.1+0.1\\ne0.3$ en la práctica.</p>

<div class="box def"><div class="box-title">Notación científica normalizada</div>
Todo $x\\ne0$ se escribe en base $b$ como
$$ (x)_b=\\mathrm{sg}(x)\\;0.b_0b_1b_2\\dots b_{m}\\cdot b^{\\,e}, \\qquad b_0\\ne0,$$
con <strong>mantisa</strong> $0.b_0b_1\\dots$ (los dígitos significativos) y <strong>exponente</strong> $e$. Así, a ojo, $b^{e}<|x|\\le b^{e+1}$.</div>

<div class="box note"><div class="box-title">Doble precisión (la que usás siempre)</div>
Base $b=2$, $64$ bits: $\\approx 52$ para la mantisa y el resto para exponente y signos. Entonces:
<ul>
<li>Mayor número $\\approx 10^{300}$, menor positivo $\\approx 10^{-300}$ (más allá: <em>overflow</em> / <em>underflow</em>).</li>
<li>La escala (rango de magnitudes) la decide el <strong>exponente</strong>; la <strong>precisión</strong> la decide la mantisa.</li>
</ul>
Agrandar la mantisa NO agranda el rango: solo da más dígitos exactos.</div>

<div class="box warn"><div class="box-title">Los números de máquina NO están equiespaciados</div>
Entre potencias sucesivas de $2$ están equiespaciados, pero el espaciado <strong>crece</strong> con el exponente: $x_2-x_1=b^{e-m}$.
Por eso lo que se mantiene "constante" al redondear no es el error absoluto sino el <strong>error relativo</strong>.</div>

<div class="box tip">Probá en Python: <code>0.1 + 0.2 == 0.3</code> da <code>False</code>. ¡$0.1$ ni siquiera es número de máquina en base 2!</div>
`
},

{
id:"cap2-maquina",title:"Épsilon de máquina y errores",keywords:["epsilon","error relativo","error absoluto","redondeo","truncado","fl","precisión"],
body:`
<p>Si $x$ no es número de máquina, se lo reemplaza por el más cercano: $\\mathrm{fl}(x)$ (redondeo) o el inmediato inferior (truncado).</p>

<div class="box def"><div class="box-title">Errores absoluto y relativo</div>
Si $x_a$ aproxima a $x_v$ (verdadero, $\\ne0$):
$$e_{\\text{abs}}=|x_a-x_v|,\\qquad e_{\\text{rel}}=\\frac{|x_a-x_v|}{|x_v|}.$$
El relativo es el que importa: dice <strong>cuántos dígitos significativos</strong> son correctos. Para vectores/matrices se usa una <strong>norma</strong> (Cap 3).</div>

<div class="box def"><div class="box-title">Épsilon de máquina $\\varepsilon$</div>
Cota del error relativo de almacenar un número:
$$\\left|\\frac{x-\\mathrm{fl}(x)}{x}\\right|\\le \\tfrac12 b^{\\,1-m}=\\varepsilon.$$
En doble precisión, $\\varepsilon\\approx 2^{-52}\\approx 10^{-16}$: la máquina guarda <strong>≈16 dígitos decimales</strong> exactos.
Equivalentemente, $\\varepsilon$ es el menor número de máquina tal que $1\\oplus\\varepsilon>1$.</div>

<p>Escribimos $\\mathrm{fl}(x)=x(1+\\mu_x)$ con $|\\mu_x|\\le\\varepsilon$. Esa es la regla de oro del análisis de errores.</p>

<div class="box exam"><div class="box-title">📎 Calculá $\\varepsilon$ vos</div>
<pre><span class="py-kw">import</span> numpy <span class="py-kw">as</span> np
<span class="py-fn">print</span>(np.finfo(<span class="py-kw">float</span>).eps)   <span class="py-com"># 2.220446049250313e-16</span></pre></div>

<div class="quiz">
<div class="q">$\\varepsilon\\approx10^{-16}$ en doble precisión significa, a grandes rasgos, que…</div>
<button class="opt" data-correct="1" data-exp="El error relativo de almacenar un número está acotado por ε; ≈16 dígitos correctos.">guardamos ~16 dígitos decimales exactos por número</button>
<button class="opt" data-exp="El rango lo da el exponente (~10^±300), no ε.">el número más chico que la máquina maneja es 10⁻¹⁶</button>
<button class="opt" data-exp="ε es relativo, no un espaciado fijo: los números no están equiespaciados.">todos los números de máquina distan 10⁻¹⁶</button>
<div class="feedback"></div>
</div>
`
},

{
id:"cap2-aritmetica",title:"Aritmética de máquina y cancelación catastrófica",keywords:["cancelación","catastrófica","resta","asociatividad","suma","estabilidad","propagación de errores"],
body:`
<p>Cada operación introduce un error relativo $\\le\\varepsilon$. La máquina calcula
$x\\oplus y=\\mathrm{fl}(\\mathrm{fl}(x)+\\mathrm{fl}(y))$.</p>

<div class="box tip"><div class="box-title">Sumar números del mismo signo es seguro</div>
Si $x,y>0$, el error relativo se preserva: $|x\\oplus y-(x+y)|\\le (x+y)\\,2\\mu+O(\\varepsilon^2)$. Los errores se acumulan <strong>aditivamente</strong>: haría falta muchísimas operaciones para arruinar el resultado.</div>

<div class="box warn"><div class="box-title">⚠️ Cancelación catastrófica: restar números parecidos</div>
Con base $10$, $m=4$ (precisión $\\varepsilon=\\tfrac12 10^{-3}$): si $x=125{,}49$ e $y=125{,}31$,
el resultado real $x-y=0.18$, pero la máquina da $x\\ominus y=0.2$. ¡Error relativo del <strong>11%</strong> a pesar de $\\varepsilon\\sim10^{-3}$!
Al restar, los dígitos coincidentes se cancelan y se "promueven" los dígitos basura.</div>

<div class="box note"><div class="box-title">Se pierde la asociatividad</div>
$1\\oplus\\varepsilon>1$ pero $1\\oplus\\varepsilon/2=1$, así que
$$(1\\oplus\\varepsilon/2)\\oplus\\varepsilon/2=1\\ \\ne\\ 1\\oplus(\\varepsilon/2+\\varepsilon/2).$$</div>

<div class="box exam"><div class="box-title">📎 Ejemplo de Cleve Moler: dos algoritmos para $e^{-12}$</div>
<ul>
<li><strong>Serie directa</strong> $e^{-12}=1-12+\\tfrac{12^2}{2!}-\\cdots$: términos grandes que se cancelan ⇒ solo <strong>4 dígitos</strong> correctos.</li>
<li><strong>Calcular $e^{12}$ y luego $1/e^{12}$</strong>: suma de términos positivos ⇒ <strong>14 dígitos</strong> correctos.</li>
</ul>
Mismo resultado matemático, <strong>estabilidad</strong> muy distinta. <strong>Regla:</strong> evitá restar cantidades parecidas; reformulá la cuenta.</div>

<div class="box exam"><div class="box-title">📎 El polinomio de Wilkinson</div>
$p(x)=\\prod_{i=1}^{20}(x-i)$: perturbar el coeficiente de $x^{19}$ en $2^{-23}$ mueve las raíces grandes <em>enormemente</em>
(algunas se vuelven complejas). El <strong>problema</strong> de hallar raíces está mal condicionado, independientemente del algoritmo.</div>
`
},

{
id:"cap2-condicion",title:"Condición y estabilidad",keywords:["condición","número de condición","estabilidad","problema","algoritmo","mal condicionado"],
body:`
<p>Dos conceptos distintos y centrales en todo el análisis numérico:</p>

<div class="box def"><div class="box-title">Condición — propiedad del PROBLEMA</div>
Un problema está <strong>bien condicionado</strong> si pequeños cambios en los datos producen pequeños cambios en la solución.
Si está <strong>mal condicionado</strong>, ni el mejor algoritmo lo salva (salvo precisión infinita). Es algo <em>intrínseco del problema</em>.</div>

<div class="box def"><div class="box-title">Estabilidad — propiedad del ALGORITMO</div>
Un algoritmo es <strong>estable</strong> si no amplifica desproporcionadamente los errores. Un problema bien condicionado resuelto con un algoritmo
estable da buenos resultados; un algoritmo inestable puede arruinar incluso un problema benigno.</div>

<div class="box theo"><div class="box-title">Número de condición de evaluar $f$ en $x_0$</div>
Si perturbamos $x_0$ en $h$, el error relativo de salida sobre el de entrada es, para $h\\to0$,
$$\\frac{|f(x_0+h)-f(x_0)|/|f(x_0)|}{|h|/|x_0|}\\ \\longrightarrow\\ \\frac{|x_0|\\,|f'(x_0)|}{|f(x_0)|}.$$
Ese factor es el <strong>número de condición</strong>. Para $f:\\mathbb{R}^n\\to\\mathbb{R}^m$ se generaliza con $\\dfrac{\\|x_0\\|\\,\\|Df(x_0)\\|}{\\|f(x_0)\\|}$.</div>

<div class="box exam"><div class="box-title">📎 Restar está mal condicionado</div>
$f(x,y)=x-y$ tiene número de condición $\\sim \\dfrac{1}{\\|x_0-y_0\\|}$: ¡explota cuando $x_0\\approx y_0$! Es la versión "de problema" de la cancelación catastrófica.
Otro ejemplo: $\\tan(x)$ cerca de $\\pi/2$ tiene condición $\\to\\infty$.</div>

<div class="box tip"><div class="box-title">Regla práctica</div>
Si el número de condición es $\\sim 10^{k}$, podés esperar <strong>perder $k$ dígitos</strong> significativos. Con $\\kappa\\sim10^{16}$ en doble precisión, podrías no acertar <em>ningún</em> dígito. En el Cap 3 definimos la condición de <strong>matrices</strong>, $\\kappa(A)=\\|A\\|\\,\\|A^{-1}\\|$.</div>
`
}

]
});
