import express from "express";
import multer from "multer";
import { notesController } from "../NoteControllers/NotesControllers.js";
import supabase from '../db.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload note
router.post("/upload", upload.single("note"), notesController);

// Get notes by branch and semester
router.get("/", async (req, res) => {
  try {
    const { department, semester, subject } = req.query;
    
    if (!department || !semester) {
      return res.status(400).json({ error: "Department and semester are required" });
    }

    let query = supabase
      .from('notes_info')
      .select('*')
      .eq('department', department)
      .eq('semester', semester);

    // Filter by subject if provided
    if (subject) {
      query = query.eq('subject', subject);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Database error", details: error.message });
    }

    res.json({ notes: data || [] });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

// Download note
router.get("/download/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;
    console.log('Download request for file:', fileName);

    // Get public URL for the file from Supabase storage
    const { data: { publicUrl } } = supabase
      .storage
      .from('notes-pdfs')
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrl);

    // Return the public URL
    res.json({ downloadUrl: publicUrl, fileName });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

// Like a note
router.post("/like", async (req, res) => {
  try {
    const { noteId, userId } = req.body;
    
    if (!noteId || !userId) {
      return res.status(400).json({ error: "Note ID and User ID are required" });
    }

    // Check if user already liked this note
    const { data: checkData, error: checkError } = await supabase
      .from('note_likes')
      .select('id')
      .eq('note_id', noteId)
      .eq('user_id', userId);

    if (checkError) {
      console.error("Supabase error:", checkError);
      return res.status(500).json({ error: "Database error", details: checkError.message });
    }

    if (checkData.length > 0) {
      // Unlike - remove the like
      const { error: deleteError } = await supabase
        .from('note_likes')
        .delete()
        .eq('id', checkData[0].id);

      if (deleteError) {
        console.error("Supabase error:", deleteError);
        return res.status(500).json({ error: "Database error", details: deleteError.message });
      }

      return res.json({ liked: false, message: "Note unliked successfully" });
    } else {
      // Like - add the like
      const { data: insertData, error: insertError } = await supabase
        .from('note_likes')
        .insert([
          { note_id: noteId, user_id: userId }
        ])
        .select();

      if (insertError) {
        console.error("Supabase error:", insertError);
        return res.status(500).json({ error: "Database error", details: insertError.message });
      }

      return res.json({ liked: true, message: "Note liked successfully", like: insertData[0] });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

// Get like status for a note
router.get("/like-status/:noteId/:userId", async (req, res) => {
  try {
    const { noteId, userId } = req.params;
    
    if (!noteId || !userId) {
      return res.status(400).json({ error: "Note ID and User ID are required" });
    }

    const { data, error } = await supabase
      .from('note_likes')
      .select('id')
      .eq('note_id', noteId)
      .eq('user_id', userId);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Database error", details: error.message });
    }

    res.json({ liked: data.length > 0 });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

// Delete note
router.delete("/delete/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.body;
    
    if (!noteId || !userId) {
      return res.status(400).json({ error: "Note ID and User ID are required" });
    }

    // First, get the note to check ownership and get file name
    const { data: noteData, error: noteError } = await supabase
      .from('notes_info')
      .select('user_id, file_name')
      .eq('sl_no', noteId);

    if (noteError) {
      console.error("Supabase error fetching note:", noteError);
      return res.status(500).json({ error: "Database error", details: noteError.message });
    }

    if (!noteData || noteData.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    const note = noteData[0];

    // Check if the user is the owner of the note
    if (note.user_id !== parseInt(userId)) {
      return res.status(403).json({ error: "You can only delete your own notes" });
    }

    // Delete the file from Supabase storage if it exists
    if (note.file_name) {
      const { error: storageError } = await supabase
        .storage
        .from('notes-pdfs')
        .remove([note.file_name]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete the note from the database
    const { error: deleteError } = await supabase
      .from('notes_info')
      .delete()
      .eq('sl_no', noteId);

    if (deleteError) {
      console.error("Supabase error deleting note:", deleteError);
      return res.status(500).json({ error: "Database error", details: deleteError.message });
    }

    // Also delete any likes for this note
    const { error: likeDeleteError } = await supabase
      .from('note_likes')
      .delete()
      .eq('note_id', noteId);

    if (likeDeleteError) {
      console.error("Error deleting likes:", likeDeleteError);
      // Don't fail the request if like deletion fails
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

export default router;