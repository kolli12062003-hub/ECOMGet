const fs = require('fs');
const path = require('path');

function fixImageSrc(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Pattern to match src={`/IMAGES/${related.image}`}
    const pattern = /src=\{`\/IMAGES\/\$\{related\.image\}`\}/g;

    if (pattern.test(content)) {
      // Replace with getImageSrc(related.image) call
      content = content.replace(
        /src=\{`\/IMAGES\/\$\{related\.image\}`\}/g,
        'src={getImageSrc(related.image)}'
      );

      // Add the getImageSrc function if not already present
      if (!content.includes('const getImageSrc = (image) => {')) {
        // Find the component function start
        const componentMatch = content.match(/(const|function)\s+\w+\s*\([^)]*\)\s*=>\s*\{/);
        if (componentMatch) {
          const insertIndex = componentMatch.index + componentMatch[0].length;
          const getImageSrcFunction = `
    // Handle image source - check for uploaded files (with timestamps) vs static images
    const getImageSrc = (image) => {
        if (!image) {
            return \`https://via.placeholder.com/200x200?text=No+Image\`;
        }
        if (image.startsWith('http')) {
            return image;
        }
        // Check if it's an uploaded file (contains timestamp like "1234567890-filename.jpg")
        if (image.includes('-') && /^\\d+-\\w+\\./.test(image)) {
            return \`http://localhost:5000/uploads/\${image}\`;
        }
        // Otherwise, it's a static image in IMAGES folder
        return \`/IMAGES/\${image}\`;
    };
`;
          content = content.slice(0, insertIndex) + getImageSrcFunction + content.slice(insertIndex);
        }
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed related images in:', path.basename(filePath));
      }
    }
  } catch (error) {
    console.error('Error processing', filePath, error.message);
  }
}

// List of ProductDetail files to fix
const detailFilesToFix = [
  'src/Customer/Categories/Products/SportsFitness/SportsAndFitnessProductDetail.js',
  'src/Customer/Categories/Products/Watches/WatchesProductDetail.js',
  'src/Customer/Categories/Products/Organic/OrganicProductDetail.js',
  'src/Customer/Categories/Products/Musical/MusicalProductDetail.js',
  'src/Customer/Categories/Products/Medicine/MedicineProductDetail.js',
  'src/Customer/Categories/Products/Jewllery/JewelleryProductDetail.js',
  'src/Customer/Categories/Products/Groceries/GroceryProductDetail.js',
  'src/Customer/Categories/Products/Furniture/HomeFurnitureProductDetail.js',
  'src/Customer/Categories/Products/Fruits/FruitProductDetail.js',
  'src/Customer/Categories/Products/FoodDine/Food&Dine_ProductDetail.js',
  'src/Customer/Categories/Products/Footwear/FootwearProductDetail.js',
  'src/Customer/Categories/Products/Decor/HomeDecorProductDetail.js',
  'src/Customer/Categories/Products/Clothes/ClothesProductDetail.js',
  'src/Customer/Categories/Products/Books/BookProductDetail.js',
  'src/Customer/Categories/Products/Automotive/AutomotiveProductDetail.js',
  'src/Customer/Categories/Products/FoodDine/ProductDetail.js'
];

detailFilesToFix.forEach(fixImageSrc);
console.log('Batch fix for related images completed');
