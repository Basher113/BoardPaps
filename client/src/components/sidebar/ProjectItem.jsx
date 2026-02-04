import React from 'react';
import { Folder, FolderOpen, LayoutDashboard, ChevronRight } from 'lucide-react';
import {
  ProjectItem as ProjectItemWrapper,
  ProjectButton,
  ProjectName,
  ExpandIcon,
  BoardDropdown,
  BoardItem,
} from './Sidebar.styles';
import { useGetProjectBoardsQuery } from '../../reducers/slices/project/project.apiSlice';

const ProjectItem = ({ 
  project, 
  isActive, 
  isExpanded, 
  onToggle, 
  onProjectClick,
  onBoardClick 
}) => {
  const { data: boards = [] } = useGetProjectBoardsQuery(project.id, {
    skip: !isExpanded,
  });
  
  return (
    <ProjectItemWrapper>
      <ProjectButton
        active={isActive}
        onClick={() => {
          if (!isActive) {
            onProjectClick(project.id);
          }
          onToggle();
        }}
      >
        {isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />}
        <ProjectName>{project.name}</ProjectName>
        {boards.length > 0 && (
          <ExpandIcon expanded={isExpanded}>
            <ChevronRight size={14} />
          </ExpandIcon>
        )}
      </ProjectButton>
      
      {boards.length > 0 && (
        <BoardDropdown expanded={isExpanded}>
          {boards.map((board) => (
            <BoardItem
              key={board.id}
              active={false}
              onClick={() => onBoardClick(project.id, board.id)}
            >
              <LayoutDashboard size={14} />
              <ProjectName>{board.name}</ProjectName>
            </BoardItem>
          ))}
        </BoardDropdown>
      )}
    </ProjectItemWrapper>
  );
};

export default ProjectItem;
