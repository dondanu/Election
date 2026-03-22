const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Sri Lanka Election System
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to the official election management system
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">View Results</h3>
            <p className="text-gray-600">Check the latest election results and statistics</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">About Elections</h3>
            <p className="text-gray-600">Learn about the electoral process and system</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Administration</h3>
            <p className="text-gray-600">Manage election data and configurations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;