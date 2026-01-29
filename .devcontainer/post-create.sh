#!/bin/bash
set -e

# Willkommensnachricht
echo "==================================================================="
echo "Willkommen zur Python 3.11 & Jekyll Entwicklungsumgebung!"
echo "==================================================================="


echo "Installing Ruby 3.4 build dependencies..."
sudo apt-get update
sudo apt-get install -y \
    autoconf \
    bison \
    build-essential \
    libssl-dev \
    libyaml-dev \
    libreadline-dev \
    zlib1g-dev \
    libncurses5-dev \
    libffi-dev \
    libgdbm-dev \
    libgdbm6 \
    git \
    curl

echo "Installing rbenv..."
if [ ! -d "$HOME/.rbenv" ]; then
    git clone https://github.com/rbenv/rbenv.git ~/.rbenv
fi

export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

# rbenv dauerhaft in die Shell integrieren
if ! grep -q 'rbenv init' ~/.bashrc; then
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
    echo 'eval "$(rbenv init -)"' >> ~/.bashrc
fi

echo "Installing ruby-build plugin..."
if [ ! -d "$HOME/.rbenv/plugins/ruby-build" ]; then
    git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
fi

echo "Installing Ruby 3.4.1 (this takes 3-5 minutes on first build)..."
rbenv install 3.4.1 --skip-existing
rbenv global 3.4.1

echo "Installing Bundler..."
gem install bundler

echo "Ruby $(ruby -v) installed successfully!"


# Workspace-Berechtigungen setzen
echo "Setze Berechtigungen für den Workspace..."
WORKSPACE_DIR="/workspaces/auflinie"

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
