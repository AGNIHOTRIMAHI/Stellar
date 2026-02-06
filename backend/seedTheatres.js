// seedTheatres.js
// Place this file in your backend folder (same level as server.js)
// Run with: npm run seed

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Theatre Schema
const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: String,
  screens: Number
});

const Theatre = mongoose.model("Theatre", theatreSchema);

// Sample Theatres Data
const sampleTheatres = [
  // Prayagraj
  { name: "PVR Vinayak", city: "Prayagraj", address: "Civil Lines", screens: 4 },
  { name: "Big Cinemas Galaxy", city: "Prayagraj", address: "Subhash Marg", screens: 3 },
  { name: "Natraj Cinema Hall", city: "Prayagraj", address: "Chowk Area", screens: 2 },
  { name: "Wave Cinemas", city: "Prayagraj", address: "Georgetown", screens: 5 },
  
  // Etawah
  { name: "Surya Cinema", city: "Etawah", address: "Gandhi Nagar", screens: 2 },
  { name: "Raj Talkies", city: "Etawah", address: "Main Road", screens: 3 },
  { name: "Shiva Cinema", city: "Etawah", address: "Civil Lines", screens: 2 },
  
  // Delhi
  { name: "PVR Saket", city: "Delhi", address: "Select Citywalk Mall", screens: 8 },
  { name: "Cinepolis DLF Place", city: "Delhi", address: "DLF Place Saket", screens: 6 },
  { name: "INOX Nehru Place", city: "Delhi", address: "Nehru Place", screens: 5 },
  { name: "PVR Priya", city: "Delhi", address: "Vasant Vihar", screens: 4 },
  
  // Mumbai
  { name: "PVR Phoenix", city: "Mumbai", address: "Lower Parel", screens: 10 },
  { name: "INOX Nariman Point", city: "Mumbai", address: "Nariman Point", screens: 7 },
  { name: "Cinepolis Andheri", city: "Mumbai", address: "Andheri West", screens: 8 },
  
  // Bangalore
  { name: "PVR Forum Mall", city: "Bangalore", address: "Koramangala", screens: 9 },
  { name: "Cinepolis Royal Meenakshi", city: "Bangalore", address: "Bannerghatta Road", screens: 8 },
  { name: "INOX Garuda Mall", city: "Bangalore", address: "Magrath Road", screens: 6 }
];

async function seedTheatres() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    console.log("📍 Database:", mongoose.connection.name);

    // Clear existing theatres (OPTIONAL - remove this if you want to keep existing data)
    const deleteResult = await Theatre.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing theatres`);

    // Insert sample theatres
    const result = await Theatre.insertMany(sampleTheatres);
    console.log(`\n✅ Successfully added ${result.length} theatres!`);

    // Display what was added
    const allTheatres = await Theatre.find({}).sort({ city: 1, name: 1 });
    console.log("\n📋 Theatres in database:\n");
    
    const grouped = allTheatres.reduce((acc, t) => {
      if (!acc[t.city]) acc[t.city] = [];
      acc[t.city].push(`${t.name} (${t.screens} screens)`);
      return acc;
    }, {});
    
    Object.keys(grouped).sort().forEach(city => {
      console.log(`📍 ${city}:`);
      grouped[city].forEach(name => console.log(`   - ${name}`));
      console.log();
    });

    console.log("✨ Seeding complete! You can now use your booking app.\n");
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

// Run the seed function
seedTheatres();