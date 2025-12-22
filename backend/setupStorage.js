import supabase from './db.js';

const setupStorage = async () => {
  try {
    // Check if the notes-pdfs bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      console.log('Please ensure you have the correct Supabase configuration and permissions.');
      return;
    }

    const notesBucket = buckets.find(bucket => bucket.name === 'notes-pdfs');

    if (!notesBucket) {
      console.log('Storage bucket "notes-pdfs" does not exist.');
      console.log('Please create it manually in the Supabase dashboard with the following settings:');
      console.log('- Name: notes-pdfs');
      console.log('- Public bucket: Yes');
      console.log('- File size limit: 52428800 (50MB)');
      console.log('- Allowed MIME types:');
      console.log('  - application/pdf');
      console.log('  - application/msword');
      console.log('  - application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      console.log('  - text/plain');
      console.log('  - application/vnd.ms-powerpoint');
      console.log('  - application/vnd.openxmlformats-officedocument.presentationml.presentation');
      console.log('  - image/jpeg');
      console.log('  - image/png');
      return;
    }

    console.log('Storage bucket "notes-pdfs" exists and is ready to use.');

    // Check if bucket is public
    const { data: bucketDetails, error: bucketError } = await supabase
      .storage
      .getBucket('notes-pdfs');

    if (bucketError) {
      console.error('Error getting bucket details:', bucketError);
      return;
    }

    if (!bucketDetails.public) {
      console.log('Warning: Bucket "notes-pdfs" is not public. File downloads may not work.');
      console.log('Please make the bucket public in the Supabase dashboard.');
    } else {
      console.log('Bucket is properly configured as public.');
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

// Run the setup
setupStorage();