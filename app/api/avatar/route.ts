import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  const email = searchParams.get("email");

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "First name, last name, and email are required" },
      { status: 400 }
    );
  }

  const supabase = createClient();

  // Check if the user already has a color
  const { data: memberData, error: memberError } = await supabase
    .from("member")
    .select("avatar_color")
    .eq("email", email)
    .single();

  if (memberError) {
    return NextResponse.json(
      { error: "Error fetching member data" },
      { status: 500 }
    );
  }

  let backgroundColor = memberData.avatar_color;

  if (!backgroundColor) {
    // Generate a new color if one doesn't exist
    backgroundColor = generateRandomColor();

    // Save the new color to the database
    const { error: updateError } = await supabase
      .from("member")
      .update({ avatar_color: backgroundColor })
      .eq("email", email);

    if (updateError) {
      return NextResponse.json(
        { error: "Error updating member data" },
        { status: 500 }
      );
    }
  }

  const initials = getInitials(firstName, lastName);

  return NextResponse.json({ initials, backgroundColor });
}
