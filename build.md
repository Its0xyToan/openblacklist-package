## Bundling the module

```
npm i -d rollup
rollup src/index.js --file build/bundle.cjs --format cjs
rollup src/index.js --file build/bundle.js --format esm
```