#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Julia-Set Generator

Dieses Skript generiert Bilder von Julia-Sets mit verschiedenen Parametern.
"""

import os
import argparse
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import cm
from PIL import Image

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

def create_julia_image(c, width=1000, height=1000, max_iter=100, cmap='magma', output_path=None):
    """
    Erstellt ein Bild eines Julia-Sets.
    
    Args:
        c (complex): Komplexer Parameter für den Julia-Set
        width (int): Breite des Bildes
        height (int): Höhe des Bildes
        max_iter (int): Maximale Anzahl an Iterationen
        cmap (str): Name der Farbkarte
        output_path (str): Pfad für die Ausgabedatei
        
    Returns:
        PIL.Image: Das generierte Bild
    """
    print(f"Generiere Julia-Set für c={c} mit {width}x{height} Pixeln...")
    
    # Julia-Set berechnen
    julia = julia_set(height, width, c, max_iter)
    
    # Bild erstellen
    fig = plt.figure(figsize=(10, 10), dpi=100)
    ax = fig.add_subplot(111)
    ax.set_title(f'Julia-Set für c={c}')
    ax.set_axis_off()
    
    # Farbkarte anwenden
    img = ax.imshow(julia, cmap=cmap)
    plt.tight_layout()
    
    # Bild speichern oder anzeigen
    if output_path:
        # Verzeichnis erstellen, falls es nicht existiert
        os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
        
        # Bild speichern
        plt.savefig(output_path, bbox_inches='tight', pad_inches=0)
        print(f"Bild gespeichert unter: {output_path}")
        plt.close(fig)
        
        # Bild mit PIL öffnen und zurückgeben
        return Image.open(output_path)
    else:
        plt.show()
        plt.close(fig)
        return None

def main():
    """Hauptfunktion für die Kommandozeilenverarbeitung."""
    parser = argparse.ArgumentParser(description='Generiert Bilder von Julia-Sets.')
    parser.add_argument('--width', type=int, default=1000, help='Breite des Bildes')
    parser.add_argument('--height', type=int, default=1000, help='Höhe des Bildes')
    parser.add_argument('--real', type=float, default=-0.7, help='Realteil des komplexen Parameters c')
    parser.add_argument('--imag', type=float, default=0.27015, help='Imaginärteil des komplexen Parameters c')
    parser.add_argument('--max-iter', type=int, default=100, help='Maximale Anzahl an Iterationen')
    parser.add_argument('--cmap', type=str, default='magma', help='Matplotlib-Farbkarte')
    parser.add_argument('--output', type=str, default='assets/images/fractals/julia_set.jpg', 
                        help='Pfad für die Ausgabedatei')
    
    args = parser.parse_args()
    
    # Komplexen Parameter erstellen
    c = complex(args.real, args.imag)
    
    # Julia-Set generieren und speichern
    create_julia_image(c, args.width, args.height, args.max_iter, args.cmap, args.output)

if __name__ == '__main__':
    main() 