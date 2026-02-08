import styled from 'styled-components';

export const HeaderContainer = styled.header`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  width: 100%;
  @media (min-width: 640px) {
    padding: 1rem 1.5rem;
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
  color: #4b5563;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const HeaderTitleWrapper = styled.div``;

export const BoardTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;

  @media (min-width: 640px) {
    font-size: 1.5rem;
  }
`;

export const ProjectSubtitle = styled.p`
  display: none;
  font-size: 0.75rem;
  color: #6b7280;

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
    gap: 1rem;
  }
`;

export const SearchToggle = styled.button`
  color: #4b5563;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  @media (min-width: 640px) {
    display: none;
  }
`;

export const SearchWrapper = styled.div`
  display: none;
  position: relative;

  @media (min-width: 640px) {
    display: block;
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`;

export const SearchInput = styled.input`
  padding-left: 2.5rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  width: 12rem;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (min-width: 768px) {
    width: 16rem;
  }
`;

export const CreateButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;

  &:hover {
    background-color: #1d4ed8;
  }

  @media (min-width: 640px) {
    padding: 0.5rem 1rem;
    gap: 0.5rem;
  }
`;

export const ButtonText = styled.span`
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
`;

export const MobileSearchWrapper = styled.div`
  margin-top: 0.75rem;

  @media (min-width: 640px) {
    display: none;
  }
`;

export const MembersWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-right: 0.5rem;
`;

export const MemberAvatarWrapper = styled.div`
  margin-left: -0.5rem;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`;

export const MemberCountBadge = styled.div`
  background-color: #6b7280;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  margin-left: 0.25rem;
`;

export const InviteButton = styled.button`
  background-color: #10b981;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;

  &:hover {
    background-color: #059669;
  }

  @media (min-width: 640px) {
    padding: 0.5rem 1rem;
    gap: 0.5rem;
  }
`;

export const InviteButtonText = styled.span`
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
`;