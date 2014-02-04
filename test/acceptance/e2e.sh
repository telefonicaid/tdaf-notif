#!/bin/bash
# -*- ENCODING: UTF-8 -*-
# Launch this script from path /test/acceptance/
# ./acceptance*.sh

echo "// Environment [localhost] CHECKS before tests //"
SERVICES="mongod redis-server"
NOTIF="tdaf-notif.js"


# check if each service is running
for service in $SERVICES
do
  # if current service is running, dont do anything.
  if ps ax | grep -v grep | grep $service > /dev/null
  then
    echo " - $service service is running!"
  else # otherwise, turn it on
    echo " x $service is not running"
#    Disabled due to security
#    sudo /etc/init.d/$service start
    if ps ax | grep -v grep | grep $service > /dev/null
    then
      echo " - $service is now running."
    else
      echo " x Unable to start $service."
    fi
  fi
done

#check Rush is running with at least one agent of consumer and listener
for notif in $NOTIF
do
  # if current service is running, dont do anything.
  if ps ax | grep -v grep | grep $notif > /dev/null
  then
    echo " - $notif service is running!"
  else # otherwise, turn it on
    echo " x $notif is not running @[localhost]"
#     node ../../src/$notif &
    if ps ax | grep -v grep | grep $notif > /dev/null
    then
      echo " - $notif is now running."
    else
      echo " x Unable to start $notif @[localhost] "
    fi
  fi
done
echo " // Environment CHECKS completed //"
echo " "
echo " // Test execution :            // "
echo " "
mocha e2e/*.js -R spec
echo " // Test execution Completed:  // "
exit