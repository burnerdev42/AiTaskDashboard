
// Node 18+ has native fetch, no need to require it.

async function testBackend() {
    const baseUrl = 'http://localhost:5000/api';
    let token = '';
    let userId = '';
    let challengeId = '';

    console.log('--- Starting Verification ---');

    // 1. Signup
    try {
        console.log('1. Testing Signup...');
        const signupRes = await fetch(`${baseUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123'
            })
        });

        let signupData;
        try {
            signupData = await signupRes.json();
        } catch (err) {
            console.error('Signup JSON Parse Error:', err, await signupRes.text());
        }

        if (signupRes.ok) {
            console.log('   Signup Successful:', signupData.email);
            token = signupData.token;
            userId = signupData._id;
        } else {
            console.error('   Signup Failed:', signupData);
            return;
        }
    } catch (e) {
        console.error('   Signup Error:', e.message);
        return;
    }

    // 3. Create Challenge
    try {
        console.log('2. Testing Create Challenge...');
        const chalRes = await fetch(`${baseUrl}/challenges`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Test Challenge',
                description: 'Description of test challenge',
                stage: 'Ideation'
            })
        });
        const chalData = await chalRes.json();
        if (chalRes.ok) {
            console.log('   Create Challenge Successful:', chalData.title);
            challengeId = chalData._id;
        } else {
            console.error('   Create Challenge Failed:', chalData);
        }
    } catch (e) {
        console.error('   Create Challenge Error:', e.message);
    }

    // 4. Get Metrics
    try {
        console.log('3. Testing Get Metrics...');
        const metricRes = await fetch(`${baseUrl}/metrics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const metricData = await metricRes.json();
        if (metricRes.ok) {
            console.log('   Get Metrics Successful:', metricData);
        } else {
            console.error('   Get Metrics Failed:', metricData);
        }
    } catch (e) {
        console.error('   Get Metrics Error:', e.message);
    }

    // 5. Create Task
    try {
        console.log('4. Testing Create Task...');
        const taskRes = await fetch(`${baseUrl}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Test Task',
                stage: 'Ideation'
            })
        });
        const taskData = await taskRes.json();
        if (taskRes.ok) {
            console.log('   Create Task Successful:', taskData.title);
        } else {
            console.error('   Create Task Failed:', taskData);
        }
    } catch (e) {
        console.error('   Create Task Error:', e.message);
    }

    console.log('--- Verification Complete ---');
}

testBackend();
