const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../frontend/public/produk 22mart');
const outputBaseDir = path.join(__dirname, '../frontend/public/images/products');
const outputJsonFile = path.join(__dirname, 'prisma/products.json');

// Ensure output dir exists
if (!fs.existsSync(outputBaseDir)) {
    fs.mkdirSync(outputBaseDir, { recursive: true });
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function processDirectory(dirPath, categorySlug, productsArray) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            // Recursively process nested directories
            processDirectory(itemPath, categorySlug, productsArray);
        } else {
            // It's a file
            const ext = path.extname(item).toLowerCase();
            // Only process images
            if (['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext)) {
                let name = path.basename(item, ext);
                name = name.trim();
                const slug = slugify(name);

                const catDir = path.join(outputBaseDir, categorySlug);
                if (!fs.existsSync(catDir)) {
                    fs.mkdirSync(catDir, { recursive: true });
                }

                let newFileName = `${slug}${ext}`;
                let counter = 1;
                while (fs.existsSync(path.join(catDir, newFileName))) {
                    newFileName = `${slug}-${counter}${ext}`;
                    counter++;
                }

                const newFilePath = path.join(catDir, newFileName);

                // Copy the file
                fs.copyFileSync(itemPath, newFilePath);

                // Deterministic but varied price between 5000 and 100000
                const price = Math.floor(Math.random() * (100 - 5) + 5) * 1000;
                const stock = Math.floor(Math.random() * 90) + 10;

                productsArray.push({
                    name: name,
                    slug: newFileName.replace(ext, ''), // true slug
                    description: name + ' dengan kualitas terbaik untuk kebutuhan Anda.',
                    price: price,
                    stock: stock,
                    images: [`/images/products/${categorySlug}/${newFileName}`],
                    categorySlug: categorySlug,
                    isActive: true
                });
            }
        }
    }
}

const categoryFolders = fs.readdirSync(inputDir);
const products = [];

for (const folder of categoryFolders) {
    const folderPath = path.join(inputDir, folder);
    if (fs.statSync(folderPath).isDirectory()) {
        let catSlug = slugify(folder);
        if (folder === 'mie & makanan instan') {
            catSlug = 'mie-makanan-instan';
        } else if (folder === 'aksesoris elektronik') {
            catSlug = 'aksesoris-elektronik';
        } else if (folder === 'Fresh Food') {
            catSlug = 'fresh-food';
        } else if (folder === 'ice cream') {
            catSlug = 'ice-cream';
        } else if (folder === 'Kebutuhan Dapur') {
            catSlug = 'kebutuhan-dapur';
        }

        processDirectory(folderPath, catSlug, products);
    }
}

fs.writeFileSync(outputJsonFile, JSON.stringify(products, null, 2));
console.log(`Successfully processed ${products.length} images into ${outputJsonFile}`);
