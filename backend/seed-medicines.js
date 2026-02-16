
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/shopnest?appName=Cluster1';

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const dbName = new URL(MONGODB_URI).pathname.replace('/', '') || 'ecom_shopnest';
    const db = client.db(dbName);

    const categories = db.collection('categories');
    const products = db.collection('products');

    // Ensure indexes
    await categories.createIndex({ name: 1 }, { unique: true });
    await products.createIndex({ category: 1 });

    // Upsert category
    const category = {
      name: 'Medicines',
      description: 'Health and wellness products including vitamins, supplements, and medical supplies.',
      image: 'medicine-hero.jpg',
      status: 'active',
      updatedAt: new Date(),
    };

    let catName = 'Medicines';
    const existingCat = await categories.findOne({ name: catName });
    if (existingCat) {
      await categories.updateOne({ _id: existingCat._id }, { $set: category });
    } else {
      category.createdAt = new Date();
      await categories.insertOne(category);
    }

    // Products list
    const productsData = [
      { "id": 1401, "name": "Vitamin D3 2000IU", "price": 49, "vendor": "MediCare Pharmacy", "category": "Medicines", "image": "Vitamin D3 2000IU1.jpeg", "type": "Tablet", "description": "Vitamin D3 2000IU is essential for bone health, immune function, and calcium absorption. Benefits include stronger bones and reduced risk of deficiency. Precautions: Consult a doctor if pregnant, nursing, or on medication.", "lat": 17.4486, "lon": 78.3908 },
      { "id": 1402, "name": "Pain Relief", "price": 129, "vendor": "HealthPlus", "category": "Medicines", "image": "pain relif.jpg", "type": "Capsule", "description": "Pain Relief capsules provide fast relief from headaches, muscle pain, and inflammation. Benefits: Effective pain management without drowsiness. Precautions: Do not exceed recommended dosage; avoid if allergic to NSAIDs.", "lat": 17.4512, "lon": 78.3855 },
      { "id": 1403, "name": "Vitamin C 1000mg", "price": 299, "vendor": "NutriWell", "category": "Medicines", "image": "Vitamin-C-1000-mg-20-tablets-Orange_o.jpg", "type": "Supplement", "description": "Vitamin C 1000mg supplement boosts immunity, collagen production, and antioxidant protection. Benefits: Enhanced immune response and skin health. Precautions: High doses may cause stomach upset; consult a doctor if on blood thinners.", "lat": 17.4421, "lon": 78.3882 },
      { "id": 1404, "name": "Blood Pressure Monitor", "price": 1499, "vendor": "MediTech", "category": "Medicines", "image": "BPMonitor.jpg", "type": "Medical Device", "description": "Blood Pressure Monitor accurately measures systolic and diastolic pressure at home. Benefits: Helps monitor hypertension and prevent complications. Precautions: Ensure proper cuff size; consult a healthcare provider for interpretation.", "lat": 17.4550, "lon": 78.3920 },
      { "id": 1405, "name": "Atorvastatin 10mg", "price": 189, "vendor": "PharmaCare", "category": "Medicines", "image": "Atorvastatin.jpg", "type": "Tablet", "description": "Atorvastatin 10mg lowers cholesterol levels and reduces the risk of cardiovascular disease. Benefits: Reduces LDL cholesterol and triglyceride levels. Precautions: May cause muscle pain; monitor liver function; avoid grapefruit juice.", "lat": 17.4399, "lon": 78.4421 },
      { "id": 1406, "name": "Omeprazole 20mg", "price": 159, "vendor": "MediExpress", "category": "Medicines", "image": "Omeprazole.jpg", "type": "Capsule", "description": "Omeprazole 20mg reduces stomach acid production for acid reflux and ulcers. Benefits: Relieves heartburn and promotes healing. Precautions: Long-term use may affect vitamin B12 absorption; consult a doctor if symptoms persist.", "lat": 17.4455, "lon": 78.3800 },
      { "id": 1407, "name": "Diabetes Test Strips", "price": 799, "vendor": "DiabeCare", "category": "Medicines", "image": "TestStrips.jpg", "type": "Medical Supply", "description": "Diabetes Test Strips measure blood glucose levels for diabetes management. Benefits: Enables self-monitoring and better control. Precautions: Use with a compatible glucometer; store properly to maintain accuracy.", "lat": 17.4480, "lon": 78.3890 },
      { "id": 1408, "name": "Metformin 500mg", "price": 99, "vendor": "HealthFirst", "category": "Medicines", "image": "Metformin.jpg", "type": "Tablet", "description": "Metformin 500mg helps control blood sugar in type 2 diabetes. Benefits: Improves insulin sensitivity and reduces glucose production. Precautions: May cause digestive side effects; monitor kidney function.", "lat": 17.4520, "lon": 78.3870 },
      { "id": 1409, "name": "First Aid Kit", "price": 499, "vendor": "SafeLife", "category": "Medicines", "image": "FirstAidKit.jpg", "type": "Medical Kit", "description": "First Aid Kit contains essential supplies for minor injuries and emergencies. Benefits: Quick response for cuts, burns, and sprains. Precautions: Check expiration dates; restock used items regularly.", "lat": 17.4400, "lon": 78.3850 },
      { "id": 1410, "name": "Ibuprofen 400mg", "price": 79, "vendor": "QuickMeds", "category": "Medicines", "image": "ibprofen 400mg.jpg", "type": "Tablet", "description": "Ibuprofen 400mg relieves pain, fever, and inflammation. Benefits: Effective for arthritis and menstrual cramps. Precautions: Avoid if allergic to NSAIDs; long-term use may increase heart risks.", "lat": 17.4490, "lon": 78.3950 },
      { "id": 1411, "name": "Vitamin D3 1000IU", "price": 349, "vendor": "WellnessPlus", "category": "Medicines", "image": "VitaminD3.jpg", "type": "Supplement", "description": "Vitamin D3 1000IU supports bone density and immune health. Benefits: Prevents rickets and osteomalacia. Precautions: Overdose can cause hypercalcemia; consult a doctor for dosage.", "lat": 17.4550, "lon": 78.3920 },
      { "id": 1412, "name": "Thermometer Digital", "price": 249, "vendor": "HealthGadgets", "category": "Medicines", "image": "Thermometer.jpg", "type": "Medical Device", "description": "Digital Thermometer provides accurate body temperature readings. Benefits: Fast and hygienic measurement. Precautions: Clean after use; ensure battery is functional.", "lat": 17.4430, "lon": 78.3860 },
      { "id": 1413, "name": "Cetirizine 10mg", "price": 59, "vendor": "AllergyCare", "category": "Medicines", "image": "Cetirizine.jpg", "type": "Tablet", "description": "Cetirizine 10mg reduces allergy symptoms like runny nose and itching. Benefits: Non-drowsy antihistamine for hay fever. Precautions: May cause dry mouth; avoid alcohol.", "lat": 17.4500, "lon": 78.3840 },
      { "id": 1414, "name": "Nebulizer Machine", "price": 1899, "vendor": "BreathEasy", "category": "Medicines", "image": "Nebulizer.jpg", "type": "Medical Equipment", "description": "Nebulizer Machine converts liquid medicine into a mist for respiratory treatment. Benefits: Effective for asthma and COPD. Precautions: Clean regularly; use only prescribed medications.", "lat": 17.4470, "lon": 78.3910 },
      { "id": 1415, "name": "Aspirin 75mg", "price": 69, "vendor": "HeartCare", "category": "Medicines", "image": "Aspirin.jpg", "type": "Tablet", "description": "Aspirin 75mg prevents blood clots and reduces the risk of heart attack. Benefits: Anti-platelet action for cardiovascular disease. Precautions: May cause stomach bleeding; not for everyone; consult a doctor.", "lat": 17.4400, "lon": 78.3850 }
    ];

    for (const p of productsData) {
      const doc = {
        ...p,
        updatedAt: new Date(),
      };
      const existing = await products.findOne({ name: p.name, category: catName });
      if (existing) {
        await products.updateOne({ _id: existing._id }, { $set: doc });
      } else {
        doc.createdAt = new Date();
        await products.insertOne(doc);
      }
    }

    console.log('Medicines category and products seeded successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
