---
title: "Die Mandelbrot-Menge"
permalink: /mandelbrot/
classes: wide
header:
  overlay_color: "#000"
  overlay_filter: "0.5"
  overlay_image: /assets/images/background.jpg
excerpt: "Eine Reise in die faszinierende Welt der Fraktale"
mathjax: true
---

Die Mandelbrot-Menge ist eines der bekanntesten mathematischen Objekte und ein faszinierendes Beispiel für die Schönheit der Mathematik.

## Mathematische Definition

Die Mandelbrot-Menge $$\mathscr{M}$$ ist definiert als die Menge aller komplexen Zahlen $$c \in \mathbb{C}$$, für die die Folge

$$z_{n+1} = z_n^2 + c, \quad z_0 = 0$$

beschränkt bleibt. Genauer gesagt:

$$\mathscr{M} = \{c \in \mathbb{C} : \limsup_{n \to \infty} \lvert z_n \rvert \leq 2\}$$

wobei $$\lvert z_n \rvert$$ der Betrag der komplexen Zahl $$z_n$$ ist.

## Eigenschaften

1. **Zusammenhängend**: Die Mandelbrot-Menge ist zusammenhängend, was 1982 von Adrien Douady und John H. Hubbard bewiesen wurde.
2. **Selbstähnlichkeit**: An den Rändern der Menge finden sich immer wieder ähnliche Strukturen.
3. **Fraktale Dimension**: Die Hausdorff-Dimension der Randkurve beträgt etwa 2.

## Interaktive Julia-Menge

Die Julia-Menge ist eng mit der Mandelbrot-Menge verwandt. Während die Mandelbrot-Menge alle komplexen Zahlen $c$ enthält, für die die Folge $z_{n+1} = z_n^2 + c$ mit $z_0 = 0$ beschränkt bleibt, wird bei der Julia-Menge ein fester Wert für $c$ gewählt und die Menge aller Startpunkte $z_0$ betrachtet, für die die Folge beschränkt bleibt.

<div class="notice--info" markdown="1">
Experimentieren Sie mit verschiedenen Parametern und erkunden Sie die faszinierende Welt der Julia-Mengen:

{% include julia-interactive.html %}
</div>

### Zusammenhang zwischen Mandelbrot- und Julia-Mengen

Für jeden Punkt $c$ in der Mandelbrot-Menge ist die entsprechende Julia-Menge zusammenhängend. Für Punkte außerhalb der Mandelbrot-Menge zerfällt die Julia-Menge in unendlich viele isolierte Punkte (Staubmenge).

Die interessantesten Julia-Mengen entstehen für Werte von $c$, die nahe am Rand der Mandelbrot-Menge liegen.

<div class="notice--info" markdown="1">
### Interaktiver Mandelbrot-Julia-Explorer

Entdecken Sie den Zusammenhang zwischen der Mandelbrot-Menge und den Julia-Mengen mit diesem interaktiven Explorer. Klicken Sie auf einen Punkt in der Mandelbrot-Menge, um die entsprechende Julia-Menge zu sehen:

{% include mandelbrot-julia-explorer.html %}
</div>

## Programmierung der Mandelbrot-Menge

Hier ist ein Python-Beispiel zur Berechnung und Visualisierung der Mandelbrot-Menge:

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

def mandelbrot(h, w, max_iter):
    y, x = np.ogrid[-1.4:1.4:h*1j, -2:0.8:w*1j]
    c = x + y*1j
    z = c
    divtime = max_iter + np.zeros(z.shape, dtype=int)

    for i in range(max_iter):
        z = z**2 + c
        diverge = z*np.conj(z) > 2**2
        div_now = diverge & (divtime == max_iter)
        divtime[div_now] = i
        z[diverge] = 2

    return divtime

# Erstelle eine hochauflösende Visualisierung
plt.figure(figsize=(12, 8))

# Erstelle eine benutzerdefinierte Farbpalette
colors = ['#000764', '#206BCB', '#EDFFFF', '#FFB847', '#FB0C00']
n_bins = 100
cmap = LinearSegmentedColormap.from_list('custom', colors, N=n_bins)

plt.imshow(mandelbrot(1000, 1000, 100),
          cmap=cmap,
          extent=[-2, 0.8, -1.4, 1.4])

plt.colorbar(label='Iterationen bis zur Divergenz')
plt.title('Die Mandelbrot-Menge')
plt.xlabel('Re(c)')
plt.ylabel('Im(c)')
plt.show()
```

## Interessante Bereiche

Die Mandelbrot-Menge enthält verschiedene charakteristische Bereiche:

1. **Der Hauptkörper**: Der kardioide-förmige Hauptteil, beschrieben durch:
   $$\left|z - \frac{1}{4}\right| = \frac{1}{2}$$

2. **Die Periode-2-Knospe**: Der große Kreis links vom Hauptkörper mit dem Zentrum bei $$c = -1$$

3. **Die Spiralen**: Die sich wiederholenden Spiralmuster am Rand, die durch die Iteration
   $$z_{n+1} = z_n^2 + c$$ entstehen

4. **Mini-Mandelbrots**: Kleine Kopien der gesamten Menge, die sich unendlich oft wiederholen und die Selbstähnlichkeit demonstrieren

## Mathematische Eigenschaften

Einige wichtige mathematische Eigenschaften der Mandelbrot-Menge sind:

1. **Beschränktheit**: Wenn für ein $$c \in \mathbb{C}$$ gilt: $$\lvert z_n \rvert > 2$$, dann divergiert die Folge und $$c$$ liegt nicht in $$\mathscr{M}$$.

2. **Symmetrie**: Die Menge ist symmetrisch zur reellen Achse:
   $$c \in \mathscr{M} \iff \overline{c} \in \mathscr{M}$$

3. **Innere Punkte**: Für jeden Punkt $$c$$ im Inneren der Hauptkardiode gilt:
   $$\lvert z_n \rvert \leq 2$$ für alle $$n \geq 0$$

## Mathematische Notation

### Inline-Formeln

- Der Betrag $\lvert z \rvert$ einer komplexen Zahl
- Norm eines Vektors $\lvert \vec{v} \rvert$

### Alleinstehende Formeln

Die quadratische Gleichung und ihre Lösung:

$$ax^2 + bx + c = 0 \quad \Rightarrow \quad x_{1,2} = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

Eine Matrix:

$$
\begin{pmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{pmatrix}
$$

Ein Gleichungssystem:

$$
\begin{align*}
3x + 2y &= 7 \\
x - 4y &= 1
\end{align*}
$$

Eine Fallunterscheidung:

$$
f(x) = \begin{cases}
x^2 & \text{für } x \geq 0 \\
-x^2 & \text{für } x < 0
\end{cases}
$$

Ein Grenzwert mit Bruch:

$$\lim_{x \to \infty} \frac{x^2 + 2x + 1}{x^2 + 1} = 1$$

Eine Summenformel:

$$\sum_{k=1}^n k = \frac{n(n+1)}{2}$$

Ein Integral:

$$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$

### Spezielle Notation für die Mandelbrot-Menge

Die Folge $(z_n)_{n \in \mathbb{N}}$ konvergiert genau dann, wenn:

$$\exists M \in \mathbb{R}: \lvert z_n \rvert \leq M \text{ für alle } n \in \mathbb{N}$$

Die Mandelbrot-Menge kann auch als Vereinigung geschrieben werden:

$$\mathscr{M} = \bigcup_{k=1}^\infty \{c \in \mathbb{C} : \lvert z_n \rvert \leq 2 \text{ für alle } n \leq k\}$$

## Weiterführende Ressourcen

- [The Mandelbrot Set - Numberphile](https://www.youtube.com/watch?v=NGMRB4O922I)
- [Mandelbrot Set Explorer](https://mandel.gart.nz/)
- [Wissenschaftliche Publikationen zur Mandelbrot-Menge](https://arxiv.org/search/?query=mandelbrot+set&searchtype=all)

## Fazit

Die Mandelbrot-Menge ist ein perfektes Beispiel dafür, wie aus einfachen mathematischen Regeln komplexe und wunderschöne Strukturen entstehen können. Sie verbindet Mathematik, Kunst und Computervisualisierung auf einzigartige Weise.

## Display-Math (komplex)

$$\left|\frac{x^2}{y}\right| = \sqrt{\frac{x^4}{y^2}}$$

$$\left|\begin{matrix} 
a & b \\
c & d
\end{matrix}\right| = ad-bc$$

$$\left|\frac{\sum_{i=1}^n x_i}{\prod_{j=1}^m y_j}\right|$$
