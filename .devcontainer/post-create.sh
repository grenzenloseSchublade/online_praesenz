#!/bin/bash

# System-Pakete aktualisieren
apt-get update
apt-get install -y build-essential

# Ruby-Gems installieren
gem install bundler
bundle install

# Node.js-Pakete für Asset-Verarbeitung
npm install -g npm@latest
npm install -g gulp-cli

# Berechtigungen für den Projektordner setzen
chmod -R 755 .
