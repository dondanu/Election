const Results = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Election Results</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Latest Results</h2>
        <p className="text-gray-600 mb-4">
          Election results will be displayed here once voting is complete.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Provincial Results</h3>
            <p className="text-gray-500">Results by province will appear here</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">District Results</h3>
            <p className="text-gray-500">Results by district will appear here</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Total Votes</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">0%</div>
            <div className="text-sm text-gray-600">Turnout</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Constituencies</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;