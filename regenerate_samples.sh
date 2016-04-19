#!/bin/bash
find './xml/distribution/' -type f -name 'b*.xml' | while read line; do
  echo "Processing file '$line'"
  node main.js -i $line -o $line
done
