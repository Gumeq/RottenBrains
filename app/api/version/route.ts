import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version:
      process.env.VERCEL_GIT_COMMIT_SHA ||
      "ad9628eb18a338acbaeeb945222452c3bacb2fa8",
  });
}
