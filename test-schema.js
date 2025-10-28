// 测试 x402scan schema 端点
import fetch from 'node-fetch';

async function testSchema() {
  try {
    console.log('🔍 测试 x402scan schema 端点...');
    
    const response = await fetch('http://localhost:4021/schema');
    const data = await response.json();
    
    console.log('✅ Schema 响应:');
    console.log(JSON.stringify(data, null, 2));
    
    // 验证必需字段
    const requiredFields = ['x402Version', 'accepts'];
    const missingFields = requiredFields.filter(field => !(field in data));
    
    if (missingFields.length > 0) {
      console.error('❌ 缺少必需字段:', missingFields);
    } else {
      console.log('✅ 包含所有必需字段');
    }
    
    // 验证 accepts 数组
    if (data.accepts && Array.isArray(data.accepts)) {
      console.log(`✅ 找到 ${data.accepts.length} 个资源`);
      
      data.accepts.forEach((accept, index) => {
        console.log(`\n📋 资源 ${index + 1}:`);
        console.log(`   - 资源路径: ${accept.resource}`);
        console.log(`   - 描述: ${accept.description}`);
        console.log(`   - 费用: ${accept.maxAmountRequired} ${accept.asset}`);
        console.log(`   - 网络: ${accept.network}`);
      });
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testSchema();
