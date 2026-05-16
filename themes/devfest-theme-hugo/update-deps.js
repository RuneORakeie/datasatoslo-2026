const fs = require('fs');
const path = require('path');

const newPackageJson = {
  "name": "devfest-theme-hugo",
  "version": "1.0.0",
  "description": "Hugo theme for DevFest sites",
  "scripts": {
    "build": "npm run build:css && npm run build:js",
    "build:css": "postcss ./static/css/style.css -o ./static/css/style.min.css",
    "build:js": "rollup -c",
    "watch": "npm run watch:css & npm run watch:js",
    "watch:css": "NODE_ENV=development postcss ./static/css/style.css -o ./static/css/style.min.css -w",
    "watch:js": "rollup -c -w"
  },
  "dependencies": {
    "core-js": "^3.33.3"
  },
  "devDependencies": {
    "@babel/core": "^7.26.0",
    "@babel/preset-env": "^7.26.0",
    "@rollup/plugin-babel": "^6.0.4",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "@rollup/plugin-terser": "^0.4.4",
    "autoprefixer": "^10.4.16",
    "sass": "^1.71.1",
    "npm-run-all": "^4.1.5",
    "postcss": "^8.4.31",
    "postcss-cli": "^10.1.0",
    "postcss-preset-env": "^9.3.0",
    "rollup": "^4.5.0",
    "sass-mq": "^6.0.0",
    "stylelint": "^15.11.0",
    "lru-cache": "^10.0.1"
  },
  "resolutions": {
    "glob": "^10.3.10",
    "rimraf": "^5.0.5"
  },
  "browserslist": [
    "last 2 versions",
    "> 0.25%",
    "not dead"
  ]
}

// Write the new package.json
fs.writeFileSync('package.json', JSON.stringify(newPackageJson, null, 2));

console.log('New package.json created. Run npm install to generate updated package-lock.json');