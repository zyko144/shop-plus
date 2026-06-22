const { spawn } = require('child_process');
const http = require('http');

const server = spawn('npm', ['run', 'start'], { shell: true });

server.stdout.on('data', (data) => console.log(`stdout: ${data}`));
server.stderr.on('data', (data) => console.log(`stderr: ${data}`));

setTimeout(() => {
  http.get('http://localhost:3000/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('--- RESPONSE HEADERS ---');
      console.log(res.headers);
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
