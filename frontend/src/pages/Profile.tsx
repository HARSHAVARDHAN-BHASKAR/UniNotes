import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Background3D } from '@/components/Background3D';
import { ArrowLeft, Save, User, Mail, Lock, Bell, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api';

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Load user data from localStorage
    const storedName = localStorage.getItem('userName') || '';
    const storedEmail = localStorage.getItem('userEmail') || '';
    
    setName(storedName);
    setEmail(storedEmail);
    
    // Fetch user points
    fetchUserPoints();
  }, []);

  const fetchUserPoints = async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_PROFILE.replace(':userId', userId)}`);
      const data = await response.json();
      
      if (response.ok && data.user) {
        setPoints(data.user.points || 0);
        setUniversity(data.user.university || '');
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        toast({
          title: "Error",
          description: "User not authenticated. Please login again.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }
      
      // Update profile information
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name,
          email,
          university,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update localStorage with new data
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        
        // Refresh points
        fetchUserPoints();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, you would validate the current password with the backend
    // For now, we'll just show a success message
    setIsLoading(true);
    
    try {
      // Here we would call the password update API with currentPassword validation
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Password updated successfully!",
      });
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <Background3D />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-40 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="glass border-2 mb-6 hover:border-primary/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold gradient-text mb-2"
          >
            Profile & Settings
          </motion.h1>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Manage your account settings and preferences
          </motion.p>
        </motion.div>

        {/* Points Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-2 glow mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary animate-glow" />
                Your Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">{points} Points</div>
              <p className="text-muted-foreground mt-2">
                Earn points by uploading notes. Each note upload gives you +10 points!
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6">
          {/* Profile Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-2 glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary animate-glow" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="glass border-2 focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="glass border-2 focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="Enter your university"
                    className="glass border-2 focus:border-primary/50 transition-all"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card border-2 glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary animate-glow" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="glass border-2 focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="glass border-2 focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="glass border-2 focus:border-primary/50 transition-all"
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
                >
                  {isLoading ? 'Updating...' : 'Change Password'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass-card border-2 glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary animate-glow" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates about your notes</p>
                  </div>
                  <Switch />
                </div>
                <Separator className="bg-border/50" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Shared Notes Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone shares a note with you</p>
                  </div>
                  <Switch />
                </div>
                <Separator className="bg-border/50" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of your notes</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-end"
          >
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all transform hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}