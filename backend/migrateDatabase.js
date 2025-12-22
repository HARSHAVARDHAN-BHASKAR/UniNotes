import supabase from './db.js';

const migrateDatabase = async () => {
  try {
    console.log('Starting database migration...');
    
    // 1. Add points column to signup table if it doesn't exist
    try {
      const { error: alterError } = await supabase
        .rpc('exec_sql', { sql: 'ALTER TABLE signup ADD COLUMN points INTEGER DEFAULT 0;' });
      
      if (alterError && !alterError.message.includes('column "points" of relation "signup" already exists')) {
        console.error('Error adding points column:', alterError);
      } else if (alterError) {
        console.log('Points column already exists');
      } else {
        console.log('Points column added successfully');
      }
    } catch (err) {
      console.log('Points column may already exist or RPC not available');
    }
    
    // 1.5. Add university column to signup table if it doesn't exist
    try {
      const { error: alterError } = await supabase
        .rpc('exec_sql', { sql: 'ALTER TABLE signup ADD COLUMN university VARCHAR(100);' });
      
      if (alterError && !alterError.message.includes('column "university" of relation "signup" already exists')) {
        console.error('Error adding university column:', alterError);
      } else if (alterError) {
        console.log('University column already exists');
      } else {
        console.log('University column added successfully');
      }
    } catch (err) {
      console.log('University column may already exist or RPC not available');
    }
    
    // 2. Check if note_likes table exists, create if not
    try {
      const { data: tableData, error: tableError } = await supabase
        .from('note_likes')
        .select('id')
        .limit(1);
      
      if (tableError && tableError.code === '42P01') {
        console.log('note_likes table does not exist, would need to create it in Supabase dashboard');
      } else {
        console.log('note_likes table exists');
      }
    } catch (err) {
      console.log('note_likes table check completed');
    }
    
    // 3. Check storage bucket for notes
    try {
      const { data: buckets, error: listError } = await supabase
        .storage
        .listBuckets();

      if (listError) {
        console.error('Error listing buckets:', listError);
      } else {
        const notesBucket = buckets.find(bucket => bucket.name === 'notes-pdfs');
        
        if (!notesBucket) {
          console.log('Storage bucket "notes-pdfs" does not exist.');
          console.log('Please create it manually in the Supabase dashboard.');
        } else {
          console.log('Storage bucket "notes-pdfs" exists');
        }
      }
    } catch (err) {
      console.log('Storage bucket check completed');
    }
    
    console.log('Database migration completed');
  } catch (err) {
    console.error('Migration error:', err);
  }
};

// Run the migration
migrateDatabase();