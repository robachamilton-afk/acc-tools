import { getDb } from './server/db';
import { extractionJobs, assets } from './drizzle/schema';
import fs from 'fs';

async function exportData() {
  const db = await getDb();
  if (!db) {
    console.error('Failed to connect to database');
    process.exit(1);
  }

  const allExtractions = await db.select().from(extractionJobs);
  const allAssets = await db.select().from(assets);

  console.log(`Extraction Jobs: ${allExtractions.length}`);
  console.log(`Assets: ${allAssets.length}`);

  // Export as JSON
  const data = {
    extractionJobs: allExtractions,
    assets: allAssets
  };

  fs.writeFileSync('/tmp/db_export.json', JSON.stringify(data, null, 2));
  console.log('Exported to /tmp/db_export.json');
  process.exit(0);
}

exportData();
