find '.' -maxdepth 1 -name '*.xml' -printf '%f\n' | while read line; do
  echo "Processing file '$line'"
  node main.js -i $line
done
