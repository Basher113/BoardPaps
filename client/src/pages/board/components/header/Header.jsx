import { Menu, Search, Plus } from 'lucide-react';
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
  ButtonText,
  MobileSearchWrapper
} from './Header.styles';

const Header = ({
  boardName,
  projectName,
  searchQuery,
  setSearchQuery,
  searchOpen,
  setSearchOpen,
  onCreateIssue,
  onMenuToggle
}) => {
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
            <ButtonText>Create</ButtonText>
          </CreateButton>
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