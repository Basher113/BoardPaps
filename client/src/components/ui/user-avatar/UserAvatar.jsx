import { Avatar } from './UserAvatar.styles';
import { usersData } from '../../../utils/data';

const UserAvatar = ({ userId, user, size = 'sm' }) => {
  let displayUser;
  
  if (user) {
    displayUser = user;
  } else if (userId) {
    displayUser = usersData.find(u => u.id === userId);
  }
  
  if (!displayUser) return null;
  
  const avatar = displayUser.avatar || displayUser.username?.charAt(0).toUpperCase() || displayUser.email?.charAt(0).toUpperCase() || '?';
  const fullName = displayUser.fullName || displayUser.username;
  const color = displayUser.color || '#3b82f6, #9333ea';
  
  return (
    <Avatar size={size} gradient={color} title={fullName}>
      {avatar}
    </Avatar>
  );
};



export default UserAvatar;