import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Background3D } from '@/components/Background3D';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, FileText, FlaskConical, LogOut, User } from 'lucide-react';

// Sample subjects data with theory and lab components
const subjectsData = [
  {
    id: 'math',
    name: 'Mathematics',
    code: 'MATH101',
    type: 'theory',
    semesters: ['1', '2', '3', '4'],
    color: 'from-blue-500 to-cyan-500',
    icon: BookOpen
  },
  {
    id: 'physics',
    name: 'Physics',
    code: 'PHY101',
    type: 'theory',
    semesters: ['1'],
    color: 'from-green-500 to-emerald-500',
    icon: BookOpen
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    code: 'CHEM101',
    type: 'theory',
    semesters: ['1'],
    color: 'from-purple-500 to-pink-500',
    icon: BookOpen
  },
  {
    id: 'physics_lab',
    name: 'Physics Lab',
    code: 'PHY101L',
    type: 'lab',
    semesters: ['1'],
    color: 'from-orange-500 to-red-500',
    icon: FlaskConical
  },
  {
    id: 'chemistry_lab',
    name: 'Chemistry Lab',
    code: 'CHEM101L',
    type: 'lab',
    semesters: ['1'],
    color: 'from-yellow-500 to-orange-500',
    icon: FlaskConical
  },
  {
    id: 'programming',
    name: 'Programming',
    code: 'CS101',
    type: 'theory',
    semesters: ['2'],
    color: 'from-indigo-500 to-purple-500',
    icon: BookOpen
  },
  {
    id: 'data_structures',
    name: 'Data Structures',
    code: 'CS201',
    type: 'theory',
    semesters: ['3'],
    color: 'from-red-500 to-pink-500',
    icon: BookOpen
  },
  {
    id: 'english',
    name: 'English',
    code: 'ENG101',
    type: 'theory',
    semesters: ['1', '2'],
    color: 'from-teal-500 to-cyan-500',
    icon: BookOpen
  }
];

export default function Subjects() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const branch = localStorage.getItem('selectedBranch');
    const semester = localStorage.getItem('selectedSemester');
    
    if (!userId) {
      navigate('/auth');
      return;
    }
    
    if (!branch) {
      navigate('/branches');
      return;
    }
    
    if (!semester) {
      navigate('/semesters');
      return;
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    setSelectedBranch(branch);
    setSelectedSemester(semester);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('selectedBranch');
    localStorage.removeItem('selectedSemester');
    navigate('/auth');
  };

  const handleSubjectSelect = (subjectId: string, subjectName: string) => {
    // Store selected subject name and navigate to dashboard
    localStorage.setItem('selectedSubject', subjectName);
    navigate('/dashboard');
  };

  const handleBackToSemesters = () => {
    localStorage.removeItem('selectedSubject');
    navigate('/semesters');
  };

  // Filter subjects based on semester
  const getFilteredSubjects = () => {
    if (!selectedSemester) return subjectsData;
    
    return subjectsData.filter(subject => 
      subject.semesters.includes(selectedSemester)
    );
  };

  const filteredSubjects = getFilteredSubjects();

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <Background3D />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-40 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBackToSemesters}
                variant="ghost"
                className="hover:bg-white/10 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Semesters
              </Button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">UniNotes</h1>
                <p className="text-muted-foreground">Welcome back, {userName || 'User'}!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                className="glass border-2 hover:border-primary/50 transition-all duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="glass border-2 hover:border-destructive/50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Subjects Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20, duration: 0.3 }}
            className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <FileText className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Select Your Subject</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose a subject to upload or view notes for Semester {selectedSemester}
          </p>
        </motion.div>

        {/* Subjects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSubjects.map((subject, index) => {
            const IconComponent = subject.icon;
            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.2 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="glass-card border-2 border-white/10 hover:border-primary/50 transition-all duration-200 cursor-pointer group glow"
                  onClick={() => handleSubjectSelect(subject.id, subject.name)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                      {subject.name}
                      {subject.type === 'lab' && (
                        <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-1 rounded-full">
                          Lab
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-primary font-semibold">
                      {subject.code}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubjectSelect(subject.id, subject.name);
                      }}
                    >
                      Select Subject
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}