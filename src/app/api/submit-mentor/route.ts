import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const MentorSchema = new mongoose.Schema({
  lastName: String,
  firstName: String,
  email: String,
  phone: String,
  github: String,
  itExperience: String,
  mentoringExperience: String,
  generalExperience: String,
});

const Mentor = mongoose.models.Mentor || mongoose.model("Mentor", MentorSchema);

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
    const mentor = new Mentor(body);
    await mentor.save();

    return NextResponse.json(
      { success: true, message: "Заявка успешно отправлена" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/submit-mentor:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Произошла ошибка при отправке заявки",
      },
      { status: 400 }
    );
  }
}