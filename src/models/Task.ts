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

const taskSchema = new Schema({
  date: { type: Date, required: true, default: Date.now },
  dailyMood: { type: String, required: true },
  energy: { type: Number, required: true },
  discomfort: { type: String, required: true },
  taskRemember: [String],
});


export default models.Task || mongoose.model('task', taskSchema);

export { dbConnect };

