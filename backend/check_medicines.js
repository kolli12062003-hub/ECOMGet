const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const medicines = await products.find({ category: 'Medicines' }).toArray();
    console.log('Total medicines:', medicines.length);
    const activeMedicines = medicines.filter(m => m.status === 'active');
    console.log('Active medicines:', activeMedicines.length);
    const inactiveMedicines = medicines.filter(m => m.status === 'inactive');
    console.log('Inactive medicines:', inactiveMedicines.length);
    const noStatusMedicines = medicines.filter(m => !m.status);
    console.log('Medicines without status:', noStatusMedicines.length);
  } finally {
    await client.close();
  }
}

check().catch(console.error);
