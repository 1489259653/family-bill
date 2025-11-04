const axios = require('axios');

async function completeJwtTest() {
  console.log('=== 完整JWT认证流程测试 ===');
  console.log('这个测试将：');
  console.log('1. 生成有效的JWT令牌');
  console.log('2. 使用该令牌测试自定义DebugJwtGuard');
  console.log('3. 使用该令牌测试Passport的JWT守卫');
  
  let testToken = null;
  
  try {
    // 步骤1: 生成测试令牌
    console.log('\n📋 步骤1: 生成有效的JWT令牌');
    try {
      const response = await axios.get('http://localhost:3001/debug-auth/generate-token');
      testToken = response.data.token;
      console.log('✅ 成功获取测试令牌');
      console.log(`✅ 令牌前20个字符: ${testToken.substring(0, 20)}...`);
      console.log(`✅ Payload信息: sub=${response.data.payload.sub}, username=${response.data.payload.username}`);
    } catch (error) {
      console.error('❌ 获取测试令牌失败:', error.response?.data || error.message);
      return;
    }
    
    // 步骤2: 使用令牌测试自定义DebugJwtGuard
    console.log('\n📋 步骤2: 测试自定义DebugJwtGuard');
    try {
      const response = await axios.get('http://localhost:3001/debug-auth/test', {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      console.log('✅ DebugJwtGuard 测试成功!');
      console.log('✅ 响应:', response.data);
    } catch (error) {
      console.error('❌ DebugJwtGuard 测试失败:', error.response?.data || error.message);
    }
    
    // 步骤3: 使用令牌测试Passport的JWT守卫
    console.log('\n📋 步骤3: 测试Passport JWT守卫');
    try {
      const response = await axios.get('http://localhost:3001/debug-auth/test-passport', {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      console.log('✅ Passport JWT守卫 测试成功!');
      console.log('✅ 响应:', response.data);
    } catch (error) {
      console.error('❌ Passport JWT守卫 测试失败:', error.response?.data || error.message);
    }
    
    console.log('\n=== 测试完成 ===');
    console.log('请查看后端服务日志，现在应该能看到：');
    console.log('1. DebugJwtGuard的详细日志');
    console.log('2. 希望能看到JwtStrategy的执行日志');
    
  } catch (error) {
    console.error('❌ 测试过程中发生未知错误:', error);
  }
}

// 运行完整测试
completeJwtTest();