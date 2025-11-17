// app/courses/[slug]/register/layout.js
import { getCourseBySlug } from '@/lib/courses-data';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  
  if (!course) {
    return {
      title: "Course Not Found | Suma Automation",
    };
  }

  return {
    title: `Enroll in ${course.title} | Suma Automation`,
    description: `Register for ${course.title} - ${course.level} ${course.category} course.`,
  };
}

export default function RegisterLayout({ children }) {
  return children;
}