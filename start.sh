#!/bin/sh
ps aux |grep node\/bin\/www |grep -v grep|awk '{print $2}' |xargs kill -9
node scripts/node/bin/www &
npm start
