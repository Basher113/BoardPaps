import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  SettingsContainer,
  SettingsHeader,
  SettingsTitle,
  SettingsSubtitle
} from './Settings.styles';

import { useDispatch } from 'react-redux';
import { setActiveView } from '../../reducers/slices/navigation/navigation.slice';
import { SettingsSectionSkeleton, Spinner, LoadingContainer, LoadingText } from '../../components/ui/skeleton/Skeleton';

// Sub-components (each handles its own state and API calls)
import ProfileSection from './components/profile-section/ProfileSection';
import SecuritySection from './components/security-section/SecuritySection';
import DangerZoneSection from './components/danger-zone/DangerZone';

const Settings = () => {
  const dispatch = useDispatch();

  // Get Clerk user info
  const { user, isLoaded } = useUser();
  
  // Check if user has a password set (can change password)
  // passwordEnabled is true for email/password users, false for pure OAuth users
  const hasPassword = user?.passwordEnabled;

  // Set active view on mount
  useEffect(() => {
    dispatch(setActiveView('settings'));
  }, [dispatch]);

  // Show loading state while Clerk loads user data
  if (!isLoaded) {
    return (
      <SettingsContainer>
        <SettingsHeader>
          <SettingsTitle>Settings</SettingsTitle>
          <SettingsSubtitle>Loading your settings...</SettingsSubtitle>
        </SettingsHeader>
        <SettingsSectionSkeleton />
        <div style={{ marginTop: '1.5rem' }} />
        <SettingsSectionSkeleton />
        <div style={{ marginTop: '1.5rem' }} />
        <SettingsSectionSkeleton />
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>Settings</SettingsTitle>
        <SettingsSubtitle>Manage your account settings and security preferences</SettingsSubtitle>
      </SettingsHeader>

      {/* Profile Section - handles its own state and API calls */}
      <ProfileSection />

      {/* Security Section - handles its own state and API calls */}
      <SecuritySection hasPassword={hasPassword} />

      {/* Danger Zone - handles its own state and API calls */}
      <DangerZoneSection hasPassword={hasPassword} />
    </SettingsContainer>
  );
};

export default Settings;
