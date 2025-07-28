const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkDatabaseConnection() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'barang_db'
  };

  console.log('🔍 Checking database connection...');
  console.log(`Host: ${config.host}`);
  console.log(`User: ${config.user}`);
  console.log(`Database: ${config.database}`);

  let connection;

  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Database connection successful!');

    // Check if tables exist
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [config.database]);

    if (tables.length === 0) {
      console.log('⚠️  No tables found. Run: npm run setup-db');
      return;
    }

    console.log(`📊 Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`);
    });

    // Check sample data
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`   ${tableName}: ${rows[0].count} records`);
    }

    console.log('🚀 Database is ready! You can run: npm run dev');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);

    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database does not exist. Run: npm run setup-db');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Access denied. Check your credentials in .env.local');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Connection refused. Make sure MySQL server is running');
    }

  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkDatabaseConnection();
