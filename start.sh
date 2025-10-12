#!/bin/bash
cd /Documents/vattenfall-ddw/dist
serve -p 8080 &
sleep 3
open -a "Google Chrome" --args --kiosk http://localhost:5678
