const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'mytestdb';

async function clearDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    // Clear or drop collections as needed
    await db.collection('items').deleteMany({});
    await db.collection('users').drop();

    console.log('Database cleared successfully.');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await client.close();
  }
}

clearDatabase();
