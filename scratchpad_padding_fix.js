import fs from 'fs';

const files = [
  'src/Page/DashBoard/User/UserTransactions.jsx',
  'src/Page/DashBoard/Agent/TransactionManagement.jsx',
  'src/Page/DashBoard/Agent/AgentTransactions.jsx',
  'src/Page/DashBoard/Admin/UserManagement.jsx',
  'src/Page/DashBoard/Admin/ManageTransactions.jsx',
  'src/Page/DashBoard/Admin/AuditLogs.jsx',
  'src/Page/DashBoard/Admin/AllTransactions.jsx',
  'src/Page/DashBoard/Profile/Profile.jsx',
  'src/Page/DashBoard/User/UserStats.jsx',
  'src/Page/DashBoard/Admin/SystemSettings.jsx',
  'src/Page/DashBoard/Admin/AdminAnalytics.jsx',
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  
  // For standard tables
  c = c.replace(/className="w-full px-4 lg:px-8 py-8/g, 'className="w-full py-8');
  
  // For profile
  c = c.replace(/className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8/g, 'className="w-full max-w-7xl mx-auto py-8');
  
  // For stats / settings / analytics
  c = c.replace(/className="container mx-auto px-4 py-8/g, 'className="w-full py-8');
  
  fs.writeFileSync(f, c);
  console.log('Fixed padding in:', f);
});
