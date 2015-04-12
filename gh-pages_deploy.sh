#!/bin/bash
SCRIPT=`cat bundle.js`
`git checkout gh-pages`
echo $SCRIPT > bundle.js
`git add bundle.js`
`git checkout master -- main.css`
`git checkout master -- index.html`
`git commit -m 'deploy'`
`git push origin gh-pages`
`git checkout master`