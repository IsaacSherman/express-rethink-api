#!/bin/bash

echo "Go get some coffee - this may take awhile ..."

apt-get update > /dev/null

echo "Installing git"

apt-get install git -y > /dev/null
git --version

echo "Installing node.js"

apt-get install python-software-properties -y > /dev/null
apt-add-repository ppa:chris-lea/node.js -y > /dev/null
apt-get update -y > /dev/null
apt-get install nodejs -y > /dev/null
node -v
npm -v

echo "Installing node-gyp"

apt-get install libpq-dev -y > /dev/null
npm install make -g
npm install node-gyp -g
apt-get install node-gyp -y > /dev/null
node-gyp -v

echo "All done - go and get started!"
