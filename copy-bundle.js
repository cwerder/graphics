var fs = require('fs');

fs.copyFile('dist/bundle.js', 'public/js/bundle.js', (err) => {
    if (err) 
        throw err;
    console.log('dist/bundle.js was copied to public/js/bundle.js');
});