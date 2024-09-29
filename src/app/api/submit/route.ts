import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { stringify } from "querystring";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const UserSchema = new mongoose.Schema({
  lastName: String,
  firstName: String,
  phone: String,
  school: String,
  class: String,
  programmingBackground: String,
  bio: String,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function dbConnect(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    const body = await req.json();
    const user = new User(body);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Пользователь успешно зарегистрирован" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/submit:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Произошла ошибка при регистрации пользователя",
      },
      { status: 400 }
    );
  }
}
