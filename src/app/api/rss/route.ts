import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("RSS feed disabled because blog is disabled.", {
    status: 404,
  });
}
