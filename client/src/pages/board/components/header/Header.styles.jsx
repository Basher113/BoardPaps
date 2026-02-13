import styled from 'styled-components';

export const HeaderContainer = styled.header`
  background-color: #ffffff;
  border-bottom: 1px solid #e4e4e7;
  padding: 0.625rem 1rem;
  width: 100%;

  @media (min-width: 640px) {
    padding: 0.75rem 1.5rem;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const MenuToggle = styled.button`
  color: #52525b;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f4f4f5;
    color: #18181b;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const HeaderTitleWrapper = styled.div``;

export const BoardTitle = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  color: #18181b;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

export const ProjectSubtitle = styled.p`
  display: none;
  font-size: 0.75rem;
  color: #71717a;
  margin: 0;

  @media (min-width: 640px) {
    display: block;
    font-size: 0.875rem;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 640px) {
    gap: 0.75rem;
  }
`;

export const SearchToggle = styled.button`
  color: #52525b;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f4f4f5;
    color: #18181b;
  }

  @media (min-width: 640px) {
    display: none;
  }
`;

export const IconButton = styled.button`
  color: #52525b;
  background: none;
  border: none;
  padding: 0.375rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f4f4f5;
    color: #18181b;
  }
`;

export const SearchWrapper = styled.div`
  display: none;
  position: relative;
  align-items: center;

  @media (min-width: 640px) {
    display: flex;
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  display: flex;
  align-items: center;
  color: #71717a;
  pointer-events: none;
`;

export const SearchInput = styled.input`
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #18181b;
  background-color: #fafafa;
  width: 16rem;
  outline: none;
  transition: all 0.15s ease;

  &:focus {
    border-color: #18181b;
    background-color: #ffffff;
    box-shadow: 0 0 0 1px #18181b;
  }

  &::placeholder {
    color: #a1a1aa;
  }
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background-color: #18181b;
  color: #fafafa;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #27272a;
  }
`;

export const ButtonText = styled.span`
  font-weight: 500;
`;

export const MobileSearchWrapper = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid #e4e4e7;
  background-color: #ffffff;

  @media (min-width: 640px) {
    display: none;
  }
`;

export const MembersWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
`;

export const MemberAvatarWrapper = styled.div`
  margin-left: -0.5rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    transform: scale(1.1);
    z-index: 1;
  }
`;

export const InviteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background-color: #f4f4f5;
  color: #18181b;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #e4e4e7;
  }
`;

export const InviteButtonText = styled.span`
  font-weight: 500;
`;

export const SettingsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background-color: #f4f4f5;
  color: #18181b;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #e4e4e7;
  }
`;

export const SettingsButtonText = styled.span`
  font-weight: 500;
`;
