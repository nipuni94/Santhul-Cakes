const { Pool } = require('pg');

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ Error: DATABASE_URL environment variable is slightly required.');
        console.error('   Usage: DATABASE_URL="postgres://..." node scripts/setup-neon.js');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        console.log('✅ Connected to Postgres.');

        // Create the table if it doesn't exist
        // We use a simple table 'store_data' with a single column 'data' of type JSONB
        // The 'id' is a singleton lock (always 1) to ensure we only have one row of data.
        await client.query(`
      CREATE TABLE IF NOT EXISTS store_data (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL
      );
    `);

        console.log('✅ Table "store_data" created successfully.');

        // Check if data exists
        const { rows } = await client.query('SELECT * FROM store_data WHERE id = 1');

        if (rows.length === 0) {
            console.log('ℹ️ No data found. Application will seed default data on first run.');
            // Optional: Pre-seed if desired, but app logic handles it.
            // await client.query(`INSERT INTO store_data (id, data) VALUES (1, '{}')`);
        } else {
            console.log('ℹ️ Data already exists. Skipping initialization.', rows[0].data ? '(Data present)' : '(Empty)');
        }

        client.release();

    } catch (error) {
        console.error('❌ Error setting up database:', error);
    } finally {
        await pool.end();
    }
}

main();
