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

# Die Mandelbrot-Menge

Die Mandelbrot-Menge ist eines der bekanntesten mathematischen Objekte und ein faszinierendes Beispiel für die Schönheit der Mathematik.

## Mathematische Definition

Die Mandelbrot-Menge $$\mathscr{M}$$ ist definiert als die Menge aller komplexen Zahlen $$c \in \mathbb{C}$$, für die die Folge

$$z_{n+1} = z_n^2 + c, \quad z_0 = 0$$

beschränkt bleibt. Genauer gesagt:

$$\mathscr{M} = \{c \in \mathbb{C} : \limsup_{n \to \infty} |z_n| \leq 2\}$$

wobei $$|z_n|$$ der Betrag der komplexen Zahl $$z_n$$ ist.

## Eigenschaften

1. **Zusammenhängend**: Die Mandelbrot-Menge ist zusammenhängend, was 1982 von Adrien Douady und John H. Hubbard bewiesen wurde.
2. **Selbstähnlichkeit**: An den Rändern der Menge finden sich immer wieder ähnliche Strukturen.
3. **Fraktale Dimension**: Die Hausdorff-Dimension der Randkurve beträgt etwa 2.

## Interaktive Visualisierung

{% include mandelbrot-iframe.html %}

## Programmierung der Mandelbrot-Menge

Hier ist ein verbessertes Python-Beispiel zur Berechnung und Visualisierung der Mandelbrot-Menge:

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

def plot_mandelbrot(size=1000, max_iter=100):
    plt.figure(figsize=(12, 8))
    
    # Erstelle eine benutzerdefinierte Farbpalette
    colors = ['#000764', '#206BCB', '#EDFFFF', '#FFB847', '#FB0C00']
    n_bins = 100
    cmap = LinearSegmentedColormap.from_list('custom', colors, N=n_bins)
    
    plt.imshow(mandelbrot(size, size, max_iter),
               cmap=cmap,
               extent=[-2, 0.8, -1.4, 1.4])
    
    plt.title('Die Mandelbrot-Menge', fontsize=16)
    plt.xlabel('Re(c)', fontsize=12)
    plt.ylabel('Im(c)', fontsize=12)
    plt.colorbar(label='Iterationen bis zur Divergenz')
    plt.grid(True, alpha=0.3)
    
    return plt

# Generiere und zeige die Visualisierung
plot_mandelbrot(size=1000, max_iter=100)
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

1. **Beschränktheit**: Wenn für ein $$c \in \mathbb{C}$$ gilt: $$|z_n| > 2$$, dann divergiert die Folge und $$c$$ liegt nicht in $$\mathscr{M}$$.

2. **Symmetrie**: Die Menge ist symmetrisch zur reellen Achse:
   $$c \in \mathscr{M} \iff \overline{c} \in \mathscr{M}$$

3. **Innere Punkte**: Für jeden Punkt $$c$$ im Inneren der Hauptkardiode gilt:
   $$|z_n| \leq 2$$ für alle $$n \geq 0$$

## Weiterführende Ressourcen

- [The Mandelbrot Set - Numberphile](https://www.youtube.com/watch?v=NGMRB4O922I)
- [Mandelbrot Set Explorer](https://mandel.gart.nz/)
- [Wissenschaftliche Publikationen zur Mandelbrot-Menge](https://arxiv.org/search/?query=mandelbrot+set&searchtype=all)

## Fazit

Die Mandelbrot-Menge ist ein perfektes Beispiel dafür, wie aus einfachen mathematischen Regeln komplexe und wunderschöne Strukturen entstehen können. Sie verbindet Mathematik, Kunst und Computervisualisierung auf einzigartige Weise. 