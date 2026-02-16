// navigationUtils.js

export const handleCategoryNavigation = (categoryName, navigateTo) => {
    let pageToNavigate = '';

    switch (categoryName) {
        case 'Food & Dining':
            pageToNavigate = 'food';
            break;
        case 'Medicines':
            pageToNavigate = 'medicines';
            break;
        case 'Automotive':
            pageToNavigate = 'automotive';
            break;
        case 'Services':
            pageToNavigate = 'services';
            break;
        case 'Home Decor': // This is the new mapping
            pageToNavigate = 'homedecor';
            break;
        // Add more cases for other categories as needed
        // For categories that don't have a dedicated page yet, you might navigate to a generic product list or home
        default:
            // Attempt to convert category name to a lowercase, hyphenated string for navigation
            pageToNavigate = categoryName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '');
            break;
    }
    navigateTo(pageToNavigate);
};