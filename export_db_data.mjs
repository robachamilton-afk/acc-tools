import { db } from './server/db.js';
import { extractions, assets } from './drizzle/schema.js';
import fs from 'fs';

const allExtractions = await db.select().from(extractions);
const allAssets = await db.select().from(assets);

console.log(`Extractions: ${allExtractions.length}`);
console.log(`Assets: ${allAssets.length}`);

// Export as JSON
const data = {
  extractions: allExtractions,
  assets: allAssets
};

fs.writeFileSync('/tmp/db_export.json', JSON.stringify(data, null, 2));
console.log('Exported to /tmp/db_export.json');
process.exit(0);
