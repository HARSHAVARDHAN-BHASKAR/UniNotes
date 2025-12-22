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
    
    // Download file from Supabase storage
    const { data, error } = await supabase
      .storage
      .from('notes-pdfs')
      .download(fileName);

    if (error) {
      console.error("Error downloading file from Supabase storage:", error);
      return res.status(404).json({ error: "File not found" });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', data.type || 'application/octet-stream');
    
    // Send the file
    res.send(data);
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

export default router;