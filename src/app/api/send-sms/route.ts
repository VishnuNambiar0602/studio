
import { sendSms } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, body } = await request.json();

    if (!to || !body) {
      return NextResponse.json(
        { success: false, message: "Missing 'to' or 'body' in request." },
        { status: 400 }
      );
    }

    const result = await sendSms(to, body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "SMS sent successfully.",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to send SMS.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
