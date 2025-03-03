#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Python-Umgebungstest

Dieses Skript testet die Python-Umgebung und überprüft, ob alle benötigten
Abhängigkeiten korrekt installiert sind.
"""

import sys
import importlib
import subprocess
import pkg_resources
from pkg_resources import DistributionNotFound, VersionConflict

def print_header(title):
    """Gibt eine formatierte Überschrift aus.
    
    Args:
        title (str): Titel der Überschrift
    """
    print("\n" + "=" * 60)
    print(f" {title}")
    print("=" * 60)

def check_python_version():
    """Überprüft die Python-Version."""
    print_header("Python-Version")
    version = sys.version.split()[0]
    print(f"Python-Version: {version}")
    
    major, minor, patch = map(int, version.split('.'))
    if major != 3 or minor < 8:
        print("⚠️  Warnung: Python 3.8 oder höher wird empfohlen.")
    else:
        print("✓ Python-Version ist kompatibel.")

def check_dependencies():
    """Überprüft, ob alle Abhängigkeiten installiert sind."""
    print_header("Abhängigkeiten")
    
    # Abhängigkeiten aus requirements.txt lesen
    try:
        with open('requirements.txt', 'r') as f:
            requirements = []
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    requirements.append(line)
    except FileNotFoundError:
        print("⚠️  Warnung: requirements.txt nicht gefunden.")
        return
    
    # Abhängigkeiten überprüfen
    missing = []
    outdated = []
    
    for requirement in requirements:
        try:
            pkg_resources.require(requirement)
            package_name = requirement.split('==')[0]
            print(f"✓ {requirement}")
        except DistributionNotFound:
            package_name = requirement.split('==')[0]
            missing.append(requirement)
            print(f"✗ {requirement} (nicht installiert)")
        except VersionConflict as e:
            package_name = requirement.split('==')[0]
            outdated.append((requirement, str(e.dist)))
            print(f"⚠️  {requirement} (installiert: {e.dist})")
    
    # Zusammenfassung
    if not missing and not outdated:
        print("\n✓ Alle Abhängigkeiten sind korrekt installiert.")
    else:
        if missing:
            print(f"\n⚠️  {len(missing)} fehlende Abhängigkeiten:")
            for req in missing:
                print(f"  - {req}")
        if outdated:
            print(f"\n⚠️  {len(outdated)} veraltete Abhängigkeiten:")
            for req, installed in outdated:
                print(f"  - {req} (installiert: {installed})")
        
        print("\nFühren Sie den folgenden Befehl aus, um alle Abhängigkeiten zu installieren:")
        print("pip install -r requirements.txt")

def check_matplotlib_backend():
    """Überprüft, ob Matplotlib korrekt funktioniert."""
    print_header("Matplotlib-Test")
    
    try:
        import matplotlib.pyplot as plt
        import numpy as np
        
        print("✓ Matplotlib und NumPy sind installiert.")
        
        # Einfaches Plot erstellen
        plt.figure(figsize=(2, 2))
        x = np.linspace(0, 2*np.pi, 100)
        plt.plot(x, np.sin(x))
        plt.close()
        
        print("✓ Matplotlib-Backend funktioniert korrekt.")
        print(f"✓ Verwendetes Backend: {plt.get_backend()}")
    except ImportError as e:
        print(f"✗ Fehler beim Importieren von Matplotlib oder NumPy: {str(e)}")
    except Exception as e:
        print(f"✗ Fehler beim Testen des Matplotlib-Backends: {str(e)}")

def check_jupyter():
    """Überprüft, ob Jupyter korrekt installiert ist."""
    print_header("Jupyter-Test")
    
    try:
        import jupyter
        import notebook
        
        print("✓ Jupyter und Notebook sind installiert.")
        
        # Jupyter-Kernel überprüfen
        try:
            result = subprocess.run(
                ["jupyter", "kernelspec", "list"],
                capture_output=True,
                text=True,
                check=True
            )
            print("\nVerfügbare Jupyter-Kernel:")
            for line in result.stdout.splitlines():
                print(f"  {line}")
        except subprocess.CalledProcessError as e:
            print(f"⚠️  Warnung: Konnte Jupyter-Kernel nicht auflisten: {e}")
    except ImportError as e:
        print(f"✗ Fehler beim Importieren von Jupyter: {str(e)}")

def check_pillow():
    """Überprüft, ob Pillow korrekt installiert ist."""
    print_header("Pillow-Test")
    
    try:
        from PIL import Image, __version__
        
        print(f"✓ Pillow ist installiert (Version {__version__}).")
        
        # Unterstützte Formate anzeigen
        print("\nUnterstützte Bildformate:")
        formats = sorted(Image.registered_extensions().items())
        for ext, format in formats:
            print(f"  {ext}: {format}")
    except ImportError as e:
        print(f"✗ Fehler beim Importieren von Pillow: {str(e)}")

def main():
    """Hauptfunktion."""
    print_header("Python-Umgebungstest")
    print("Dieses Skript überprüft, ob alle benötigten Abhängigkeiten installiert sind.")
    
    check_python_version()
    check_dependencies()
    check_matplotlib_backend()
    check_jupyter()
    check_pillow()
    
    print_header("Test abgeschlossen")

if __name__ == '__main__':
    main() 