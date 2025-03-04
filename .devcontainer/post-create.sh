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

# Berechtigungen für den gesamten Workspace setzen
sudo chown -R vscode:vscode $WORKSPACE_DIR
find $WORKSPACE_DIR -type d -exec chmod 755 {} \;
find $WORKSPACE_DIR -type f -exec chmod 644 {} \;

# Ausführbare Dateien
chmod +x .devcontainer/post-create.sh

# Umgebungsvariablen setzen
echo "Setze Umgebungsvariablen..."
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Jekyll-Umgebung einrichten
echo "Richte Jekyll-Umgebung ein..."
bundle config set --local path vendor/bundle

# Berechtigungen für Jekyll-Verzeichnisse
echo "Setze Berechtigungen für Jekyll-Verzeichnisse..."
mkdir -p _site
chmod -R 755 _site
mkdir -p .jekyll-cache
chmod -R 755 .jekyll-cache
mkdir -p .sass-cache
chmod -R 755 .sass-cache

# Jekyll-Executable ausführbar machen
echo "Mache Jekyll-Executable ausführbar..."
find $WORKSPACE_DIR/vendor/bundle -name jekyll -type f -exec chmod +x {} \;

echo "==================================================================="
echo "Einrichtung abgeschlossen. Viel Spaß beim Entwickeln!"
echo "==================================================================="
