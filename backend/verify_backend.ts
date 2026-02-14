async function testBackend() {
    const baseUrl = 'http://127.0.0.1:5000/api';
    let token = '';

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
                password: 'password123',
                opco: 'Tensor Workshop — India',
                platform: 'BFSI',
                interests: ['AI']
            })
        });

        const signupData: any = await signupRes.json();

        if (signupRes.ok) {
            console.log('   Signup Successful:', signupData.email);
            token = signupData.token;
        } else {
            console.error('   Signup Failed:', signupData);
            return;
        }
    } catch (e: any) {
        console.error('   Signup Error:', e.message);
        return;
    }

    // 2. Create Challenge
    try {
        console.log('2. Testing Create Challenge...');
        const chalRes = await fetch(`${baseUrl}/challenges`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Test Challenge TS',
                description: 'Description of test challenge in TS',
                stage: 'Ideation'
            })
        });
        const chalData: any = await chalRes.json();
        if (chalRes.ok) {
            console.log('   Create Challenge Successful:', chalData.title);
        } else {
            console.error('   Create Challenge Failed:', chalData);
        }
    } catch (e: any) {
        console.error('   Create Challenge Error:', e.message);
    }

    // 3. Get Metrics
    try {
        console.log('3. Testing Get Metrics...');
        const metricRes = await fetch(`${baseUrl}/metrics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const metricData: any = await metricRes.json();
        if (metricRes.ok) {
            console.log('   Get Metrics Successful:', metricData);
        } else {
            console.error('   Get Metrics Failed:', metricData);
        }
    } catch (e: any) {
        console.error('   Get Metrics Error:', e.message);
    }

    // 4. Create Task
    try {
        console.log('4. Testing Create Task...');
        const taskRes = await fetch(`${baseUrl}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Test Task TS',
                stage: 'Ideation'
            })
        });
        const taskData: any = await taskRes.json();
        if (taskRes.ok) {
            console.log('   Create Task Successful:', taskData.title);
        } else {
            console.error('   Create Task Failed:', taskData);
        }
    } catch (e: any) {
        console.error('   Create Task Error:', e.message);
    }

    console.log('--- Verification Complete ---');
}

testBackend();
