import { CheckCircle2, Bug, BookOpen, Target, Sparkles, ArrowUpCircle } from 'lucide-react';

const IssueTypeIcon = ({ type, size = 16 }) => {
  const icons = {
    TASK: <CheckCircle2 size={size} color="#3b82f6" />,
    BUG: <Bug size={size} color="#ef4444" />,
    STORY: <BookOpen size={size} color="#10b981" />,
    EPIC: <Target size={size} color="#a855f7" />,
    FEATURE: <Sparkles size={size} color="#f59e0b" />,
    IMPROVEMENT: <ArrowUpCircle size={size} color="#06b6d4" />
  };
  
  return icons[type] || icons.TASK;
};

export default IssueTypeIcon;