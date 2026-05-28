const fetch = require('node-fetch');

async function testAdvisor() {
  try {
    // Login
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'erronvillaluz9@gmail.com',
        password: 'ASDFGHJKL'
      })
    });

    const loginData = await loginRes.json();
    if (!loginData.success) {
      throw new Error('Login failed: ' + JSON.stringify(loginData));
    }

    const token = loginData.data.token;
    console.log('Login successful, got token');

    // Test advisor
    console.log('Testing AI advisor...');
    const startTime = Date.now();

    const advisorRes = await fetch('http://localhost:3002/api/advisor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'How can I improve my sleep quality?'
      })
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const advisorData = await advisorRes.json();

    console.log(`Response time: ${responseTime}ms`);
    console.log('Advisor response:', advisorData);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAdvisor();