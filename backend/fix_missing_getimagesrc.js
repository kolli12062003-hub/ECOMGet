const fs = require('fs');
const path = require('path');

function checkAndFixMissingGetImageSrc(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Check if file uses getImageSrc() but doesn't define it
    if (content.includes('src={getImageSrc()}') && !content.includes('const getImageSrc = () => {')) {
      console.log('Found missing getImageSrc in:', path.basename(filePath));

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
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', path.basename(filePath));
      }
    }
  } catch (error) {
    console.error('Error processing', filePath, error.message);
  }
}

// Check all the files that were supposedly fixed
const filesToCheck = [
  'src/Customer/Categories/Products/Bags/BagCard.js',
  'src/Customer/Categories/Products/Petfood/PetfoodCard.js',
  'src/Customer/Categories/Products/Organic/OrganicCard.js',
  'src/Customer/Categories/Products/Musical/MusicalCard.js',
  'src/Customer/Categories/Products/Furniture/HomeFurnitureCard.js',
  'src/Customer/Categories/Products/Fruits/FruitCard.js',
  'src/Customer/Categories/Products/Footwear/FootwearCard.js',
  'src/Customer/Categories/Products/Decor/HomeDecorCard.js',
  'src/Customer/Categories/Products/Clothes/ClothesCard.js',
  'src/Customer/Categories/Products/Books/BookCard.js'
];

filesToCheck.forEach(checkAndFixMissingGetImageSrc);
console.log('Check and fix completed');
