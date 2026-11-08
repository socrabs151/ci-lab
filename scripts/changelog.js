const { execFileSync } = require('node:child_process');
const fs = require('node:fs');

function arg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index > -1 ? process.argv[index + 1] : fallback;
}

const from = arg('from', null);
const to = arg('to', 'HEAD');
const output = arg('output', null);

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

const range = from ? `${from}..${to}` : to;
const lines = git('log', range, '--pretty=format:%h\t%s').split('\n').filter(Boolean);

const titles = {
  feat: 'Новые возможности',
  fix: 'Исправления',
  ci: 'CI/CD',
  docs: 'Документация',
  chore: 'Прочее',
  other: 'Изменения'
};
const groups = { feat: [], fix: [], ci: [], docs: [], chore: [], other: [] };

for (const line of lines) {
  const [hash, subject] = line.split('\t');
  const match = /^(feat|fix|ci|docs|chore)(\(.+\))?!?:/.exec(subject);
  groups[match ? match[1] : 'other'].push(`- ${subject} (${hash})`);
}

const date = new Date().toISOString().slice(0, 10);
let md = `## ${date}\n\n`;
for (const key of Object.keys(groups)) {
  if (groups[key].length) {
    md += `### ${titles[key]}\n\n${groups[key].join('\n')}\n\n`;
  }
}
if (!lines.length) {
  md += '_Изменений нет_\n';
}

if (output) {
  fs.writeFileSync(output, `# Changelog\n\n${md}`);
  console.log(`Changelog записан в ${output}`);
} else {
  process.stdout.write(md);
}
