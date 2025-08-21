import mongoose, { Schema, models } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mother';

// Create a global variable to hold the cached connection promise.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}


const nutrtionsSchema = new Schema({
  fullName: { type: String, required: true },
  days: { type: Number, required: true },
  firstPreg: { type: Boolean, required: true },
  complications: { type: String },
  conditions: { type: String },
  medicines: { type: String },

});

export default models.UserProfile || mongoose.model('nutrition', nutrtionsSchema);

export { dbConnect };

