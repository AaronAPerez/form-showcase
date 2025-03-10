const { execSync } = require('child_process');

console.log('Starting database initialization...');

try {
  // Run the database initialization command
  execSync('node -e "require(\'./form-showcase/lib/init-db.js\').default().then(() => console.log(\'Database initialized successfully\')).catch((err) => { console.error(\'Error initializing database:\', err); process.exit(1); })"', { stdio: 'inherit' });
  
  console.log('Database initialization complete!');
} catch (error) {
  console.error('Error running database initialization:', error);
  process.exit(1);
}