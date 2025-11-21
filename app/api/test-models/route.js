
import { NextResponse } from 'next/server';
import { connectDB, registerModels } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // Test basic connection
    const db = mongoose.connection;
    const collections = await db.db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      connection: '✅ Connected to MongoDB',
      database: db.db.databaseName,
      collections: collections.map(c => c.name),
      models: Object.keys(mongoose.models || {})
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      models: Object.keys(mongoose.models || {})
    }, { status: 500 });
  }
}