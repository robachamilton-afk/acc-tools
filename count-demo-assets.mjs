import { generateDemoAssets } from './server/demoData.js';

const assets = generateDemoAssets(1);
console.log(`Generated ${assets.length} assets`);

// Count by category
const byCategory = {};
assets.forEach(a => {
  byCategory[a.category] = (byCategory[a.category] || 0) + 1;
});
console.log('By category:', byCategory);
