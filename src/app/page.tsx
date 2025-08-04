export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Zirk.it
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Your business. Connected.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Hello World! 🚀
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Zirk.it MVP is live and ready for development.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">✅ Git Repo</h3>
                <p className="text-green-600">Connected to GitHub</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">⚡ Next.js</h3>
                <p className="text-blue-600">Ready for development</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">🎨 Tailwind</h3>
                <p className="text-purple-600">Styling configured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}