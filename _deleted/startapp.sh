#!/bin/bash
echo "---------------------------"  >> /home/pi/application/startapp.log
echo "- Starting mongo and node -"  >> /home/pi/application/startapp.log
echo "---------------------------"  >> /home/pi/application/startapp.log
date >> /home/pi/application/startapp.log
# Delay was neccessary - file not available right at boot (?)
sleep 10
date >> /home/pi/application/startapp.log
rm -v /var/lib/mongodb/mongod.lock >> /home/pi/application/startapp.log
cd /home/pi/mongo4pi
./mongod start &
#rm -v /var/lib/mongodb/mongod.lock >> /home/pi/application/startapp.log
#./mongod start &
cd /home/pi/application
node server.js &
