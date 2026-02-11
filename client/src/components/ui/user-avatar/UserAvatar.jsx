import { Avatar } from './UserAvatar.styles';

const UserAvatar = ({ user, size = 'sm' }) => {
  if (!user) return null;
  
  // Check if avatar is a valid URL (Cloudinary or other)
  const isAvatarUrl = user?.avatar && (
    user.avatar.startsWith('http') || 
    user.avatar.startsWith('/')
  );
  
  const fullName = user.fullName || user.username;
  const color = user.color || '#3b82f6, #9333ea';
  
  return (
    <Avatar $size={size} gradient={color} title={fullName}>
      {isAvatarUrl ? (
        <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'
      )}
    </Avatar>
  );
};



export default UserAvatar;