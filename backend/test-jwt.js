const axios = require('axios');

async function testJwtAuth() {
  console.log('测试JWT认证流程...');
  
  try {
    // 1. 首先尝试不使用token访问受保护的端点
    console.log('\n1. 不使用token访问受保护端点:');
    try {
      const response = await axios.get('http://localhost:3001/debug-auth/test');
      console.log('响应:', response.data);
    } catch (error) {
      console.log('预期的错误:', error.response?.data || error.message);
    }
    
    // 2. 使用一个简单的token尝试访问
    console.log('\n2. 使用简单token访问受保护端点:');
    try {
      const response = await axios.get('http://localhost:3001/debug-auth/test', {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      console.log('响应:', response.data);
    } catch (error) {
      console.log('预期的错误:', error.response?.data || error.message);
    }
    
    // 3. 尝试登录获取有效的token
    console.log('\n3. 尝试登录获取token:');
    try {
      const loginResponse = await axios.post('http://localhost:3001/auth/login', {
        email: '321321@qq.com',
        password: '321321.'
      });
      console.log('登录成功，token:', loginResponse.data.access_token);
      
      // 4. 使用登录获取的token访问受保护端点
      console.log('\n4. 使用登录获取的token访问受保护端点:');
      const protectedResponse = await axios.get('http://localhost:3001/families/current', {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.access_token}`
        }
      });
      console.log('响应:', protectedResponse.data);
    } catch (error) {
      console.log('登录或访问失败:', error.response?.data || error.message);
    }
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

testJwtAuth();