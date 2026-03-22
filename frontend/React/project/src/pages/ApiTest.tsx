import React, { useState } from 'react';

const ApiTest = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:8083/api';

  const addResult = (test: string, status: string, data?: any, error?: any) => {
    setResults(prev => [...prev, {
      test,
      status,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testAPI = async (name: string, url: string, method: string = 'GET', body?: any) => {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();
      
      if (response.ok) {
        addResult(name, 'SUCCESS', data);
      } else {
        addResult(name, 'FAILED', null, `${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      addResult(name, 'ERROR', null, error.message);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);

    // PROVINCE TESTS
    await testAPI('GET /api/provinces', `${API_BASE}/provinces`);
    
    await testAPI('POST /api/provinces', `${API_BASE}/provinces`, 'POST', {
      name: 'Test Province',
      districtCount: 5
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testAPI('GET /api/provinces (after POST)', `${API_BASE}/provinces`);
    await testAPI('GET /api/provinces/1', `${API_BASE}/provinces/1`);
    
    await testAPI('PUT /api/provinces/1', `${API_BASE}/provinces/1`, 'PUT', {
      name: 'Updated Test Province',
      districtCount: 7
    });
    
    // DISTRICT TESTS
    await testAPI('GET /api/districts', `${API_BASE}/districts`);
    
    await testAPI('POST /api/districts', `${API_BASE}/districts`, 'POST', {
      name: 'Test District',
      provinceId: 1
    });
    
    await testAPI('GET /api/districts (after POST)', `${API_BASE}/districts`);
    await testAPI('GET /api/districts/1', `${API_BASE}/districts/1`);
    
    // PARTY TESTS
    await testAPI('GET /api/parties', `${API_BASE}/parties`);
    
    await testAPI('POST /api/parties', `${API_BASE}/parties`, 'POST', {
      name: 'Test Party'
    });
    
    await testAPI('GET /api/parties (after POST)', `${API_BASE}/parties`);
    await testAPI('GET /api/parties/1', `${API_BASE}/parties/1`);
    
    // ELECTION TESTS
    await testAPI('GET /api/elections', `${API_BASE}/elections`);
    
    await testAPI('POST /api/elections', `${API_BASE}/elections`, 'POST', {
      year: 2024
    });
    
    await testAPI('GET /api/elections (after POST)', `${API_BASE}/elections`);
    await testAPI('GET /api/elections/1', `${API_BASE}/elections/1`);
    
    // CLEANUP TESTS (DELETE)
    await testAPI('DELETE /api/districts/1', `${API_BASE}/districts/1`, 'DELETE');
    await testAPI('DELETE /api/parties/1', `${API_BASE}/parties/1`, 'DELETE');
    await testAPI('DELETE /api/elections/1', `${API_BASE}/elections/1`, 'DELETE');
    await testAPI('DELETE /api/provinces/1', `${API_BASE}/provinces/1`, 'DELETE');

    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connection Test</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run All API Tests'}
          </button>
          
          <button
            onClick={clearResults}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            Clear Results
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <p>Backend URL: <span className="font-mono">{API_BASE}</span></p>
          <p>This will test all CRUD operations for all entities (Provinces, Districts, Parties, Elections).</p>
          {results.length > 0 && (
            <div className="mt-2 p-3 bg-gray-50 rounded">
              <p className="font-medium">Test Summary:</p>
              <div className="flex space-x-4 mt-1">
                <span className="text-green-600">✓ Success: {results.filter(r => r.status === 'SUCCESS').length}</span>
                <span className="text-red-600">✗ Failed: {results.filter(r => r.status === 'FAILED').length}</span>
                <span className="text-yellow-600">⚠ Error: {results.filter(r => r.status === 'ERROR').length}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Test Results ({results.length})</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {results.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No tests run yet. Click "Run All API Tests" to start.
            </div>
          ) : (
            results.map((result, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{result.test}</h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        result.status === 'SUCCESS'
                          ? 'bg-green-100 text-green-800'
                          : result.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {result.status}
                    </span>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                </div>
                
                {result.data && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Response Data:</p>
                    <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
                
                {result.error && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600 mb-1">Error:</p>
                    <pre className="bg-red-50 p-2 rounded text-xs text-red-700">
                      {result.error}
                    </pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;