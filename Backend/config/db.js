import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb terhubung ${conn.connection.host}`);
  } catch (error) {
    console.error(`koneksi DB ${error.message}`);
    process.exit(1); // Keluar dari proses dengan status gagal
  }
};

export default connectDB;
