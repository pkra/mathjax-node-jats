find '.' -maxdepth 1 -name '*.xml' -printf '%f\n' | while read line; do
  # name=$(basename $line)
  # echo "Hellp" $name
  echo "Processing file '$line'"
  node main.js -i $line -o 'post-'$line --outputFormat "MathML"
done
