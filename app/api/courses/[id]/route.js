
// app/api/courses/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET(request, { params }) {
  try {
    console.log('🔍 GET /api/courses/[id] called');
    
    const { id } = await params;
    
    console.log('📋 Course ID from params:', id);
    console.log('📋 Type of ID:', typeof id);

    // Validate ID
    if (!id || id === 'undefined' || id === 'null' || id === '[id]') {
      console.log('❌ Invalid course ID:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Valid course ID is required',
          receivedId: id 
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if ID is a valid MongoDB ObjectId
    const mongoose = await import('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ Invalid MongoDB ObjectId:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid course ID format',
          receivedId: id 
        },
        { status: 400 }
      );
    }

    console.log('📖 Finding course in database with ID:', id);
    const course = await Course.findById(id).lean();

    if (!course) {
      console.log('❌ Course not found with ID:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Course not found',
          receivedId: id 
        },
        { status: 404 }
      );
    }

    console.log('✅ Course found:', course.title);
    console.log('🎁 Raw specialOffers from DB:', course.specialOffers);
    console.log('🎁 Raw specialOffer from DB:', course.specialOffer);

    // ✅ FIXED: Handle specialOffers array from MongoDB
    let specialOfferData;
    
    if (course.specialOffers && course.specialOffers.length > 0) {
      // Find the first active offer
      const activeOffer = course.specialOffers.find(offer => offer.isActive === true);
      if (activeOffer) {
        // Calculate discount percentage based on discountType
        let discountPercentage = 0;
        if (activeOffer.discountType === 'percentage') {
          discountPercentage = activeOffer.discountValue || 0;
        } else if (activeOffer.discountType === 'fixed' && course.baseFees > 0) {
          // Convert fixed amount to percentage
          discountPercentage = Math.round((activeOffer.discountValue / course.baseFees) * 100);
        }
        
        specialOfferData = {
          isActive: true,
          discountPercentage: discountPercentage,
          offerPrice: activeOffer.discountType === 'fixed' 
            ? (course.baseFees - activeOffer.discountValue)
            : (course.baseFees - (course.baseFees * discountPercentage / 100)),
          validUntil: activeOffer.validUntil || null,
          title: activeOffer.title,
          description: activeOffer.description,
          discountType: activeOffer.discountType,
          discountValue: activeOffer.discountValue,
          validFrom: activeOffer.validFrom
        };
        console.log('✅ Using active offer from specialOffers array:', activeOffer);
        console.log('💰 Calculated discount:', discountPercentage + '%');
      } else {
        specialOfferData = {
          isActive: false,
          discountPercentage: 0,
          offerPrice: 0,
          validUntil: null
        };
        console.log('❌ No active offers found in specialOffers array');
      }
    } else {
      specialOfferData = {
        isActive: false,
        discountPercentage: 0,
        offerPrice: 0,
        validUntil: null
      };
      console.log('❌ No specialOffers array found');
    }

    const courseData = {
      ...course,
      _id: course._id.toString(),
      videoCollections: course.videoCollections || [],
      syllabus: course.syllabus || [],
      equipmentUsed: course.equipmentUsed || [],
      softwareUsed: course.softwareUsed || [],
      prerequisites: course.prerequisites || [],
      tags: course.tags || [],
      gallery: course.gallery || [],
      batches: course.batches || [],
      enrolledStudents: course.enrolledStudents || [],
      duration: course.duration || {
        totalDays: 0,
        totalHours: 0,
        theoryHours: 0,
        practicalHours: 0,
        perDayHours: 3
      },
      // ✅ Use the processed special offer data
      specialOffer: specialOfferData,
      nextBatchStartDate: course.nextBatchStartDate || null
    };

    console.log('📹 Video collections count:', courseData.videoCollections.length);
    console.log('📚 Syllabus days:', courseData.syllabus.length);
    console.log('🎁 Final Special Offer Data:', {
      isActive: courseData.specialOffer.isActive,
      discountPercentage: courseData.specialOffer.discountPercentage + '%',
      offerPrice: courseData.specialOffer.offerPrice,
      validUntil: courseData.specialOffer.validUntil
    });
    console.log('📅 Next Batch Date:', courseData.nextBatchStartDate);

    return NextResponse.json({ 
      success: true, 
      course: courseData 
    });

  } catch (error) {
    console.error('❌ Error in GET /api/courses/[id]:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch course',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    await connectDB();
    
    const updates = await request.json();

    console.log('🔄 Updating course with ID:', id);
    console.log('🎁 Special Offer Data from request:', updates.specialOffer);
    console.log('🎁 Special Offers Data from request:', updates.specialOffers);
    console.log('📅 Next Batch Date:', updates.nextBatchStartDate);
    console.log('📚 Syllabus data:', updates.syllabus?.length, 'days');

    // ✅ FIXED: Handle both specialOffer (object) and specialOffers (array) from frontend
    let processedSpecialOffers = [];
    
    if (updates.specialOffer && updates.specialOffer.isActive) {
      // Convert single specialOffer to specialOffers array format
      processedSpecialOffers = [{
        title: updates.specialOffer.title || 'Special Offer',
        description: updates.specialOffer.description || '',
        discountType: updates.specialOffer.discountType || 'percentage',
        discountValue: Number(updates.specialOffer.discountValue) || 0,
        validFrom: updates.specialOffer.validFrom || new Date(),
        validUntil: updates.specialOffer.validUntil || null,
        isActive: Boolean(updates.specialOffer.isActive)
      }];
    } else if (updates.specialOffers && Array.isArray(updates.specialOffers)) {
      // Use the specialOffers array directly
      processedSpecialOffers = updates.specialOffers.map(offer => ({
        title: offer.title || 'Special Offer',
        description: offer.description || '',
        discountType: offer.discountType || 'percentage',
        discountValue: Number(offer.discountValue) || 0,
        validFrom: offer.validFrom || new Date(),
        validUntil: offer.validUntil || null,
        isActive: Boolean(offer.isActive)
      }));
    }

    const processedUpdates = {
      ...updates,
      // ✅ Store as specialOffers array in MongoDB
      specialOffers: processedSpecialOffers,
      // ✅ FIXED: Process next batch date - convert empty string to null
      nextBatchStartDate: updates.nextBatchStartDate || null,
      // ✅ FIXED: Process other numeric fields
      baseFees: parseInt(updates.baseFees) || 0,
      // ✅ FIXED: Process duration fields
      duration: updates.duration ? {
        totalDays: parseInt(updates.duration.totalDays) || 0,
        totalHours: parseInt(updates.duration.totalHours) || 0,
        theoryHours: parseInt(updates.duration.theoryHours) || 0,
        practicalHours: parseInt(updates.duration.practicalHours) || 0,
        perDayHours: parseInt(updates.duration.perDayHours) || 3
      } : {
        totalDays: 0,
        totalHours: 0,
        theoryHours: 0,
        practicalHours: 0,
        perDayHours: 3
      },
      // ✅ FIXED: Process arrays to ensure they exist
      equipmentUsed: Array.isArray(updates.equipmentUsed) ? updates.equipmentUsed : [],
      softwareUsed: Array.isArray(updates.softwareUsed) ? updates.softwareUsed : [],
      prerequisites: Array.isArray(updates.prerequisites) ? updates.prerequisites : [],
      tags: Array.isArray(updates.tags) ? updates.tags : [],
      gallery: Array.isArray(updates.gallery) ? updates.gallery : [],
      videoCollections: Array.isArray(updates.videoCollections) ? updates.videoCollections : [],
      syllabus: Array.isArray(updates.syllabus) ? updates.syllabus : []
    };

    // Remove the single specialOffer object since we're storing as array
    delete processedUpdates.specialOffer;

    console.log('🔄 Processed updates for saving:', {
      specialOffers: processedUpdates.specialOffers,
      nextBatchStartDate: processedUpdates.nextBatchStartDate,
      baseFees: processedUpdates.baseFees,
      equipmentCount: processedUpdates.equipmentUsed?.length,
      softwareCount: processedUpdates.softwareUsed?.length,
      syllabusDays: processedUpdates.syllabus?.length
    });

    // ✅ FIXED: Use findByIdAndUpdate with proper options
    const course = await Course.findByIdAndUpdate(
      id,
      { 
        $set: processedUpdates 
      },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    if (!course) {
      console.log('❌ Course not found with ID:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Course not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Course updated successfully');
    console.log('✅ Saved Special Offers:', course.specialOffers);
    console.log('✅ Saved Next Batch Date:', course.nextBatchStartDate);
    console.log('✅ Saved Base Fees:', course.baseFees);

    return NextResponse.json({ 
      success: true, 
      course,
      message: 'Course updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating course:', error);
    
    // ✅ IMPROVED: Better error handling with more details
    let errorMessage = 'Failed to update course';
    let statusCode = 500;
    
    if (error.name === 'ValidationError') {
      errorMessage = 'Validation failed: ' + Object.values(error.errors).map(e => e.message).join(', ');
      statusCode = 400;
    } else if (error.name === 'CastError') {
      errorMessage = 'Invalid course ID format';
      statusCode = 400;
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await connectDB();

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Course not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Course deleted successfully:', course.title);

    return NextResponse.json({ 
      success: true, 
      message: 'Course deleted successfully',
      deletedCourse: {
        id: course._id,
        title: course.title,
        code: course.code
      }
    });

  } catch (error) {
    console.error('❌ Error deleting course:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete course: ' + error.message 
      },
      { status: 500 }
    );
  }
}