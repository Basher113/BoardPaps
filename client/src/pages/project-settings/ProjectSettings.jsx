import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  SettingsContainer,
  SettingsHeader,
  SettingsTitle,
  SettingsSubtitle,
  HeaderActions,
  SettingsGrid,
  SettingsNav,
  SettingsNavItem,
  SettingsContent,
  TabContent
} from './ProjectSettings.styles';
import {
  useGetProjectSettingsQuery
} from '../../reducers/slices/project/project.apiSlice';
import { useGetCurrentUserQuery } from '../../reducers/slices/user/user.slice';
import { setActiveView } from '../../reducers/slices/navigation/navigation.slice';
import { SettingsSectionSkeleton, Spinner } from '../../components/ui/skeleton/Skeleton';
import Button from '../../components/ui/button/Button';

// Sub-components (each handles its own state and API calls)
import GeneralSettings from './components/general/GeneralSettings';
import MembersList from './components/members/MembersList';
import InvitationsList from './components/invitations/InvitationsList';
import DangerZone from './components/danger-zone/DangerZone';
import ActivityList from './components/activity/ActivityList';
import WorkflowSettings from './components/workflow/WorkflowSettings';

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
  const { data: projectData, isLoading: projectLoading, refetch: refetchProject } = useGetProjectSettingsQuery(projectId);
  

  if (projectLoading) {
    return (
      <SettingsContainer>
        <SettingsHeader>
          <div>
            <SettingsTitle>Project Settings</SettingsTitle>
            <SettingsSubtitle>Loading...</SettingsSubtitle>
          </div>
        </SettingsHeader>
        <SettingsGrid>
          <SettingsNav>
            <SettingsNavItem $active><Spinner $size="14px" /> General</SettingsNavItem>
            <SettingsNavItem>Members</SettingsNavItem>
            <SettingsNavItem>Invitations</SettingsNavItem>
          </SettingsNav>
          <SettingsContent>
            <SettingsSectionSkeleton />
          </SettingsContent>
        </SettingsGrid>
      </SettingsContainer>
    );
  }

  const project = projectData.data;
  // Determine if user is owner (either via project.ownerId or via OWNER role in members)
  const isOwner = project?.owner?.id === currentUserId || 
    project?.members?.some(m => m.user.id === currentUserId && m.role === 'OWNER');
  
  // Determine if user can manage settings (owner or admin)
  const canManageSettings = isOwner || project?.members?.some(m => 
    m.user.id === currentUserId && m.role === 'ADMIN'
  );

  if (!project) {
    return (
      <SettingsContainer>
        <SettingsHeader>
          <div>
            <SettingsTitle>Project Settings</SettingsTitle>
            <SettingsSubtitle>Project not found</SettingsSubtitle>
          </div>
        </SettingsHeader>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsHeader>
        <div>
          <SettingsTitle>Project Settings</SettingsTitle>
          <SettingsSubtitle>
            Configure your project metadata, team permissions, and workflow logic for <strong>{project.name}</strong>.
          </SettingsSubtitle>
        </div>
        
      </SettingsHeader>

      <SettingsGrid>
        <SettingsNav>
          <SettingsNavItem 
            $active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')}
          >
            General Details
          </SettingsNavItem>
          <SettingsNavItem 
            $active={activeTab === 'members'} 
            onClick={() => setActiveTab('members')}
          >
            Members
          </SettingsNavItem>
          <SettingsNavItem 
            $active={activeTab === 'invitations'} 
            onClick={() => setActiveTab('invitations')}
          >
            Invitations
          </SettingsNavItem>
          <SettingsNavItem 
            $active={activeTab === 'workflow'} 
            onClick={() => setActiveTab('workflow')}
          >
            Workflow & Board
          </SettingsNavItem>
          {canManageSettings && (
            <SettingsNavItem 
              $active={activeTab === 'activity'} 
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </SettingsNavItem>
          )}
          <SettingsNavItem 
            $active={activeTab === 'danger'} 
            onClick={() => setActiveTab('danger')}
          >
            Danger Zone
          </SettingsNavItem>
        </SettingsNav>

        <SettingsContent>
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

          {activeTab === 'workflow' && (
            <WorkflowSettings
              project={project}
              canManageSettings={canManageSettings}
            />
          )}

          {activeTab === 'activity' && canManageSettings && (
            <ActivityList
              projectId={project.id}
              members={project.members}
            />
          )}

          {activeTab === 'danger' && (
            <DangerZone
              project={project}
              currentUserId={currentUserId}
              refetchProject={refetchProject}
              isOwner={isOwner}
            />
          )}
        </SettingsContent>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default ProjectSettings;
