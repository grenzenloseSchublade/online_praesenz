import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
import os


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


# Verzeichnis erstellen, falls es nicht existiert
output_dir = 'assets/images/fractals'
os.makedirs(output_dir, exist_ok=True)

# Erstelle eine hochauflösende Visualisierung für den Header
plt.figure(figsize=(20, 8))

# Erstelle eine benutzerdefinierte Farbpalette
colors = ['#000764', '#206BCB', '#EDFFFF', '#FFB847', '#FB0C00']
n_bins = 100
cmap = LinearSegmentedColormap.from_list('custom', colors, N=n_bins)

plt.imshow(mandelbrot(2000, 5000, 100),
           cmap=cmap,
           extent=[-2, 0.8, -1.4, 1.4])

plt.axis('off')  # Verstecke die Achsen für ein sauberes Header-Bild

# Speichere das Bild
output_file = os.path.join(output_dir, 'mandelbrot-header.jpg')
plt.savefig(output_file,
            dpi=300,
            bbox_inches='tight',
            pad_inches=0,
            facecolor='black')

print(f"Mandelbrot-Bild gespeichert unter: {output_file}")
