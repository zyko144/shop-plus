const { spawn } = require('child_process');
const http = require('http');

const server = spawn('node', ['.output/server/index.mjs']);

server.stdout.on('data', (data) => console.log(`stdout: ${data}`));
server.stderr.on('data', (data) => console.log(`stderr: ${data}`));

setTimeout(() => {
  http.get('http://localhost:3000/admin', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('--- RESPONSE BODY ---');
      console.log(data);
      server.kill();
      process.exit(0);
    });
  }).on('error', err => {
    console.error('Fetch error:', err.message);
    server.kill();
    process.exit(1);
  });
}, 4000);
