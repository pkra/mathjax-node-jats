#!/bin/bash
wget https://raw.githubusercontent.com/mathjax/MathJax-third-party-extensions/master/img/unpacked/img.js -O node_modules/mathjax/unpacked/extensions/TeX/img.js
sed -i 's/\[Contrib\]\/img\/unpacked/\[MathJax\]\/extensions\/TeX/g' ./node_modules/MathJax/unpacked/extensions/TeX/img.js
sed -i 's/"autoload-all.js"/"autoload-all.js","img.js"/g' ./node_modules/mathjax-node/lib/mj-single.js
