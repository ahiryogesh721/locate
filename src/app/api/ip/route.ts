import { NextResponse } from "next/server";
import axios from "../../../../axios";

export async function GET() {
  try {
    /* ipinfo */
    const ipinfoAPIKey = process.env.IPINFO_API_KEY;
    const res = await axios.get(`https://ipinfo.io?token=${ipinfoAPIKey}`);

    const data = await res.data;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching IP", error: error.message },
      { status: 500 }
    );
  }
}
