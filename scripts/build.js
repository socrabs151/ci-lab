const { execFileSync } = require('node:child_process');
const fs = require('node:fs');

fs.mkdirSync('dist', { recursive: true });
execFileSync('npm', ['pack', '--pack-destination', 'dist'], {
  stdio: 'inherit',
  shell: process.platform === 'win32'
});
const files = fs.readdirSync('dist').filter((f) => f.endsWith('.tgz'));
console.log(`Собран артефакт: ${files.join(', ')}`);
