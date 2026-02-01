import { Avatar } from './UserAvatar.styles';

const USERSDATA = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    username: 'johndoe',
    fullName: 'John Doe',
    avatar: 'JD',
    color: '#3b82f6, #9333ea',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'user-2',
    email: 'sarah.smith@example.com',
    username: 'sarahsmith',
    fullName: 'Sarah Smith',
    avatar: 'SS',
    color: '#10b981, #14b8a6',
    createdAt: new Date('2024-01-02')
  },
  {
    id: 'user-3',
    email: 'mike.wilson@example.com',
    username: 'mikewilson',
    fullName: 'Mike Wilson',
    avatar: 'MW',
    color: '#f97316, #dc2626',
    createdAt: new Date('2024-01-03')
  },
  {
    id: 'user-4',
    email: 'emma.brown@example.com',
    username: 'emmabrown',
    fullName: 'Emma Brown',
    avatar: 'EB',
    color: '#ec4899, #9333ea',
    createdAt: new Date('2024-01-04')
  }
];

const UserAvatar = ({ userId, size = 'sm' }) => {
  const user = USERSDATA.find(u => u.id === userId);
  if (!user) return null;
  
  return (
    <Avatar size={size} gradient={user.color} title={user.fullName}>
      {user.avatar}
    </Avatar>
  );
};

export {USERSDATA}


export default UserAvatar;