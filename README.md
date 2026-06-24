# Álgebra Lineal Computacional — Curso interactivo

App didáctica para preparar el final de **ALC (UBA, Exactas)**. Recorre la materia
tema por tema (siguiendo las notas de Acosta–Laplagne) con teoría, ejemplos resueltos,
ejercicios y **demos que calculan en vivo**.

## Cómo abrirla

**Doble clic en `index.html`** (se abre en tu navegador). No necesita instalar nada
ni levantar un servidor, y funciona **100% offline** (KaTeX viene incluido en `vendor/`).

> Si las fórmulas no se ven, abrí con Chrome/Firefox y verificá que la carpeta `vendor/`
> esté junto a `index.html`.

## Contenido (8 capítulos + intro)

0. Introducción y notación (complejos, convenciones)
1. Nociones básicas — vectores, matrices, sistemas, espacios, bases, cambio de base, transformaciones lineales, espacios afines
2. Números de máquina — punto flotante, épsilon, errores, cancelación, condición y estabilidad
3. Normas y producto interno — normas p, Cauchy-Schwarz, ortogonalidad, proyecciones, condición de matrices
4. Métodos directos — LU, PA=LU (pivoteo), Cholesky, QR
5. Diagonalización — autovalores, Schur, multiplicidades, método de la potencia, algoritmo QR, Gershgorin, Markov
6. Métodos iterativos — Jacobi, Gauss-Seidel, SOR, gradiente, gradiente conjugado
7. SVD — construcción, norma-2, Eckart-Young, pseudoinversa, compresión
8. Cuadrados mínimos — ecuaciones normales, QR, SVD, interpolación y Vandermonde

## Demos interactivas

Eliminación gaussiana paso a paso · calculadora matricial · LU/PLU · Cholesky · QR ·
bolas unitarias de normas · número de condición · método de la potencia · algoritmo QR ·
círculos de Gershgorin · proceso de Markov · Jacobi/Gauss-Seidel/SOR · SVD + elipse ·
compresión de imágenes por SVD · cuadrados mínimos (ajuste) · autovalores · proyección ortogonal.

## Estructura

```
index.html              # punto de entrada
css/style.css           # estilos (tema claro/oscuro)
js/linalg.js            # motor de cálculo (matmul, LU, QR, eig, SVD, iterativos, normas...)
js/widgets.js           # demos interactivas
js/app.js               # navegación, router, progreso (localStorage), búsqueda
js/content/cap0..8.js   # contenido de cada capítulo
vendor/katex/           # KaTeX local (render de fórmulas, offline)
```

## Tips de uso

- Avanzá con **Siguiente →** (o flechas ← → del teclado).
- **"Marcar como visto"** guarda tu progreso en este dispositivo.
- Usá el **buscador** para saltar a cualquier definición o método.
- Botón 🌙 / ☀️ para tema oscuro/claro.
- En las demos: cambiá las matrices y mirá cómo cambian las cuentas. Resolvé un ejercicio
  a mano y **verificá** con el widget.
