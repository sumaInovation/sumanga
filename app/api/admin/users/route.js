// app/api/admin/users/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options"
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// GET - Fetch all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const users = await User.find({}).select('name email role provider image lastLogin createdAt');
    
    return Response.json({ 
      success: true, 
      users: users.map(user => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        image: user.image,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update user role
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, role } = await request.json();
    
    if (!['user', 'staff', 'admin'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('name email role');

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      message: 'User role updated successfully',
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}