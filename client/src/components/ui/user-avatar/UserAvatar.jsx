import { Avatar } from './UserAvatar.styles';
import { usersData } from '../../../utils/data';
const UserAvatar = ({ userId, size = 'sm' }) => {
  const user = usersData.find(u => u.id === userId);
  if (!user) return null;
  
  return (
    <Avatar size={size} gradient={user.color} title={user.fullName}>
      {user.avatar}
    </Avatar>
  );
};



export default UserAvatar;