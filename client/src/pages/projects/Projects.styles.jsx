import styled from "styled-components";
export const Content = styled.div`
  padding: 2rem;

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
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
`;

export const Subtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
`;

export const NewButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #374151;
  }
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

export const ProjectCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  border: 1px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-color: #e5e7eb;
  }
`;

export const ProjectName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
`;

export const ProjectDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

export const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #9ca3af;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
`;

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;

  &:hover {
    background: #fee2e2;
  }
`;

/* Modal */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.5rem 0;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  outline: none;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  resize: vertical;
  min-height: 60px;
  outline: none;
  font-family: inherit;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  background: ${({ primary }) => (primary ? "#1a1a1a" : "#f3f4f6")};
  color: ${({ primary }) => (primary ? "white" : "#6b7280")};
`;
