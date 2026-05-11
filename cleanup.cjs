const fs = require('fs');
const path = require('path');

const replacements = [
  { search: 'dark:text-[#4ade80]', replace: '' },
  { search: 'dark:bg-[#4ade80]', replace: '' },
  { search: 'dark:hover:text-[#4ade80]', replace: '' },
  { search: 'dark:text-neutral-content', replace: 'text-neutral-content' },
  { search: 'dark:text-neutral-content/50', replace: 'text-neutral-content' },
  { search: 'text-base-content/70', replace: 'text-neutral-content' },
  { search: 'text-base-content/60', replace: 'text-neutral-content' },
  { search: 'text-base-content/40', replace: 'text-neutral-content' },
  { search: 'text-neutral-content/50', replace: 'text-neutral-content' },
  { search: 'bg-green-500', replace: 'bg-primary' },
  { search: 'dark:bg-base-100/40', replace: '' },
  { search: 'dark:border-white/5', replace: '' }
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
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedSearch, 'g');
        content = content.replace(regex, replace);
      }
      
      // cleanup double spaces
      content = content.replace(/  +/g, ' ');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
