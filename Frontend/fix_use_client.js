const fs = require('fs');
const files = [
  'app/(customer)/consultation/[meetingId]/page.js',
  'app/(customer)/hospitals/[id]/page.js',
  'app/(customer)/lab-tests/browse/page.js',
  'app/(customer)/pharmacies/[slug]/page.js',
  'app/(customer)/vendors/[slug]/page.js'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('"use client"') || content.includes("'use client'")) {
    // Remove all instances of "use client"
    content = content.replace(/["']use client["'];?\n?/g, '');
    // Add it to the very top
    content = '"use client";\n' + content;
    fs.writeFileSync(file, content);
    console.log('Fixed use client in', file);
  }
}
