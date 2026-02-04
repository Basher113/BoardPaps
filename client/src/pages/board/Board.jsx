

import React, { useState } from 'react';
import {
  AppContainer,
  MainContent,
  BoardMain,
  BoardContainer,
  ContentCard,
  ContentTitle,
  TeamMemberCard,
  TeamMemberInfo,
  TeamMemberName,
  TeamMemberEmail,
  TeamMemberRole,
  CurrentUserBadge,
  SettingsGrid,
  SettingsField,
  SettingsLabel,
  SettingsInput
} from './Board.styles';

import Header from './components/header/Header';
import BoardColumn from './components/board-column/BoardColumn';
import Modal from '../../components/ui/modal/Modal';
import IssueForm from './components/form/IssueForm';
import UserAvatar from '../../components/ui/user-avatar/UserAvatar';

import { usersData } from '../../utils/data';
import { useDispatch, useSelector } from 'react-redux';

const projectData = {
  id: 'proj-1',
  name: 'TeamFlow Development',
  key: 'TFD',
  ownerId: 'user-1',
  createdAt: new Date('2024-01-15')
};

const boardData = {
  id: 'board-1',
  name: 'Sprint Board',
  projectId: 'proj-1'
};

const initialColumns = [
  { id: 'col-1', name: 'Backlog', position: 0, boardId: 'board-1' },
  { id: 'col-2', name: 'To Do', position: 1, boardId: 'board-1' },
  { id: 'col-3', name: 'In Progress', position: 2, boardId: 'board-1' },
  { id: 'col-4', name: 'Done', position: 3, boardId: 'board-1' }
];

const initialIssues = [
  {
    id: 'issue-1',
    title: 'Design new authentication flow',
    description: 'Create mockups for the new login experience',
    type: 'TASK',
    priority: 'HIGH',
    position: 0,
    columnId: 'col-1',
    boardId: 'board-1',
    reporterId: 'user-1',
    assigneeId: 'user-2'
  },
  {
    id: 'issue-2',
    title: 'Fix navigation bug on mobile',
    description: 'Users report menu not closing properly',
    type: 'BUG',
    priority: 'CRITICAL',
    position: 0,
    columnId: 'col-2',
    boardId: 'board-1',
    reporterId: 'user-1',
    assigneeId: 'user-3'
  },
  {
    id: 'issue-3',
    title: 'Implement drag and drop',
    description: 'Add DnD functionality to board columns',
    type: 'STORY',
    priority: 'MEDIUM',
    position: 1,
    columnId: 'col-2',
    boardId: 'board-1',
    reporterId: 'user-2',
    assigneeId: 'user-1'
  },
  {
    id: 'issue-4',
    title: 'API integration complete',
    description: 'Connected frontend with backend services',
    type: 'TASK',
    priority: 'HIGH',
    position: 0,
    columnId: 'col-3',
    boardId: 'board-1',
    reporterId: 'user-1',
    assigneeId: 'user-4'
  },
  {
    id: 'issue-5',
    title: 'User dashboard MVP',
    description: 'First version of analytics dashboard',
    type: 'EPIC',
    priority: 'LOW',
    position: 0,
    columnId: 'col-4',
    boardId: 'board-1',
    reporterId: 'user-3',
    assigneeId: 'user-2'
  },
  {
    id: 'issue-6',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    type: 'TASK',
    priority: 'MEDIUM',
    position: 1,
    columnId: 'col-1',
    boardId: 'board-1',
    reporterId: 'user-4',
    assigneeId: 'user-1'
  }
];

function Board() {
  const [issues, setIssues] = useState(initialIssues);
  const [draggedIssue, setDraggedIssue] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [newIssueColumnId, setNewIssueColumnId] = useState(null);
  const activeView = useSelector((state) => state.navigation.activeView);
  const dispatch = useDispatch();


  const currentUserId = "user-1";
  
  const handleDragStart = (e, issue) => {
    setDraggedIssue(issue);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnd = () => {
    setDraggedIssue(null);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, columnId) => {
    e.preventDefault();
    
    if (!draggedIssue) return;
    
    const canEdit = draggedIssue.assigneeId === currentUserId || draggedIssue.reporterId === currentUserId;
    if (!canEdit) return;
    
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === draggedIssue.id 
          ? { ...issue, columnId } 
          : issue
      )
    );
    
    setDraggedIssue(null);
  };
  
  const handleAddIssue = (columnId) => {
    setNewIssueColumnId(columnId);
    setEditingIssue(null);
    setModalOpen(true);
  };
  
  const handleEditIssue = (issue) => {
    setEditingIssue(issue);
    setNewIssueColumnId(null);
    setModalOpen(true);
  };
  
  const handleDeleteIssue = (issueId) => {
    setIssues(prevIssues => prevIssues.filter(issue => issue.id !== issueId));
  };
  
  const handleSubmitIssue = (formData) => {
    if (editingIssue) {
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue.id === editingIssue.id
            ? { ...issue, ...formData }
            : issue
        )
      );
    } else {
      const newIssue = {
        id: `issue-${Date.now()}`,
        ...formData,
        columnId: newIssueColumnId,
        boardId: 'board-1',
        reporterId: currentUserId,
        position: issues.filter(i => i.columnId === newIssueColumnId).length
      };
      setIssues(prevIssues => [...prevIssues, newIssue]);
    }
    setModalOpen(false);
    setEditingIssue(null);
    setNewIssueColumnId(null);
  };
  
  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  
  return (
    <AppContainer>
      <MainContent>
        <Header
          boardName={boardData.name}
          projectName={projectData.name}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          onCreateIssue={() => handleAddIssue('col-1')}
          onMenuToggle={() => {}}
        />
        
        <BoardMain>
          {activeView === 'board' && (
            <BoardContainer>
              {initialColumns.map(column => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  issues={filteredIssues}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onAddIssue={handleAddIssue}
                  onEdit={handleEditIssue}
                  onDelete={handleDeleteIssue}
                  currentUserId={currentUserId}
                  projectKey={projectData.key}
                />
              ))}
            </BoardContainer>
          )}
          
          {activeView === 'team' && (
            <ContentCard>
              <ContentTitle>Team Members</ContentTitle>
              <div>
                {usersData.map(user => (
                  <TeamMemberCard key={user.id}>
                    <UserAvatar userId={user.id} size="xl" />
                    <TeamMemberInfo>
                      <TeamMemberName>{user.fullName}</TeamMemberName>
                      <TeamMemberEmail>{user.email}</TeamMemberEmail>
                      <TeamMemberRole>
                        {user.id === projectData.ownerId ? 'Project Owner' : 'Team Member'}
                      </TeamMemberRole>
                    </TeamMemberInfo>
                    {user.id === currentUserId && (
                      <CurrentUserBadge>You</CurrentUserBadge>
                    )}
                  </TeamMemberCard>
                ))}
              </div>
            </ContentCard>
          )}
          
          {activeView === 'settings' && (
            <ContentCard>
              <ContentTitle>Project Settings</ContentTitle>
              <SettingsGrid>
                <SettingsField>
                  <SettingsLabel>Project Name</SettingsLabel>
                  <SettingsInput
                    type="text"
                    value={projectData.name}
                    readOnly
                  />
                </SettingsField>
                <SettingsField>
                  <SettingsLabel>Project Key</SettingsLabel>
                  <SettingsInput
                    type="text"
                    value={projectData.key}
                    readOnly
                  />
                </SettingsField>
                <SettingsField>
                  <SettingsLabel>Created At</SettingsLabel>
                  <SettingsInput
                    type="text"
                    value={projectData.createdAt.toLocaleDateString()}
                    readOnly
                  />
                </SettingsField>
              </SettingsGrid>
            </ContentCard>
          )}
        </BoardMain>
      </MainContent>
      
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingIssue(null);
          setNewIssueColumnId(null);
        }}
        title={editingIssue ? 'Edit Issue' : 'Create New Issue'}
      >
        <IssueForm
          issue={editingIssue}
          currentUserId={currentUserId}
          onSubmit={handleSubmitIssue}
          onCancel={() => {
            setModalOpen(false);
            setEditingIssue(null);
            setNewIssueColumnId(null);
          }}
        />
      </Modal>
    </AppContainer>
  );
}

export default Board;