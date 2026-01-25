/*import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const showSchema = new mongoose.Schema({
  movieId: String,
  theatreId: mongoose.Schema.Types.ObjectId,
  date: String,
  time: String,
  price: Number,
  seats: [{
    seatNumber: String,
    isBooked: { type: Boolean, default: false }
  }]
});

const Show = mongoose.model("Show", showSchema);

async function seedShows() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get today and next 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Your theatre ID from the screenshot
    const theatreId = "6974af56eefb527cb51aba40";
    const movieId = "1306368"; // Your movie ID

    const times = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
    
    // Generate 40 seats (5 rows x 8 seats)
    const generateSeats = () => {
      const seats = [];
      const rows = ['A', 'B', 'C', 'D', 'E'];
      for (let row of rows) {
        for (let seat = 1; seat <= 8; seat++) {
          seats.push({
            seatNumber: `${row}${seat}`,
            isBooked: false
          });
        }
      }
      return seats;
    };

    // Clear old shows
    await Show.deleteMany({});
    console.log("🗑️  Cleared old shows");

    // Create shows for next 7 days
    const shows = [];
    for (let date of dates) {
      for (let time of times) {
        shows.push({
          movieId,
          theatreId,
          date,
          time,
          price: 200,
          seats: generateSeats()
        });
      }
    }

    const result = await Show.insertMany(shows);
    console.log(`✅ Created ${result.length} shows`);
    console.log(`📅 Dates: ${dates[0]} to ${dates[dates.length-1]}`);
    console.log(`🎬 Movie ID: ${movieId}`);
    console.log(`🎭 Theatre ID: ${theatreId}`);
    console.log(`⏰ Times: ${times.join(', ')}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seedShows();*/

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const showSchema = new mongoose.Schema({
  movieId: String,
  theatreId: mongoose.Schema.Types.ObjectId,
  date: String,
  time: String,
  price: Number,
  seats: [{
    seatNumber: String,
    isBooked: { type: Boolean, default: false }
  }]
});

const Show = mongoose.model("Show", showSchema);

async function seedShows() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get today and next 6 days (7 days total)
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formatted = date.toISOString().split('T')[0];
      dates.push(formatted);
      console.log(`📅 Date ${i + 1}: ${formatted}`);
    }

    // Your theatre ID
    //const theatreId = "6974af56eefb527cb51aba40";
    const theatreId = "697512a45014b48749523cc0"; // ✅ MUST MATCH theatres collection

    const movieId = "1306368"; // Your movie ID

    const times = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
    
    // Generate 40 seats (5 rows x 8 seats)
    const generateSeats = () => {
      const seats = [];
      const rows = ['A', 'B', 'C', 'D', 'E'];
      for (let row of rows) {
        for (let seat = 1; seat <= 8; seat++) {
          seats.push({
            seatNumber: `${row}${seat}`,
            isBooked: false
          });
        }
      }
      return seats;
    };

    // Clear old shows for this movie and theatre
    await Show.deleteMany({ movieId, theatreId });
    console.log("🗑️  Cleared old shows for this movie/theatre");

    // Create shows for next 7 days
    const shows = [];
    for (let date of dates) {
      for (let time of times) {
        shows.push({
          movieId,
          theatreId: new mongoose.Types.ObjectId(theatreId),
          date,
          time,
          price: 200,
          seats: generateSeats()
        });
      }
    }

    const result = await Show.insertMany(shows);
    console.log(`\n✅ Created ${result.length} shows`);
    console.log(`📅 Dates: ${dates[0]} to ${dates[dates.length-1]}`);
    console.log(`🎬 Movie ID: ${movieId}`);
    console.log(`🎭 Theatre ID: ${theatreId}`);
    console.log(`⏰ Times: ${times.join(', ')}`);
    console.log(`💺 Seats per show: 40 (A1-E8)`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seedShows();