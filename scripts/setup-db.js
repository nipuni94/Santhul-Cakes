const { db } = require('@vercel/postgres');

async function main() {
    const client = await db.connect();

    try {
        // Create the table if it doesn't exist
        // We use a simple table 'store_data' with a single column 'data' of type JSONB
        // The 'id' is a singleton lock (always 1) to ensure we only have one row of data.
        await client.sql`
      CREATE TABLE IF NOT EXISTS store_data (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL
      );
    `;

        console.log('✅ Table "store_data" created successfully.');

        // Check if data exists
        const { rows } = await client.sql`SELECT * FROM store_data WHERE id = 1;`;

        if (rows.length === 0) {
            console.log('ℹ️ No data found. initializing with empty object (application will seed default data on first run).');
            await client.sql`INSERT INTO store_data (id, data) VALUES (1, '{}');`;
        } else {
            console.log('ℹ️ Data already exists. Skipping initialization.');
        }

    } catch (error) {
        console.error('❌ Error setting up database:', error);
    } finally {
        // await client.end(); // client.end() is not needed/available in standard @vercel/postgres pool usage in some versions, but good practice if using raw client. 
        // However, for this script running in node, process exit is fine.
        process.exit(0);
    }
}

main();
