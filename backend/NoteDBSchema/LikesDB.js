import supabase from '../db.js';

const createLikesTable = async () => {
  const { data, error } = await supabase
    .from('note_likes')
    .select('id')
    .limit(1);

  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Note Likes table does not exist. Please create it in the Supabase dashboard with the following structure:');
    console.log(`
      Table: note_likes
      Columns:
        id: INTEGER, PRIMARY KEY, AUTO_INCREMENT
        note_id: INTEGER, NOT NULL, REFERENCES notes_info(sl_no) ON DELETE CASCADE
        user_id: INTEGER, NOT NULL, REFERENCES signup(id) ON DELETE CASCADE
        created_at: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
        UNIQUE(note_id, user_id)
    `);
  } else {
    console.log('Note Likes table exists and is ready to use.');
  }
};

export default createLikesTable;