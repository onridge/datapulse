import mongoose from "mongoose";

const clientOptions = {
  serverApi: { version: "1" as const, strict: true, deprecationErrors: true },
};

async function connectDB() {
  const uri = process.env.MONGO_URI; // ← читаем ВНУТРИ функции, не снаружи

  if (!uri) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(uri, clientOptions);
  console.log("MongoDB connected!");
}

export default connectDB;
