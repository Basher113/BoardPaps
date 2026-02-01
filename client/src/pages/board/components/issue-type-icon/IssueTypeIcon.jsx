import { CheckCircle2, Bug, BookOpen, Target } from 'lucide-react';

const IssueTypeIcon = ({ type }) => {
  const icons = {
    TASK: <CheckCircle2 size={16} color="#3b82f6" />,
    BUG: <Bug size={16} color="#ef4444" />,
    STORY: <BookOpen size={16} color="#10b981" />,
    EPIC: <Target size={16} color="#a855f7" />
  };
  
  return icons[type] || icons.TASK;
};

export default IssueTypeIcon;