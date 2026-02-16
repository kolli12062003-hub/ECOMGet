const fs = require('fs');
const path = require('path');

function fixImageSrc(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Pattern to match src={`/IMAGES/${product.image}`}
    const pattern = /src=\{`\/IMAGES\/\$\{product\.image\}`\}/g;

    if (pattern.test(content)) {
      // Replace with getImageSrc() call
      content = content.replace(
        /src=\{`\/IMAGES\/\$\{product\.image\}`\}/g,
        'src={getImageSrc()}'
      );

      // Add the getImageSrc function if not already present
      if (!content.includes('const getImageSrc = () => {')) {
        // Find the component function start
        const componentMatch = content.match(/(const|function)\s+\w+\s*\([^)]*\)\s*=>\s*\{/);
        if (componentMatch) {
          const insertIndex = componentMatch.index + componentMatch[0].length;
          const getImageSrcFunction = `
    // Handle image source - check for uploaded files (with timestamps) vs static images
    const getImageSrc = () => {
        if (!product.image) {
            return \`https://via.placeholder.com/200x200?text=\${product.name.replace(/\\s/g, '+')}\`;
        }
        if (product.image.startsWith('http')) {
            return product.image;
        }
        // Check if it's an uploaded file (contains timestamp like "1234567890-filename.jpg")
        if (product.image.includes('-') && /^\\d+-\\w+\\./.test(product.image)) {
            return \`http://localhost:5000/uploads/\${product.image}\`;
        }
        // Otherwise, it's a static image in IMAGES folder
        return \`/IMAGES/\${product.image}\`;
    };
`;
          content = content.slice(0, insertIndex) + getImageSrcFunction + content.slice(insertIndex);
        }
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', path.basename(filePath));
      }
    }
  } catch (error) {
    console.error('Error processing', filePath, error.message);
  }
}

// List of files to fix
const filesToFix = [
  'src/Customer/Categories/Products/Bags/BagCard.js',
  'src/Customer/Categories/Products/Petfood/PetfoodCard.js',
  'src/Customer/Categories/Products/Organic/OrganicCard.js',
  'src/Customer/Categories/Products/Musical/MusicalCard.js',
  'src/Customer/Categories/Products/Furniture/HomeFurnitureCard.js',
  'src/Customer/Categories/Products/Fruits/FruitCard.js',
  'src/Customer/Categories/Products/Footwear/FootwearCard.js',
  'src/Customer/Categories/Products/Decor/HomeDecorCard.js',
  'src/Customer/Categories/Products/Clothes/ClothesCard.js',
  'src/Customer/Categories/Products/Books/BookCard.js',
  'src/Customer/Categories/Products/Automotive/AutomotiveCard.js'
];

filesToFix.forEach(fixImageSrc);
console.log('Batch fix completed');
