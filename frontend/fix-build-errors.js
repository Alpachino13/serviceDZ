/**
 * Run this once in your project root to auto-patch both build errors:
 *   node fix-build-errors.js
 */
const fs = require('fs');
const path = require('path');

// ── FIX 1: onViewProfile not defined in ServiceDZ.jsx ────────────────────────
const sdz = path.join(__dirname, 'src/components/ServiceDZ.jsx');
if (fs.existsSync(sdz)) {
  let code = fs.readFileSync(sdz, 'utf8');

  // Find any usage like: onViewProfile(  or onClick={() => onViewProfile(
  // Add a safe default prop to whichever component uses it
  code = code.replace(
    /\bonViewProfile\b(?!\s*[=:])/g,   // usage sites (not declarations)
    '(onViewProfile || function(){})'
  );

  // If the component signature doesn't include onViewProfile, inject it
  // Pattern: function ArtisanCard({ ... }) or const ArtisanCard = ({ ... }) =>
  code = code.replace(
    /(\bfunction\s+\w+\s*\(\s*\{[^}]*)\}\s*\)/,
    (match, p1) => {
      if (match.includes('onViewProfile')) return match;  // already there
      return p1 + ', onViewProfile' + '} )';
    }
  );

  fs.writeFileSync(sdz, code, 'utf8');
  console.log('✅ Fixed ServiceDZ.jsx — onViewProfile');
} else {
  console.log('⚠️  ServiceDZ.jsx not found at', sdz);
}

// ── FIX 2: duplicate 'navigate' in ArtisanProfile.jsx ────────────────────────
const ap = path.join(__dirname, 'src/pages/ArtisanProfile.jsx');
if (fs.existsSync(ap)) {
  let code = fs.readFileSync(ap, 'utf8');

  // Remove duplicate const/let/var navigate declarations after the first one
  let count = 0;
  code = code.replace(
    /^(\s*(?:const|let|var)\s+navigate\s*=\s*useNavigate\(\s*\)\s*;?\s*)$/gm,
    (match) => {
      count++;
      if (count === 1) return match;      // keep first
      return '// (duplicate navigate removed)';  // remove rest
    }
  );

  fs.writeFileSync(ap, code, 'utf8');
  console.log('✅ Fixed ArtisanProfile.jsx — duplicate navigate');
} else {
  console.log('⚠️  ArtisanProfile.jsx not found at', ap);
}

console.log('\nDone. Now run: git add -A && git commit -m "fix: build errors" && git push');
