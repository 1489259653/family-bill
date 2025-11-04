const axios = require('axios');

async function testPassportJwt() {
  console.log('=== 测试 Passport JWT 守卫 ===');
  console.log('这个测试将直接使用 @UseGuards(AuthGuard(\'jwt\')) 来触发 JwtStrategy');
  
  try {
    // 测试使用简单token访问Passport JWT守卫端点
    console.log('\n1. 使用简单token测试 Passport JWT守卫:');
    try {
      const response = await axios.get('http://localhost:3001/debug-auth/test-passport', {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      console.log('响应:', response.data);
    } catch (error) {
      console.log('错误响应:', error.response?.data || error.message);
    }
    
    // 测试使用伪造的JWT token
    // 这是一个使用密钥 'family-finance-secret-key' 签名的简单JWT
    console.log('\n2. 使用伪造的JWT token测试:');
    try {
      const response = await axios.get('http://localhost:3001/debug-auth/test-passport', {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiIxIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
      });
      console.log('响应:', response.data);
    } catch (error) {
      console.log('错误响应:', error.response?.data || error.message);
    }
    
    console.log('\n=== 测试完成 ===');
    console.log('请查看后端服务日志，确认是否有 JwtStrategy 的执行日志');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

testPassportJwt();