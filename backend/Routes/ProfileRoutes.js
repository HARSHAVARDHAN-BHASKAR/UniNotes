import express from "express";
import supabase from '../db.js';

const router = express.Router();

// Update user profile
router.put("/update-profile", async (req, res) => {
  const { userId, name, email, university } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Update user profile in signup table
    const { data, error } = await supabase
      .from('signup')
      .update({ 
        name: name || null, 
        email: email || null,
        university: university || null
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Database error", details: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Also update in login table if email changed
    if (email) {
      const { error: loginError } = await supabase
        .from('login')
        .update({ login_email: email })
        .eq('login_email', data[0].email);

      if (loginError) {
        console.error("Supabase error:", loginError);
      }
    }

    return res.json({ 
      success: true, 
      message: "Profile updated successfully",
      user: data[0]
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

// Get user profile
router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from('signup')
      .select('id, name, email, university, points, created_at')
      .eq('id', userId);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Database error", details: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: data[0] });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

export default router;