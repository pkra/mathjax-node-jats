/************************************************************************
 *
 *  A wrapper around MathJax-node for JATS-like files.
 *
 *  Reads an XML file that contains JATS-style *-formula elements
 *  with tex-math nodes and writes a new XML file that
 *  adds MathML representations (and optionally SVG).
 *
 * ----------------------------------------------------------------------
 *
 *  Copyright (c) 2014 American Mathematical Society
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var mjAPI = require("mathjax-node/lib/mj-single");
var typeset = mjAPI.typeset;
var fs = require('fs');
var async = require('async');
var libxmljs = require("libxmljs");


var argv = require("yargs")
  .strict()
  .usage("Usage: jats -i input.html -o output.html --outputFormat 'MathML'", {
    i: {
      describe: 'specify input file',
      alias: ('i', 'input')
    },
    o: {
      describe: 'specify output file',
      alias: ('o', 'output')
    },
    outputFormat: {
      default: "MathML, SVG",
      describe: "output format(s) to generate; MathML, SVG, or PNG" //NOTE add multiple versions
    },
  })
  .demand(['i', 'o'])
  .argv;

var outputFormats = argv.outputFormat.split(/ *, */);

var inputFile = fs.readFileSync(argv.i);
var xmlDocument = libxmljs.parseXml(inputFile);

mjAPI.config({
  MathJax: {
    menuSettings: {
      semantics: true,
    },
    "displayAlign": "left"
  }
});
mjAPI.start();

function processMath(texMathNode, callback) {
  var formulaNode = texMathNode.parent();
  formulaNode.addChild(libxmljs.parseXml("<alternatives/>").root());
  var alternativesTag = formulaNode.find('.//*[name()="alternatives"]')[0];
  alternativesTag.addChild(texMathNode.clone());
  texMathNode.remove();
  var thisTexMathNode = alternativesTag.find('.//*[name()="tex-math"]')[0];
  var texString = thisTexMathNode.text();
  var dispStyle = (formulaNode.name() === 'disp-formula');
  typeset({
    math: texString,
    format: (dispStyle ? "TeX" : "inline-TeX"),
    mml: (outputFormats.indexOf('MathML') > -1),
    svg: (outputFormats.indexOf('SVG') > -1),
  }, function(data) {
    if (!data.errors) {
      if (data.svg) {
        // remove ids to avoid clash with MathML
        var svgNode = libxmljs.parseXml(data.svg);
        var svgIds = svgNode.find('.//*[name()="g"][@id]');
        for (var idx = 0; idx < svgIds.length; idx++) {
          var currentNode = svgIds[idx];
          var currentId = currentNode.attr('id');
          currentNode.attr({
            'xlink:type': 'resource'
          });
          currentNode.defineNamespace('xlink', 'http://www.w3.org/1999/xlink');
          currentNode.attr({
            'xlink:label': currentId.value()
          });
          currentNode.attr({
            'id': ''
          });
        }
        thisTexMathNode.addPrevSibling(svgNode.root());
      }
      if (data.mml) {
        var mmlNode = libxmljs.parseXml(data.mml);
        var mmlLabels = mmlNode.find('.//*[name()="mlabeledtr"]'); // adding xlink attributes to labeled equations
        for (var idx = 0; idx < mmlLabels.length; idx++) {
          var currentNode = mmlLabels[idx].child(1);
          currentNode.attr({
            'xlink:type': 'resource'
          });
          currentNode.defineNamespace('xlink', 'http://www.w3.org/1999/xlink');
          currentNode.attr({
            'xlink:title': currentNode.child(1).text()
          }); // This assumes the label is simple text
          var idNode = mmlNode.find('.//*[name()="mrow"][@id]')[0];
          if (idNode){
            var currentId = idNode.attr('id');
            currentNode.attr({
              'xlink:label': currentId.value()
            });
          }
        }
        thisTexMathNode.addPrevSibling(mmlNode.root());
      }
    }
    callback();
  });
}

var texMathNodes = xmlDocument.find('//tex-math');


async.each(texMathNodes, processMath, function(err) {
  if (err) {
    throw err;
  }
  fs.writeFile(argv.o, xmlDocument, function(err) {
    if (err) {
      throw err;
    } else {
      console.log("It\'s saved!");
    }
  });
});
