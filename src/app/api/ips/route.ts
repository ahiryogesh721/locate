import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import axios from "../../../../axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const res = await axios.get("http://localhost:3000/api/ip");
    const { ip } = await res.data;

    if (!ip) {
      return NextResponse.json({ message: "IP not found" }, { status: 400 });
    }

    if (await prisma.ips.findFirst({ where: { ip: ip } })) {
      return NextResponse.json(
        { message: "User already exists with this IP address" },
        { status: 200 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "Server error: Missing JWT secret" },
        { status: 500 }
      );
    }

    const token = jwt.sign({ ip: ip }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await prisma.ips.create({ data: { ip: ip } });

    const response = NextResponse.json(
      { message: "new user assiging new token", token },
      { status: 201 }
    );

    response.headers.set(
      "Set-Cookie",
      `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
    );

    return response;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const res = await prisma.ips.findMany();
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { message: "Invalid token", error: errorMessage },
      { status: 403 }
    );
  }
}
