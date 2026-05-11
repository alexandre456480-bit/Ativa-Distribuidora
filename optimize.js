const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'assets') {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Add loading='lazy' to all imgs without loading or fetchpriority
            content = content.replace(/<img(?![^>]*loading=)(?![^>]*fetchpriority=)([^>]+)>/gi, '<img loading="lazy"$1>');
            
            // Add preload for Google Fonts if not exists
            if (!content.includes('rel="preload" href="https://fonts.googleapis.com')) {
                content = content.replace('<link rel="preconnect" href="https://fonts.googleapis.com">', 
                '<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600&family=Outfit:wght@500;600&display=swap">');
            }
            
            fs.writeFileSync(fullPath, content);
            console.log('Optimized: ' + fullPath);
        }
    }
}
processDir('.');
