// lib/courses-data.js
import Course from '@/models/Course';
import dbConnect from '@/lib/database';

export async function getAllCourses() {
  try {
    await dbConnect();
    const courses = await Course.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    
    return courses.map(course => ({
      ...course,
      _id: course._id.toString(),
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getCourseBySlug(slug) {
  try {
    await dbConnect();
    const course = await Course.findOne({ slug, isActive: true }).lean();
    
    if (!course) return null;
    
    return {
      ...course,
      _id: course._id.toString(),
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export async function getCourseSlugsForSitemap() {
  try {
    await dbConnect();
    const courses = await Course.find({ isActive: true })
      .select('slug updatedAt')
      .lean();
    
    return courses.map(course => ({
      slug: course.slug,
      lastmod: course.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching course slugs:', error);
    return [];
  }
}

export async function getFeaturedCourses() {
  try {
    await dbConnect();
    const courses = await Course.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
    
    return courses.map(course => ({
      ...course,
      _id: course._id.toString(),
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    return [];
  }
}