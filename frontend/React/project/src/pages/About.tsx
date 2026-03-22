const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">About Sri Lanka Elections</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Electoral System</h2>
        <p className="text-gray-700 mb-4">
          Sri Lanka follows a democratic electoral system with regular elections for various 
          governmental positions including Presidential, Parliamentary, and Provincial Council elections.
        </p>
        <p className="text-gray-700">
          This system ensures fair representation and democratic governance across all provinces 
          and districts of the country.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3">Key Features</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Transparent voting process</li>
            <li>• Real-time result tracking</li>
            <li>• Provincial and district-wise analysis</li>
            <li>• Secure data management</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3">System Information</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Last Updated:</strong> 2024</p>
            <p><strong>Platform:</strong> Web-based</p>
            <p><strong>Technology:</strong> React + TypeScript</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;