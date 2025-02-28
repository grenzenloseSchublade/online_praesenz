#!/bin/bash
set -e

# Willkommensnachricht
echo "==================================================================="
echo "Willkommen zur Python 3.11 & Jekyll Entwicklungsumgebung!"
echo "==================================================================="

# Workspace-Berechtigungen setzen
echo "Setze Berechtigungen für den Workspace..."
WORKSPACE_DIR="/workspaces/online_praesenz"

# Verzeichnisse erstellen
mkdir -p assets/images/fractals
mkdir -p assets/images/animations
mkdir -p notebooks
mkdir -p scripts

# Berechtigungen für den gesamten Workspace setzen
sudo chown -R vscode:vscode $WORKSPACE_DIR
find $WORKSPACE_DIR -type d -exec chmod 755 {} \;
find $WORKSPACE_DIR -type f -exec chmod 644 {} \;

# Ausführbare Dateien
chmod +x generate_all_fractals.py
chmod +x test_python_env.py
chmod +x .devcontainer/post-create.sh
find $WORKSPACE_DIR/scripts -name "*.py" -exec chmod +x {} \;

# Umgebungsvariablen setzen
echo "Setze Umgebungsvariablen..."
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Jekyll-Umgebung einrichten
echo "Richte Jekyll-Umgebung ein..."
bundle config set --local path vendor/bundle

# Python-Umgebung testen
echo "Teste Python-Umgebung..."
if command -v python3 &>/dev/null; then
    python3 --version
    echo "Python 3 ist verfügbar."
else
    echo "Warnung: Python 3 wurde nicht gefunden."
fi

# Jupyter-Kernel einrichten
#echo "Richte Jupyter-Kernel ein..."
#if command -v jupyter &>/dev/null; then
#    jupyter kernelspec list
#else
#    echo "Warnung: Jupyter wurde nicht gefunden."
#fi

# Berechtigungen für Jekyll-Verzeichnisse
echo "Setze Berechtigungen für Jekyll-Verzeichnisse..."
mkdir -p _site
chmod -R 755 _site
mkdir -p .jekyll-cache
chmod -R 755 .jekyll-cache
mkdir -p .sass-cache
chmod -R 755 .sass-cache

echo "==================================================================="
echo "Einrichtung abgeschlossen. Viel Spaß beim Entwickeln!"
echo "==================================================================="
