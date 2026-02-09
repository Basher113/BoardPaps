import { Menu, Search, Plus, Users } from 'lucide-react';
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
  CreateButton,
  MobileSearchWrapper,
  MembersWrapper,
  MemberAvatarWrapper,
  InviteButton,
  InviteButtonText
} from './Header.styles';
import UserAvatar from '../../../../components/ui/user-avatar/UserAvatar';

const Header = ({
  boardName,
  projectName,
  searchQuery,
  setSearchQuery,
  searchOpen,
  setSearchOpen,
  onCreateIssue,
  onMenuToggle,
  onInvite,
  canInvite,
  projectMembers
}) => {
  // Show max 5 avatars
  const displayedMembers = projectMembers?.slice(0, 5) || [];
  const remainingCount = (projectMembers?.length || 0) - 5;
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <HeaderLeft>
          <MenuToggle onClick={onMenuToggle}>
            <Menu size={24} />
          </MenuToggle>
          <HeaderTitleWrapper>
            <BoardTitle>{boardName}</BoardTitle>
            <ProjectSubtitle>Project: {projectName}</ProjectSubtitle>
          </HeaderTitleWrapper>
        </HeaderLeft>
        
        <HeaderRight>
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
          <SearchToggle onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20} />
          </SearchToggle>
          
          <SearchWrapper>
            <SearchIconWrapper>
              <Search size={20} />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>
          
          <CreateButton onClick={onCreateIssue}>
            <Plus size={16} />
            <div>Create</div>
          </CreateButton>
          
          {canInvite && (
            <InviteButton onClick={onInvite}>
              <Users size={16} />
              <InviteButtonText>Invite</InviteButtonText>
            </InviteButton>
          )}
        </HeaderRight>
      </HeaderContent>
      
      {searchOpen && (
        <MobileSearchWrapper>
          <SearchWrapper style={{ display: 'block' }}>
            <SearchIconWrapper>
              <Search size={20} />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </SearchWrapper>
        </MobileSearchWrapper>
      )}
    </HeaderContainer>
  );
};

export default Header;
