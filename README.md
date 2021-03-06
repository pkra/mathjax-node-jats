# mathjax-node-jats

A simple tool for pre-processing JATS-like XML, converting `tex-math` to MathML using mathjax-node. The target renderer is Lens Reader.

* clone the repo and run `npm install` in the resulting folder.
* Make a symlink `data` to a folder with some XML files.
* Run `make getXML && make process`
* Move the resulting `post-*` files where you need them.

PRs welcome.

## TODO

* integrate xyjax
  * xyjax does not currently work with mathjax-node, but the wrapper is set up so that you can still configure Lens to use MathJax's TeX input processor alongside the MathML. This is not ideal and causes issues (e.g., if there's a label inside an xyjax environment, Lens expects MathML with a corresponding id).

## Notes

* `img.js` integration
 * the post-install script jumps through a couple of hoops due to limitations of MathJax, mathjax-node and jsdom.
    * download [img.js](https://raw.githubusercontent.com/mathjax/MathJax-third-party-extensions/master/img/unpacked/img.js)
    * move it to `node_modules/MathJax/unpacked/extensions/TeX/`
    * change the `loadComplete` call at the end of `img.js` to `["loadComplete",MathJax.Ajax,"[MathJax]/extensions/TeX/img.js"]`
    * modify `node_module/mathjax-node/lib/mj-single.js` to have `ConfigureMathJax()` load it alongside other TeX extensions, i.e., `TeX: {extensions: window.Array("AMSmath.js","AMSsymbols.js","autoload-all.js", "img.js")},
`
