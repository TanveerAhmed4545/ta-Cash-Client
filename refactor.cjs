const fs = require('fs');
const path = require('path');

const replacements = [
  { search: 'bg-white', replace: 'bg-base-100' },
  { search: 'bg-[#f3f4f6]', replace: 'bg-base-200' },
  { search: 'bg-[#f8fafc]', replace: 'bg-base-200' },
  { search: 'bg-gray-50', replace: 'bg-base-200' },
  { search: 'text-gray-900', replace: 'text-base-content' },
  { search: 'text-gray-800', replace: 'text-base-content' },
  { search: 'text-gray-700', replace: 'text-base-content' },
  { search: 'text-gray-600', replace: 'text-neutral-content' },
  { search: 'text-gray-500', replace: 'text-neutral-content' },
  { search: 'text-gray-400', replace: 'text-neutral-content/50' },
  { search: 'border-gray-100', replace: 'border-base-300' },
  { search: 'border-gray-200', replace: 'border-base-300' },
  { search: 'bg-[#ecfdf5]', replace: 'bg-base-200' },
  { search: 'text-[#1A3626]', replace: 'text-primary' },
  { search: 'bg-[#1A3626]', replace: 'bg-primary' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { search, replace } of replacements) {
        // Use a more robust replacement that doesn't rely on \b for characters like [ or #
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedSearch, 'g');
        content = content.replace(regex, replace);
      }
      
      // Cleanup any leftover dark: classes
      content = content.replace(/dark:[a-z0-9-\[\]#\/:]+/g, '');
      content = content.replace(/  +/g, ' '); 
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
