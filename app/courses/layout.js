// app/courses/layout.js
export const metadata = {
  title: 'Professional Courses - PLC & Robotics Programming',
  description: 'Learn industrial automation, PLC programming, robotics, and automation with expert-led courses from Suma Automation Sri Lanka.',
};

export default function CoursesLayout({ children }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}