import supabase from '../db.js';

const createNotesTable = async () => {
  const { data, error } = await supabase
    .from('notes_info')
    .select('sl_no')
    .limit(1);

  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Notes Info table does not exist. Please create it in the Supabase dashboard with the following structure:');
    console.log(`
      Table: notes_info
      Columns:
        sl_no: INTEGER, PRIMARY KEY, AUTO_INCREMENT
        user_id: INTEGER, NOT NULL, REFERENCES signup(id) ON DELETE CASCADE
        user_name: VARCHAR(100), NOT NULL
        department: VARCHAR(100), NOT NULL
        semester: VARCHAR(50), NOT NULL
        subject: VARCHAR(100), NOT NULL
        unit: VARCHAR(50), NOT NULL
        note_title: VARCHAR(255), NOT NULL
        file_name: VARCHAR(255)
        created_at: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
    `);
  } else {
    console.log('Notes Info table exists and is ready to use.');
  }
};

export default createNotesTable;