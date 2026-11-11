// Sikkerhetsnett: stopper commit hvis noe annet enn appens oppsett er med,
// eller hvis kode-filene ser ut til å inneholde spillerdata.
// Kjøres automatisk av .git/hooks/pre-commit, og kan kjøres manuelt: node scripts/privacy-check.js
const { execSync } = require('child_process');
const fs = require('fs');

const ALLOW = new Set(['index.html', 'sw.js', 'version.js', 'manifest.webmanifest', 'icon.png',
  'README.md', '.gitignore', 'scripts/privacy-check.js', 'scripts/pre-commit']);
const PATTERNS = [
  [/"assessments"\s*:\s*\[\s*\{/, 'ser ut som lagrede vurderinger'],
  [/"players"\s*:\s*\[\s*\{/, 'ser ut som lagrede spillere'],
  [/"marks"\s*:\s*\{\s*"/, 'ser ut som lagret oppmøte'],
  [/\b(?:players|exercises|matches)\s*:\s*\[\s*\{\s*id\s*:\s*['"]/, 'data-objekter i koden']
];

const staged = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' })
  .split('\n').map(s => s.trim()).filter(Boolean);
const problems = [];
for (const f of staged) {
  if (!ALLOW.has(f)) problems.push(`Ikke tillatt fil i repoet: ${f}`);
  else if (/\.(html|js|webmanifest|md)$/.test(f) && fs.existsSync(f)) {
    const txt = fs.readFileSync(f, 'utf8');
    for (const [re, why] of PATTERNS) if (re.test(txt) && f !== 'scripts/privacy-check.js') problems.push(`${f}: ${why}`);
  }
}
if (problems.length) {
  console.error('\n⛔ COMMIT STOPPET – mulig persondata/uønskede filer:\n  ' + problems.join('\n  ') + '\n');
  process.exit(1);
}
console.log('Personvern-sjekk OK (' + staged.length + ' filer).');
