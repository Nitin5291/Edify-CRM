import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// GET: Download an audio file
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json(
        { message: "Missing fileName parameter." },
        { status: 400 }
      );
    }

    const { data } = await axios.get(
      `https://piopiy.telecmi.com/v1/play?appid=2226954&token=2f7c9d96-bb83-4ff6-b5cd-cc49a3dcf08a&file=${fileName}`,
      {
        responseType: "arraybuffer",
      }
    );

    // Set appropriate headers for file download
    const headers = new Headers({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `attachment; filename=${fileName}`,
    });

    return new NextResponse(data, { headers });
  } catch (error: any) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { message: "Error downloading file.", error: error.message },
      { status: 500 }
    );
  }
}
