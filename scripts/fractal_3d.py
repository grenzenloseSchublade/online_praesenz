#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
3D-Fraktal Generator

Dieses Skript generiert 3D-Visualisierungen von Fraktalen wie dem Mandelbrot-Set
und dem Julia-Set mit Höhenkarten.
"""

import os
import argparse
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import cm
from mpl_toolkits.mplot3d import Axes3D


def mandelbrot_set(h, w, max_iter):
    """
    Berechnet den Mandelbrot-Set.

    Args:
        h (int): Höhe des Bildes
        w (int): Breite des Bildes
        max_iter (int): Maximale Anzahl an Iterationen

    Returns:
        numpy.ndarray: Matrix mit Iterationswerten
    """
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


def julia_set(h, w, c, max_iter):
    """
    Berechnet den Julia-Set für einen komplexen Parameter c.

    Args:
        h (int): Höhe des Bildes
        w (int): Breite des Bildes
        c (complex): Komplexer Parameter für den Julia-Set
        max_iter (int): Maximale Anzahl an Iterationen

    Returns:
        numpy.ndarray: Matrix mit Iterationswerten
    """
    y, x = np.ogrid[-1.5:1.5:h*1j, -1.5:1.5:w*1j]
    z = x + y*1j
    divtime = max_iter + np.zeros(z.shape, dtype=int)

    for i in range(max_iter):
        z = z**2 + c
        diverge = z*np.conj(z) > 2**2
        div_now = diverge & (divtime == max_iter)
        divtime[div_now] = i
        z[diverge] = 2

    return divtime


def create_3d_fractal(fractal_type='mandelbrot', width=500, height=500, max_iter=100,
                      cmap='viridis', elevation=30, azimuth=45, output_path=None):
    """
    Erstellt eine 3D-Visualisierung eines Fraktals.

    Args:
        fractal_type (str): Typ des Fraktals ('mandelbrot' oder 'julia')
        width (int): Breite des Bildes
        height (int): Höhe des Bildes
        max_iter (int): Maximale Anzahl an Iterationen
        cmap (str): Name der Farbkarte
        elevation (float): Höhenwinkel der Kamera in Grad
        azimuth (float): Azimutwinkel der Kamera in Grad
        output_path (str): Pfad für die Ausgabedatei
    """
    print(
        f"Generiere 3D-{fractal_type.capitalize()}-Fraktal mit {width}x{height} Pixeln...")

    # Fraktal berechnen
    if fractal_type.lower() == 'mandelbrot':
        fractal = mandelbrot_set(height, width, max_iter)
        title = "3D-Visualisierung des Mandelbrot-Sets"
    elif fractal_type.lower() == 'julia':
        c = complex(-0.7, 0.27015)  # Standard-Parameter für Julia-Set
        fractal = julia_set(height, width, c, max_iter)
        title = f"3D-Visualisierung des Julia-Sets für c={c}"
    else:
        raise ValueError(f"Unbekannter Fraktaltyp: {fractal_type}")

    # Logarithmische Skalierung für bessere Visualisierung
    fractal_log = np.log(fractal + 1)

    # Gitter für die 3D-Darstellung erstellen
    x = np.linspace(-2, 1, width)
    y = np.linspace(-1.5, 1.5, height)
    X, Y = np.meshgrid(x, y)

    # 3D-Plot erstellen
    fig = plt.figure(figsize=(12, 10), dpi=100)
    ax = fig.add_subplot(111, projection='3d')

    # Surface-Plot mit Farbkarte
    surf = ax.plot_surface(X, Y, fractal_log, cmap=cmap,
                           linewidth=0, antialiased=True, alpha=0.8)

    # Achsenbeschriftungen
    ax.set_xlabel('Re(c)')
    ax.set_ylabel('Im(c)')
    ax.set_zlabel('log(Iterationen)')
    ax.set_title(title)

    # Kameraposition einstellen
    ax.view_init(elevation, azimuth)

    # Farbbalken hinzufügen
    fig.colorbar(surf, ax=ax, shrink=0.5, aspect=5)

    # Bild speichern oder anzeigen
    if output_path:
        # Verzeichnis erstellen, falls es nicht existiert
        os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)

        # Bild speichern
        plt.savefig(output_path, bbox_inches='tight')
        print(f"3D-Fraktal gespeichert unter: {output_path}")
        plt.close(fig)
    else:
        plt.tight_layout()
        plt.show()
        plt.close(fig)


def main():
    """Hauptfunktion für die Kommandozeilenverarbeitung."""
    parser = argparse.ArgumentParser(
        description='Generiert 3D-Visualisierungen von Fraktalen.')
    parser.add_argument('--type', type=str, default='mandelbrot', choices=['mandelbrot', 'julia'],
                        help='Typ des Fraktals (mandelbrot oder julia)')
    parser.add_argument('--width', type=int, default=500,
                        help='Breite des Bildes')
    parser.add_argument('--height', type=int, default=500,
                        help='Höhe des Bildes')
    parser.add_argument('--max-iter', type=int, default=100,
                        help='Maximale Anzahl an Iterationen')
    parser.add_argument('--cmap', type=str, default='viridis',
                        help='Matplotlib-Farbkarte')
    parser.add_argument('--elevation', type=float, default=30,
                        help='Höhenwinkel der Kamera in Grad')
    parser.add_argument('--azimuth', type=float, default=45,
                        help='Azimutwinkel der Kamera in Grad')
    parser.add_argument('--output', type=str, default='assets/images/fractals/fractal_3d.jpg',
                        help='Pfad für die Ausgabedatei')

    args = parser.parse_args()

    # 3D-Fraktal generieren und speichern
    create_3d_fractal(args.type, args.width, args.height, args.max_iter,
                      args.cmap, args.elevation, args.azimuth, args.output)


if __name__ == '__main__':
    main()
