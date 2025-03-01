#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Hauptskript zur Generierung aller Fraktale
Dieses Skript führt alle Fraktal-Generatoren aus und erstellt die Bilder für die Website.
"""

import os
import sys
import subprocess
import time
from tqdm import tqdm

def create_directory_if_not_exists(directory):
    """Erstellt ein Verzeichnis, falls es nicht existiert."""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Verzeichnis erstellt: {directory}")

def run_script(script_path, description):
    """Führt ein Python-Skript aus und zeigt den Fortschritt an."""
    print(f"\n{'='*80}")
    print(f"Ausführung: {description}")
    print(f"{'='*80}")
    
    try:
        result = subprocess.run([sys.executable, script_path], 
                               check=True, 
                               stdout=subprocess.PIPE, 
                               stderr=subprocess.PIPE,
                               text=True)
        print(result.stdout)
        if result.stderr:
            print(f"Warnungen:\n{result.stderr}")
        print(f"✅ {description} erfolgreich abgeschlossen")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Fehler bei der Ausführung von {script_path}:")
        print(f"Ausgabe:\n{e.stdout}")
        print(f"Fehler:\n{e.stderr}")
        return False

def main():
    """Hauptfunktion zur Ausführung aller Fraktal-Generatoren."""
    start_time = time.time()
    
    # Verzeichnisse erstellen
    create_directory_if_not_exists("assets/images/fractals")
    create_directory_if_not_exists("assets/images/animations")
    create_directory_if_not_exists("scripts")
    
    # Liste der auszuführenden Skripte mit Beschreibungen
    scripts = [
        ("generate_mandelbrot.py", "Mandelbrot-Set Generator"),
        ("scripts/julia_set.py", "Julia-Set Generator"),
        ("scripts/fractal_3d.py", "3D-Fraktal Generator"),
        ("scripts/fractal_animation.py", "Fraktal-Animations Generator")
    ]
    
    # Fortschrittsbalken für die Gesamtausführung
    with tqdm(total=len(scripts), desc="Gesamtfortschritt") as pbar:
        success_count = 0
        
        for script_path, description in scripts:
            if os.path.exists(script_path):
                if run_script(script_path, description):
                    success_count += 1
            else:
                print(f"⚠️ Skript nicht gefunden: {script_path}")
            
            pbar.update(1)
    
    # Zusammenfassung
    elapsed_time = time.time() - start_time
    print(f"\n{'='*80}")
    print(f"Zusammenfassung der Fraktal-Generierung")
    print(f"{'='*80}")
    print(f"Ausgeführte Skripte: {len(scripts)}")
    print(f"Erfolgreich: {success_count}")
    print(f"Fehlgeschlagen: {len(scripts) - success_count}")
    print(f"Gesamtzeit: {elapsed_time:.2f} Sekunden")
    
    if success_count == len(scripts):
        print("\n✅ Alle Fraktale wurden erfolgreich generiert!")
    else:
        print("\n⚠️ Einige Fraktal-Generatoren konnten nicht ausgeführt werden.")
        print("   Überprüfen Sie die Fehlermeldungen oben für weitere Details.")

if __name__ == "__main__":
    main() 