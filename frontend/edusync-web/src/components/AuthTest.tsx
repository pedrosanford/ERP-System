import React, { useState } from 'react';

const AuthTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testAuth = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
                // Use relative URL - Vite proxy will handle routing to Gateway
                const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password: 'password123'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Success! Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`⚠️ Error Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
      }
      
    } catch (error: any) {
      setResult(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Service Test</h1>
      <button 
        onClick={testAuth}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Auth Service'}
      </button>
      <div className="bg-gray-100 p-4 rounded">
        <pre className="whitespace-pre-wrap">{result}</pre>
      </div>
    </div>
  );
};

export default AuthTest;
