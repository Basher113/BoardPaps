import styled from 'styled-components';

export const Content = styled.div`
  padding: 1.5rem 2rem;
  background-color: #fafafa;
 
  min-height: calc(100vh - 2rem);
`;

export const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const HeaderLeft = styled.div`
  flex: 1;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 0.375rem 0;
`;

export const Subtitle = styled.p`
  color: #71717a;
  margin: 0;
  font-size: 0.875rem;
`;

export const NewButton = styled.button`
  padding: 0.5rem 1rem;
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

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

export const ProjectCard = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.25rem;
  cursor: pointer;
  border: 1px solid #e4e4e7;
  transition: all 0.15s ease;

  &:hover {
    border-color: #d4d4d8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

export const ProjectName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 0.375rem 0;
`;

export const ProjectDescription = styled.p`
  font-size: 0.875rem;
  color: #71717a;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

export const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f4f4f5;
`;

export const MemberCount = styled.span`
  font-size: 0.75rem;
  color: #71717a;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #71717a;
`;

export const DeleteButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: transparent;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-left: auto;

  &:hover {
    background-color: #fef2f2;
    border-color: #f87171;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 32rem;
  width: 100%;
  z-index: 10;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
`;

export const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 1.5rem 0;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #18181b;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #f4f4f5;
    cursor: not-allowed;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  margin-bottom: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #18181b;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #f4f4f5;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid #e4e4e7;
  background-color: ${props => props.primary ? '#18181b' : '#ffffff'};
  color: ${props => props.primary ? '#ffffff' : '#18181b'};

  &:hover {
    background-color: ${props => props.primary ? '#27272a' : '#f4f4f5'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
