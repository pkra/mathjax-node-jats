# mathjax-node-jats

A simple tool for pre-processing JATS-like XML, converting `tex-math` to MathML using mathjax-node. The target renderer is Lens Reader.

* clone the repo and run `npm install` in the resulting folder.
* Make a symlink `data` to a folder with some XML files.
* Run `make getXML && make process`
* Move the resulting `post-*` files where you need them.

PRs welcome.

## TODOs

* automate `img.js` integration
 * currently, you'll need to jump through a couple of hoops due to limitations of MathJax, mathjax-node and jsdom.
    * download [img.js](https://github.com/mathjax/MathJax-third-party-extensions/blob/master/img/unpacked/img.js)
    * move it to `node_modules/MathJax/extensions/TeX/`
    * change the `loadComplete` call at the end of `img.js`
    * modify `node_module/mathjax-node/lib/mj-single.js` to have `ConfigureMathJax()` load it alongside other TeX extensions.
* integrate xyjax
  * xyjax does not currently work with mathjax-node, but the wrapper is set up so that you can still configure Lens to use MathJax's TeX inputprocessor alongside the MathML. This is not ideal and causes issues (e.g., if there's a label inside an xyjax environment).
