import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { assets } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const allAssets = await db.select().from(assets).where(eq(assets.jobId, 1));

console.log(`Total assets for job 1: ${allAssets.length}`);
console.log(`\nSample assets:`);
allAssets.slice(0, 5).forEach(asset => {
  console.log(`- ${asset.assetName} (Location: ${asset.location})`);
});

console.log(`\nUnique locations:`);
const locations = new Set(allAssets.map(a => a.location).filter(Boolean));
console.log([...locations].sort().join(', '));

await connection.end();
