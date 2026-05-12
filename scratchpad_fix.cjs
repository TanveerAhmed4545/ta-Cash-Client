const fs = require('fs');
const p = require('@babel/parser');
const files = [
  'src/Page/DashBoard/User/UserTransactions.jsx',
  'src/Page/DashBoard/Admin/ManageTransactions.jsx',
  'src/Page/DashBoard/Admin/AuditLogs.jsx',
  'src/Page/DashBoard/Agent/TransactionManagement.jsx',
  'src/Page/DashBoard/Agent/AgentTransactions.jsx'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  const oldPattern = /          <\/div>\s*<\/div>\s*<div className="bg-base-100 rounded-2xl md:rounded-\[2\.5rem\]/;
  if (oldPattern.test(c)) {
    c = c.replace(
      /          <\/div>\s*<\/div>\s*<div className="bg-base-100 rounded-2xl md:rounded-\[2\.5rem\]/,
      `          </div>\n        </div>\n      </div>\n\n      <div className="bg-base-100 rounded-2xl md:rounded-[2.5rem]`
    );
    
    // Now remove the extra </div> at the end.
    // Let's replace the last 4 </div> with 3 </div>
    const endPattern = /        <\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*};\s*export default/;
    if (endPattern.test(c)) {
      c = c.replace(
        /        <\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*};\s*export default/,
        `        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default`
      );
    }
    
    fs.writeFileSync(f, c);
    try {
      p.parse(c, { sourceType: 'module', plugins: ['jsx'] });
      console.log('Fixed & OK:', f);
    } catch (e) {
      console.log('Error after fix:', f, e.message);
    }
  } else {
    console.log('Pattern not found in:', f);
  }
});
