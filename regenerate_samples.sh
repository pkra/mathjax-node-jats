#!/bin/bash
find './xml/data/' -type f -name 'b*.xml' | while read line; do
  echo "Processing file '$line'"
  node main.js -i $line -p 'xml/preprocessed/'
done
