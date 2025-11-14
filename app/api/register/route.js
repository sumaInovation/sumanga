
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return new Response(JSON.stringify({ redirect: "/login?message=already_registered" }), { status: 200 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  return new Response(JSON.stringify({ redirect: "/login?message=registered_successfully" }), { status: 201 });
}
