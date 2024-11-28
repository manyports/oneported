import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const HackathonTeamSchema = new mongoose.Schema({
  captainName: String,
  captainEmail: String,
  captainPhone: String,
  captainClass: String,
  captainSchool: String,
  teamName: String,
  teamSize: Number,

  teamMembers: [{
    name: String,
    email: String,
    phone: String,
    class: String,
    school: String
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HackathonTeam = mongoose.models.HackathonTeam || mongoose.model("HackathonTeam", HackathonTeamSchema);

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

    const teamSize = parseInt(body[7]);
    if (teamSize > 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Максимальный размер команды - 3 человека",
        },
        { status: 400 }
      );
    }

    const teamData = {
      captainName: body[1],
      captainEmail: body[2],
      captainPhone: body[3],
      captainClass: body[4],
      captainSchool: body[5],
      teamName: body[6],
      teamSize: parseInt(body[7]),
      teamMembers: []
    };

    for (let i = 2; i <= teamData.teamSize; i++) {
      teamData.teamMembers.push({
        name: body[`member${i}_name`],
        email: body[`member${i}_email`],
        phone: body[`member${i}_phone`],
        class: body[`member${i}_class`],
        school: body[`member${i}_school`]
      });
    }

    const team = new HackathonTeam(teamData);
    await team.save();

    return NextResponse.json(
      { success: true, message: "Команда успешно зарегистрирована" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/register-hackathon:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Произошла ошибка при регистрации команды",
      },
      { status: 400 }
    );
  }
} 