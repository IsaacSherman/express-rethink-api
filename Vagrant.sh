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

echo "Installing RethinkDB"

source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- http://download.rethinkdb.com/apt/pubkey.gpg | apt-key add -
apt-get update -y > /dev/null
apt-get install rethinkdb -y --force-yes
cp /etc/rethinkdb/default.conf.sample /etc/rethinkdb/instances.d/vagrant.conf
echo "" >> /etc/rethinkdb/instances.d/vagrant.conf
echo "bind=all" >> /etc/rethinkdb/instances.d/vagrant.conf
echo "http-port=9090" >> /etc/rethinkdb/instances.d/vagrant.conf
echo "" >> /etc/rethinkdb/instances.d/vagrant.conf
/etc/init.d/rethinkdb restart

echo "Installing Node.js application"

npm install

echo "All done - go and get started!"
