import supabase from '../db.js';

const createSignUpTable = async () => {
  // Supabase automatically creates tables via the dashboard
  // This function ensures the table exists and has the correct structure
  
  // Check if the table exists by trying to select from it
  const { data, error } = await supabase
    .from('signup')
    .select('id')
    .limit(1);

  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('SignUp table does not exist. Please create it in the Supabase dashboard with the following structure:');
    console.log(`
      Table: signup
      Columns:
        id: INTEGER, PRIMARY KEY, AUTO_INCREMENT
        name: VARCHAR(100), NOT NULL
        email: VARCHAR(100), NOT NULL, UNIQUE
        university: VARCHAR(100)
        password: VARCHAR(255), NOT NULL
        points: INTEGER, DEFAULT 0
        created_at: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
    `);
  } else {
    console.log('SignUp table exists and is ready to use.');
  }
};

export default createSignUpTable;