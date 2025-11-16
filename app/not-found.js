export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p>The product or page you are looking for does not exist.</p>
      <a href="/" className="mt-4 text-blue-600 underline">Go Home</a>
    </div>
  );
}
