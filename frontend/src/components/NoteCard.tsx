import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Heart, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface NoteCardProps {
  id: string;
  note_title: string;
  subject: string;
  department: string;
  semester: string;
  user_name: string;
  user_id: number;
  file_name: string;
  created_at: string;
  currentUserId?: number;
  onDownload?: (fileName: string) => void;
  onView?: (fileName: string) => void;
  onLike?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLiked?: boolean;
}

export const NoteCard = ({ 
  id, 
  note_title, 
  subject, 
  department,
  semester,
  user_name,
  user_id,
  file_name,
  created_at,
  currentUserId,
  onDownload,
  onView,
  onLike,
  onDelete,
  isLiked: initialIsLiked = false 
}: NoteCardProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(file_name);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView?.(file_name);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  const isOwner = currentUserId === user_id;

  return (
    <motion.div
      whileHover={{ 
        scale: 1.03, 
        rotateY: 5,
        z: 50,
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        duration: 0.2  // Add explicit duration
      }}
      style={{ transformStyle: 'preserve-3d' }}
      className="h-full"
    >
      <Card className="glass-card border-2 hover:border-primary/50 transition-all duration-200 hover:glow h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <FileText className="w-8 h-8 text-primary animate-glow" />
            <div className="flex items-center gap-2">
              {isOwner && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                  onClick={handleDelete}
                  className="p-1 hover:bg-red-500/10 rounded-full transition-colors duration-150"
                  title="Delete note"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}  // Faster transition
                onClick={handleLike}
                className="p-1 hover:bg-primary/10 rounded-full transition-colors duration-150"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors duration-150 ${
                    isLiked 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-muted-foreground hover:text-red-500'
                  }`}
                />
              </motion.button>
              <span className="text-xs text-muted-foreground">{created_at.split('T')[0]}</span>
            </div>
          </div>
          <CardTitle className="text-xl mt-2">{note_title}</CardTitle>
          <CardDescription>{subject}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-2">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.1 }}  // Faster animation
              className="px-3 py-1 text-xs rounded-full glass border border-primary/30 text-primary"
            >
              {department}
            </motion.span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.1 }}  // Faster animation
              className="px-3 py-1 text-xs rounded-full glass border border-accent/30 text-accent"
            >
              {semester}
            </motion.span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.1 }}  // Faster animation
              className="px-3 py-1 text-xs rounded-full glass border border-green-500/30 text-green-500"
            >
              {user_name}
            </motion.span>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button
            onClick={handleView}
            variant="outline"
            className="flex-1 border-primary/50 text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 transform hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};