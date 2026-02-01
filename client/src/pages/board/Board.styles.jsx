import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f3f4f6;
  overflow: hidden;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const BoardMain = styled.main`
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  padding: 0.75rem;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: min-content;
  padding-bottom: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

export const ContentCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

export const ContentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const TeamMemberCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

export const TeamMemberInfo = styled.div`
  flex: 1;
`;

export const TeamMemberName = styled.p`
  font-weight: 500;
`;

export const TeamMemberEmail = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const TeamMemberRole = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
`;

export const CurrentUserBadge = styled.span`
  background-color: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const SettingsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SettingsField = styled.div``;

export const SettingsLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const SettingsInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  font-family: inherit;
`;