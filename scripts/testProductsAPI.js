const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/products?sort=createdAt&limit=5',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('✅ API Response:');
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (jsonData.success) {
        console.log(`\n✅ Found ${jsonData.products.length} products`);
        if (jsonData.products.length > 0) {
          console.log('\n📦 First Product:');
          const first = jsonData.products[0];
          console.log(`   Name: ${first.name}`);
          console.log(`   Price: ₹${first.price}`);
          console.log(`   Category: ${first.category?.name || 'No category'}`);
          console.log(`   Images: ${first.images?.length || 0}`);
        }
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error);
});

req.end();
