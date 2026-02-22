import { useNavigate } from 'react-router-dom';
import { Menu, Search, Plus, Users, Settings, Filter } from 'lucide-react';
import {
  HeaderContainer,
  HeaderContent,
  HeaderLeft,
  MenuToggle,
  HeaderTitleWrapper,
  BoardTitle,
  ProjectSubtitle,
  HeaderRight,
  SearchToggle,
  SearchWrapper,
  SearchIconWrapper,
  SearchInput,
  MobileSearchWrapper,
  MembersWrapper,
  MemberAvatarWrapper,
  InviteButton,
  SettingsButton,
  FilterButton,
} from './Header.styles';
import UserAvatar from '../../../../components/ui/user-avatar/UserAvatar';

const Header = ({
  boardName,
  projectName,
  projectId,
  searchQuery,
  setSearchQuery,
  searchOpen,
  onMenuToggle,
  onInvite,
  canInvite,
  projectMembers
}) => {
  const navigate = useNavigate();
  // Show max 5 avatars
  const displayedMembers = projectMembers?.slice(0, 5) || [];
  const remainingCount = (projectMembers?.length || 0) - 5;
  
  const handleSettingsClick = () => {
    navigate(`/project/${projectId}/settings`);
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <HeaderLeft>
          <MenuToggle onClick={onMenuToggle}>
            <Menu size={24} />
          </MenuToggle>
          <HeaderTitleWrapper>
            <BoardTitle>{boardName}</BoardTitle>
            <ProjectSubtitle>{projectName} • Board</ProjectSubtitle>
          </HeaderTitleWrapper>
        </HeaderLeft>
        
        <HeaderRight>
          <SearchWrapper>
            <SearchIconWrapper>
              <Search size={16} />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Search tasks..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery?.(e.target.value)}
            />
          </SearchWrapper>
          
          {projectMembers && projectMembers.length > 0 && (
            <MembersWrapper>
              {displayedMembers.map((member) => (
                <MemberAvatarWrapper key={member.userId} title={member.user.username}>
                  <UserAvatar user={member.user} size="sm" />
                </MemberAvatarWrapper>
              ))}
              {remainingCount > 0 && (
                <MemberAvatarWrapper title={`+${remainingCount} more members`}>
                  <UserAvatar user={{ username: `+${remainingCount}` }} size="sm" />
                </MemberAvatarWrapper>
              )}
            </MembersWrapper>
          )}
          
          {canInvite && (
            <InviteButton onClick={onInvite}>
              <Users size={16} />
            </InviteButton>
          )}
          
          <SettingsButton onClick={handleSettingsClick}>
            <Settings size={16} />
          </SettingsButton>
        </HeaderRight>
      </HeaderContent>
      
      {searchOpen && (
        <MobileSearchWrapper>
          <SearchWrapper style={{ display: 'flex', width: '100%' }}>
            <SearchIconWrapper>
              <Search size={16} />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Search tasks..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery?.(e.target.value)}
              style={{ width: '100%' }}
            />
          </SearchWrapper>
        </MobileSearchWrapper>
      )}
    </HeaderContainer>
  );
};

export default Header;
