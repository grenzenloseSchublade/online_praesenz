#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Fraktal-Animations Generator

Dieses Skript generiert Animationen von Fraktalen wie dem Mandelbrot-Set
und dem Julia-Set.
"""

import os
import argparse
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.animation import FuncAnimation
import imageio
from tqdm import tqdm


def mandelbrot(h, w, max_iter, x_min=-2, x_max=0.8, y_min=-1.4, y_max=1.4):
    """
    Berechnet den Mandelbrot-Set für die gegebenen Parameter.

    Args:
        h (int): Höhe des Bildes
        w (int): Breite des Bildes
        max_iter (int): Maximale Anzahl an Iterationen
        x_min, x_max, y_min, y_max (float): Grenzen des Koordinatensystems

    Returns:
        numpy.ndarray: Matrix mit Iterationswerten
    """
    y, x = np.ogrid[y_min:y_max:h*1j, x_min:x_max:w*1j]
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


def julia_set(h, w, c, max_iter, x_min=-1.5, x_max=1.5, y_min=-1.5, y_max=1.5):
    """
    Berechnet den Julia-Set für einen komplexen Parameter c.

    Args:
        h (int): Höhe des Bildes
        w (int): Breite des Bildes
        c (complex): Komplexer Parameter für den Julia-Set
        max_iter (int): Maximale Anzahl an Iterationen
        x_min, x_max, y_min, y_max (float): Grenzen des Koordinatensystems

    Returns:
        numpy.ndarray: Matrix mit Iterationswerten
    """
    y, x = np.ogrid[y_min:y_max:h*1j, x_min:x_max:w*1j]
    z = x + y*1j
    divtime = max_iter + np.zeros(z.shape, dtype=int)

    for i in range(max_iter):
        z = z**2 + c
        diverge = z*np.conj(z) > 2**2
        div_now = diverge & (divtime == max_iter)
        divtime[div_now] = i
        z[diverge] = 2

    return divtime


def create_colormap(palette_name):
    """
    Erstellt eine Farbpalette für die Visualisierung.

    Args:
        palette_name (str): Name der Farbpalette

    Returns:
        matplotlib.colors.LinearSegmentedColormap: Farbpalette
    """
    color_palettes = {
        'blau-rot': ['#000764', '#206BCB', '#EDFFFF', '#FFB847', '#FB0C00'],
        'cyberpunk': ['#ff00ff', '#9600ff', '#0000ff', '#00ffff', '#00ffcc', '#ff00cc'],
        'retrowave': ['#ff00ff', '#9600ff', '#0000ff', '#00ffff', '#00ffcc', '#ff00cc', '#ff00ff'],
        'feuer': ['#000000', '#340000', '#800000', '#ff0000', '#ffff00', '#ffffff'],
        'ozean': ['#000033', '#000066', '#0000ff', '#00ffff', '#ffffff', '#00ffff'],
        'monochrom': ['#000000', '#222222', '#444444', '#666666', '#888888', '#aaaaaa', '#cccccc', '#ffffff'],
        'regenbogen': ['#ff00ff', '#ff8000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8000ff', '#ff00ff'],
        'ultraviolett': ['#000000', '#2E0854', '#5A1A9A', '#7B52AB', '#9470DC', '#B490FF', '#DCACFF', '#FFFFFF'],
        'goldgrün': ['#071A07', '#0B3B0B', '#0E640E', '#11C411', '#30FF30', '#88FF88', '#DFFFDF', '#FFFFFF']
    }

    if palette_name not in color_palettes:
        print(
            f"Warnung: Farbpalette '{palette_name}' nicht gefunden. Verwende 'blau-rot'.")
        palette_name = 'blau-rot'

    return LinearSegmentedColormap.from_list('custom', color_palettes[palette_name], N=100)


def generate_zoom_animation(output_file='assets/images/animations/mandelbrot_zoom.gif',
                            width=500, height=500, max_iter=100,
                            x_start=-0.7, y_start=0,
                            zoom_factor=0.8, frames=30,
                            palette='blau-rot', fps=10):
    """
    Generiert eine Zoom-Animation des Mandelbrot-Sets.

    Args:
        output_file (str): Pfad für die Ausgabedatei
        width (int): Breite des Bildes
        height (int): Höhe des Bildes
        max_iter (int): Maximale Anzahl an Iterationen
        x_start (float): X-Koordinate des Zoom-Zentrums
        y_start (float): Y-Koordinate des Zoom-Zentrums
        zoom_factor (float): Faktor, um den in jedem Frame gezoomt wird
        frames (int): Anzahl der Frames
        palette (str): Name der Farbpalette
        fps (int): Frames pro Sekunde
    """
    # Verzeichnis erstellen, falls es nicht existiert
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    print(f"Generiere Mandelbrot-Zoom-Animation mit {frames} Frames...")

    # Farbpalette erstellen
    cmap = create_colormap(palette)

    # Temporäres Verzeichnis für Frames
    temp_dir = os.path.join(os.path.dirname(output_file), 'temp_frames')
    os.makedirs(temp_dir, exist_ok=True)

    # Zoom-Parameter berechnen
    x_range = 3.0  # Anfängliche Breite des sichtbaren Bereichs
    y_range = x_range * height / width

    # Frames generieren
    frame_files = []

    for i in tqdm(range(frames), desc="Generiere Frames"):
        # Zoom-Faktor für diesen Frame
        current_zoom = zoom_factor ** i

        # Aktuellen Bereich berechnen
        current_x_range = x_range * current_zoom
        current_y_range = y_range * current_zoom

        x_min = x_start - current_x_range / 2
        x_max = x_start + current_x_range / 2
        y_min = y_start - current_y_range / 2
        y_max = y_start + current_y_range / 2

        # Mandelbrot-Set für diesen Bereich berechnen
        fractal = mandelbrot(height, width, max_iter,
                             x_min, x_max, y_min, y_max)

        # Frame speichern
        fig = plt.figure(figsize=(width/100, height/100), dpi=100)
        ax = fig.add_subplot(111)
        ax.set_axis_off()
        ax.imshow(fractal, cmap=cmap, extent=[x_min, x_max, y_min, y_max])

        frame_file = os.path.join(temp_dir, f"frame_{i:04d}.png")
        plt.savefig(frame_file, bbox_inches='tight',
                    pad_inches=0, facecolor='black')
        plt.close(fig)

        frame_files.append(frame_file)

    # Frames zu GIF zusammenfügen
    print(f"Erstelle GIF-Animation aus {len(frame_files)} Frames...")
    with imageio.get_writer(output_file, mode='I', fps=fps) as writer:
        for frame_file in frame_files:
            image = imageio.imread(frame_file)
            writer.append_data(image)

    # Temporäre Dateien löschen
    for frame_file in frame_files:
        os.remove(frame_file)
    os.rmdir(temp_dir)

    print(f"Animation gespeichert unter: {output_file}")


def generate_julia_parameter_animation(output_file='assets/images/animations/julia_animation.gif',
                                       width=500, height=500, max_iter=100,
                                       frames=30, palette='blau-rot', fps=10):
    """
    Generiert eine Animation des Julia-Sets mit sich änderndem Parameter c.

    Args:
        output_file (str): Pfad für die Ausgabedatei
        width (int): Breite des Bildes
        height (int): Höhe des Bildes
        max_iter (int): Maximale Anzahl an Iterationen
        frames (int): Anzahl der Frames
        palette (str): Name der Farbpalette
        fps (int): Frames pro Sekunde
    """
    # Verzeichnis erstellen, falls es nicht existiert
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    print(f"Generiere Julia-Parameter-Animation mit {frames} Frames...")

    # Farbpalette erstellen
    cmap = create_colormap(palette)

    # Temporäres Verzeichnis für Frames
    temp_dir = os.path.join(os.path.dirname(output_file), 'temp_frames')
    os.makedirs(temp_dir, exist_ok=True)

    # Parameter c auf einem Kreis bewegen
    radius = 0.7
    frame_files = []

    for i in tqdm(range(frames), desc="Generiere Frames"):
        # Parameter c für diesen Frame berechnen
        angle = 2 * np.pi * i / frames
        c_real = radius * np.cos(angle)
        c_imag = radius * np.sin(angle)
        c = complex(c_real, c_imag)

        # Julia-Set für diesen Parameter berechnen
        fractal = julia_set(height, width, c, max_iter)

        # Frame speichern
        fig = plt.figure(figsize=(width/100, height/100), dpi=100)
        ax = fig.add_subplot(111)
        ax.set_axis_off()
        ax.imshow(fractal, cmap=cmap, extent=[-1.5, 1.5, -1.5, 1.5])

        # Parameter c anzeigen
        ax.plot(c_real, c_imag, 'wo', markersize=5)
        ax.text(1.0, -1.3, f'c = {c:.3f}', color='white', fontsize=10)

        frame_file = os.path.join(temp_dir, f"frame_{i:04d}.png")
        plt.savefig(frame_file, bbox_inches='tight',
                    pad_inches=0, facecolor='black')
        plt.close(fig)

        frame_files.append(frame_file)

    # Frames zu GIF zusammenfügen
    print(f"Erstelle GIF-Animation aus {len(frame_files)} Frames...")
    with imageio.get_writer(output_file, mode='I', fps=fps) as writer:
        for frame_file in frame_files:
            image = imageio.imread(frame_file)
            writer.append_data(image)

    # Temporäre Dateien löschen
    for frame_file in frame_files:
        os.remove(frame_file)
    os.rmdir(temp_dir)

    print(f"Animation gespeichert unter: {output_file}")


def main():
    """Hauptfunktion für die Kommandozeilenverarbeitung."""
    parser = argparse.ArgumentParser(
        description='Generiert Animationen von Fraktalen.')
    parser.add_argument('--type', type=str, default='mandelbrot_zoom',
                        choices=['mandelbrot_zoom', 'julia_parameter'],
                        help='Typ der Animation (mandelbrot_zoom oder julia_parameter)')
    parser.add_argument('--width', type=int, default=500,
                        help='Breite des Bildes')
    parser.add_argument('--height', type=int, default=500,
                        help='Höhe des Bildes')
    parser.add_argument('--max-iter', type=int, default=100,
                        help='Maximale Anzahl an Iterationen')
    parser.add_argument('--frames', type=int, default=30,
                        help='Anzahl der Frames')
    parser.add_argument('--fps', type=int, default=10,
                        help='Frames pro Sekunde')
    parser.add_argument('--palette', type=str, default='blau-rot',
                        help='Farbpalette (blau-rot, cyberpunk, feuer, ozean, monochrom, regenbogen)')
    parser.add_argument('--output', type=str,
                        help='Pfad für die Ausgabedatei')

    # Spezifische Parameter für Mandelbrot-Zoom
    parser.add_argument('--x-start', type=float, default=-
                        0.7, help='X-Koordinate des Zoom-Zentrums')
    parser.add_argument('--y-start', type=float, default=0,
                        help='Y-Koordinate des Zoom-Zentrums')
    parser.add_argument('--zoom-factor', type=float,
                        default=0.8, help='Zoom-Faktor pro Frame')

    args = parser.parse_args()

    # Standard-Ausgabepfad basierend auf dem Typ
    if args.output is None:
        if args.type == 'mandelbrot_zoom':
            args.output = 'assets/images/animations/mandelbrot_zoom.gif'
        else:
            args.output = 'assets/images/animations/julia_animation.gif'

    # Animation generieren
    if args.type == 'mandelbrot_zoom':
        generate_zoom_animation(args.output, args.width, args.height, args.max_iter,
                                args.x_start, args.y_start, args.zoom_factor,
                                args.frames, args.palette, args.fps)
    else:
        generate_julia_parameter_animation(args.output, args.width, args.height, args.max_iter,
                                           args.frames, args.palette, args.fps)


if __name__ == '__main__':
    main()
