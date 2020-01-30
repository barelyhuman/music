rm -rf public
mkdir -p public
npm run compile
npm run browserify 
cp -r css public/
cp tags.js public/tags.js
cp index.html public/index.html
