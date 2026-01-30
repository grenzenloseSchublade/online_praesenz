#!/bin/bash
set -e

echo "===================================="
echo "Python 3.11 & Jekyll Setup"
echo "===================================="

# Ruby Build Dependencies
echo "Installing Ruby build dependencies..."
sudo apt-get update
sudo apt-get install -y \
    autoconf bison build-essential \
    libssl-dev libyaml-dev libreadline-dev \
    zlib1g-dev libncurses5-dev \
    libffi-dev libgdbm-dev libgdbm6 \
    git curl

# rbenv Installation
echo "Installing rbenv..."
if [ ! -d "$HOME/.rbenv" ]; then
    git clone https://github.com/rbenv/rbenv.git ~/.rbenv
fi

export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

if ! grep -q 'rbenv init' ~/.bashrc; then
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
    echo 'eval "$(rbenv init -)"' >> ~/.bashrc
fi

# ruby-build Plugin
echo "Installing ruby-build plugin..."
if [ ! -d "$HOME/.rbenv/plugins/ruby-build" ]; then
    git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
fi

# Ruby Installation
echo "Installing Ruby 3.4.1 (3-5 minutes)..."
rbenv install 3.4.1 --skip-existing
rbenv global 3.4.1

# RubyGems & Bundler
echo "Updating RubyGems to 4.0.5..."
gem update --system 4.0.5

echo "Installing Bundler..."
gem install bundler

# Python pip
echo "Upgrading pip..."
pip install --upgrade pip

# Jekyll Setup
echo "Installing Jekyll dependencies..."
bundle config set --local path vendor/bundle
bundle install

echo "===================================="
echo "✅ Setup complete!"
echo "   Ruby: $(ruby -v)"
echo "   Bundler: $(bundle -v)"
echo "   Python: $(python --version)"
echo "===================================="

