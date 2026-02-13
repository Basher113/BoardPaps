import { Badge } from './PriorityBadge.styles';

const PriorityBadge = ({ priority }) => {
  return <Badge $priority={priority}>{priority}</Badge>;
};

export default PriorityBadge;