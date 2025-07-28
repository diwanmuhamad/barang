const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  let connection;

  try {
    console.log('🔄 Connecting to MySQL...');
    connection = await mysql.createConnection(config);

    console.log('✅ Connected to MySQL successfully');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('🔄 Creating database and tables...');
    await connection.execute(schema);

    console.log('✅ Database setup completed successfully!');
    console.log('📊 Sample data has been inserted');
    console.log('🚀 You can now run: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Please check your database credentials in .env.local');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Please make sure MySQL server is running');
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

setupDatabase();
