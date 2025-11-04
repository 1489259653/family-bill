const axios = require('axios');

async function testTransactions() {
  try {
    console.log('1. 测试登录获取token...');
    const loginResponse = await axios.post('http://localhost:3001/auth/login', {
      email: 'happy_eric@qq.com',
      password: 'lzyBIKE911eric.'
    });
    
    console.log('登录响应结构:', JSON.stringify(loginResponse.data, null, 2));
    const token = loginResponse.data.access_token;
    console.log('✅ 登录成功，获取到token');
    
    console.log('\n2. 测试获取交易列表...');
    const transactionsResponse = await axios.get('http://localhost:3001/transactions', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('交易列表响应结构:', JSON.stringify(transactionsResponse.data, null, 2));
    const transactions = transactionsResponse.data.data || transactionsResponse.data;
    console.log(`✅ 交易列表获取成功，共 ${Array.isArray(transactions) ? transactions.length : 0} 条记录`);
    if (Array.isArray(transactions) && transactions.length > 0) {
      console.log('交易列表示例:', transactions.slice(0, 2));
    }
    
    console.log('\n3. 测试获取交易汇总...');
    const summaryResponse = await axios.get('http://localhost:3001/transactions/summary', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('汇总响应结构:', JSON.stringify(summaryResponse.data, null, 2));
    const summary = summaryResponse.data.data || summaryResponse.data;
    console.log('✅ 交易汇总获取成功:', summary);
    
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

testTransactions();