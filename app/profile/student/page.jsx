import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { User, Registration, Course } from "@/lib/model-registry";
import StudentPaymentButton from "@/components/StudentPaymentButton";

async function getStudentData() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  try {
    await connectDB();

    console.log('🔍 Fetching student data for:', session.user.email);

    // Get student details
    const student = await User.findOne({ 
      email: session.user.email 
    }).select('name email phoneNumber whatsappNumber image role createdAt lastLogin');

    if (!student) {
      console.log('❌ Student not found for email:', session.user.email);
      redirect('/unauthorized');
    }

    console.log('✅ Student found:', student.name);

    // Get registrations with course details
    const registrations = await Registration.find({
      student: student._id
    })
    .populate({
      path: 'course',
      select: 'title code thumbnail basePrice duration'
    })
    .populate('student', 'name email')
    .sort({ registrationDate: -1 });

    console.log('📚 Registrations found:', registrations.length);
    
    if (registrations.length > 0) {
      console.log('Sample registration:', {
        course: registrations[0].course?.title,
        status: registrations[0].registrationStatus,
        payment: registrations[0].paymentStatus,
        due: registrations[0].dueAmount
      });
    }

    return { 
      user: JSON.parse(JSON.stringify(student)),
      registrations: JSON.parse(JSON.stringify(registrations || []))
    };
  } catch (error) {
    console.error('❌ Error fetching student data:', error);
    return {
      user: null,
      registrations: [],
      error: error.message
    };
  }
}

export default async function StudentProfile() {
  const data = await getStudentData();
  
  if (!data.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
          <p className="text-gray-600">Please try refreshing the page.</p>
          {data.error && (
            <p className="text-sm text-gray-500 mt-2">Error: {data.error}</p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {data.user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <img
                  src={data.user.image || '/default-avatar.png'}
                  alt={data.user.name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-blue-200"
                />
                <h2 className="text-xl font-bold mt-4">{data.user.name}</h2>
                <p className="text-gray-600">{data.user.email}</p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    🎓 {data.user.role || 'Student'}
                  </span>
                </div>
                
                <div className="mt-6 space-y-3 text-left">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{data.user.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="font-medium">{data.user.whatsappNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member since</p>
                    <p className="font-medium">
                      {new Date(data.user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600">📚</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Courses</p>
                    <p className="text-2xl font-bold">{data.registrations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-green-600">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold">
                      {data.registrations.filter(r => r.registrationStatus === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-yellow-600">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Due</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      LKR {data.registrations.reduce((sum, r) => sum + (r.dueAmount || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Registrations */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Your Course Registrations</h3>
                <p className="text-gray-600 text-sm">Manage your courses and payments</p>
              </div>

              <div className="p-6">
                {data.registrations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📚</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h4>
                    <p className="text-gray-600 mb-4">You haven't registered for any courses yet.</p>
                    <a 
                      href="/courses" 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Courses
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.registrations.map((registration) => (
                      <div key={registration._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start space-x-4">
                              <img
                                src={registration.course?.thumbnail || '/course-placeholder.jpg'}
                                alt={registration.course?.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg text-gray-900">
                                  {registration.course?.title || 'Course'}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  Code: {registration.course?.code || 'N/A'} • 
                                  Duration: {registration.course?.duration || 0} weeks
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    registration.registrationStatus === 'confirmed' 
                                      ? 'bg-green-100 text-green-800'
                                      : registration.registrationStatus === 'completed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {registration.registrationStatus}
                                  </span>
                                  
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    registration.paymentStatus === 'paid' 
                                      ? 'bg-green-100 text-green-800'
                                      : registration.paymentStatus === 'partial'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    Payment: {registration.paymentStatus}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 md:text-right">
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-lg font-bold">LKR {registration.totalAmount || 0}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Due Amount</p>
                                <p className="text-xl font-bold text-red-600">
                                  LKR {registration.dueAmount || 0}
                                </p>
                              </div>
                              
                              {/* Payment Button */}
                              {registration.dueAmount > 0 && (
                                <StudentPaymentButton 
                                  registration={registration}
                                  student={data.user}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Registration Details */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Registered on</p>
                              <p className="font-medium">
                                {new Date(registration.registrationDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Amount Paid</p>
                              <p className="font-medium text-green-600">
                                LKR {registration.amountPaid || 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Progress</p>
                              <p className="font-medium">
                                {registration.progress?.overallProgress || 0}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}