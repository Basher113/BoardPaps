import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  SettingsContainer,
  SettingsHeader,
  SettingsTitle,
  SettingsSubtitle,
  TabsContainer,
  Tab,
  TabContent,
  LoadingSkeleton
} from './ProjectSettings.styles';
import {
  useGetProjectSettingsQuery
} from '../../reducers/slices/project/project.apiSlice';
import { useGetCurrentUserQuery } from '../../reducers/slices/user/user.slice';
import { setActiveView } from '../../reducers/slices/navigation/navigation.slice';

// Sub-components (each handles its own state and API calls)
import GeneralSettings from './components/general/GeneralSettings';
import MembersList from './components/members/MembersList';
import InvitationsList from './components/invitations/InvitationsList';
import DangerZone from './components/danger-zone/DangerZone';

const ProjectSettings = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  // Set active view on mount
  useEffect(() => {
    dispatch(setActiveView('project-settings'));
  }, [dispatch]);

  // Tab state
  const [activeTab, setActiveTab] = useState('general');

  // Get current user
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUserId = currentUserData?.id;

  // Queries
  const { data: project, isLoading: projectLoading, refetch: refetchProject } = useGetProjectSettingsQuery(projectId);

  // Determine if user is owner
  const isOwner = project?.owner?.id === currentUserId || 
    project?.members?.some(m => m.user.id === currentUserId && m.role === 'OWNER');
  
  // Determine if user can manage settings
  const canManageSettings = project?.members?.some(m => 
    m.user.id === currentUserId && (m.role === 'OWNER' || m.role === 'ADMIN')
  );

  if (projectLoading) {
    return (
      <SettingsContainer>
        <SettingsHeader>
          <SettingsTitle>Project Settings</SettingsTitle>
          <SettingsSubtitle>Loading...</SettingsSubtitle>
        </SettingsHeader>
        <LoadingSkeleton $height="3rem" />
        <div style={{ marginTop: '1.5rem' }} />
        <LoadingSkeleton $height="3rem" />
      </SettingsContainer>
    );
  }

  if (!project) {
    return (
      <SettingsContainer>
        <SettingsHeader>
          <SettingsTitle>Project Settings</SettingsTitle>
          <SettingsSubtitle>Project not found</SettingsSubtitle>
        </SettingsHeader>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>{project.name} Settings</SettingsTitle>
        <SettingsSubtitle>Manage your project settings and members</SettingsSubtitle>
      </SettingsHeader>

      <TabsContainer>
        <Tab $active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
          General
        </Tab>
        <Tab $active={activeTab === 'members'} onClick={() => setActiveTab('members')}>
          Members ({project.members?.length || 0})
        </Tab>
        <Tab $active={activeTab === 'invitations'} onClick={() => setActiveTab('invitations')}>
          Invitations ({project.invitations?.length || 0})
        </Tab>
        {isOwner && (
          <Tab $active={activeTab === 'danger'} onClick={() => setActiveTab('danger')}>
            Danger Zone
          </Tab>
        )}
      </TabsContainer>

      <TabContent>
        {activeTab === 'general' && (
          <GeneralSettings
            project={project}
            canManageSettings={canManageSettings}
            refetchProject={refetchProject}
          />
        )}

        {activeTab === 'members' && (
          <MembersList
            project={project}
            currentUserId={currentUserId}
            canManageSettings={canManageSettings}
            refetchProject={refetchProject}
          />
        )}

        {activeTab === 'invitations' && (
          <InvitationsList
            project={project}
          />
        )}

        {activeTab === 'danger' && isOwner && (
          <DangerZone
            project={project}
            currentUserId={currentUserId}
            refetchProject={refetchProject}
          />
        )}
      </TabContent>
    </SettingsContainer>
  );
};

export default ProjectSettings;
