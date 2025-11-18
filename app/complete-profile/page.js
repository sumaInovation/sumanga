
// app/complete-profile/page.js
import { Suspense } from "react";
import CompleteProfileContent from "./CompleteProfileContent";

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading profile...
        </div>
      </div>
    }>
      <CompleteProfileContent />
    </Suspense>
  );
}