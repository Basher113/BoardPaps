import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
  Form,
  FormGroup,
  Label,
  RequiredMark,
  Input,
  Button,
  FormActions,
  ErrorMessage,
  MetaInfo,
  MetaItem,
  MetaLabel,
  MetaValue,
  Divider,
  FormRow,
  HelperText,
  LoadingSkeleton
} from '../../Settings.styles';
import UserAvatar from '../../../../components/ui/user-avatar/UserAvatar';
import { XCircle, Upload, Trash2 as TrashIcon } from 'lucide-react';
import {
  useUpdateUserProfileMutation,
  useUploadUserAvatarMutation,
  useDeleteUserAvatarMutation
} from '../../../../reducers/slices/settings/settings.apiSlice';
import { useGetCurrentUserQuery } from '../../../../reducers/slices/user/user.slice';

const ProfileSection = () => {
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: updateProfileLoading, error: updateProfileError }] = useUpdateUserProfileMutation();
  const [uploadAvatar, { isLoading: uploadAvatarLoading }] = useUploadUserAvatarMutation();
  const [deleteAvatar, { isLoading: deleteAvatarLoading }] = useDeleteUserAvatarMutation();

  // Use useMemo to derive initial form values from profile
  const initialFormValues = useMemo(() => ({
    username: profile?.username || '',
    email: profile?.email || '',
  }), [profile]);

  const [profileForm, setProfileForm] = useState(initialFormValues);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await uploadAvatar(formData).unwrap();
      toast.success('Avatar updated successfully');
      refetchProfile();
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      toast.error(err.data?.message || 'Failed to upload avatar');
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar().unwrap();
      toast.success('Avatar deleted successfully');
      refetchProfile();
    } catch (err) {
      console.error('Failed to delete avatar:', err);
      toast.error(err.data?.message || 'Failed to delete avatar');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profileForm.username === profile.username) return;
      await updateProfile(profileForm).unwrap();
      refetchProfile();
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (profileLoading) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>Profile Information</SectionTitle>
          <SectionDescription>Loading...</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <LoadingSkeleton $height="3rem" />
          <div style={{ marginTop: '1.5rem' }} />
          <LoadingSkeleton $height="3rem" />
        </SectionContent>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Profile Information</SectionTitle>
        <SectionDescription>Update your personal information and account details</SectionDescription>
      </SectionHeader>
      <SectionContent>
        {/* Avatar Section */}
        <div style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem',
          padding: '1.5rem',
          backgroundColor: '#fafafa',
          borderRadius: '0.75rem',
          border: '1px solid #e4e4e7'
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <UserAvatar user={profile} size="2xl" />
            </div>
            <Label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
              <div style={{ 
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '32px',
                height: '32px',
                backgroundColor: '#f4f4f5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <Upload size={14} color="#71717a" />
              </div>
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
              disabled={uploadAvatarLoading}
            />
          </div>
          <div>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              color: '#18181b',
              margin: 0,
              marginBottom: '0.25rem'
            }}>
              Profile Photo
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#71717a',
              margin: 0,
              marginBottom: '0.75rem'
            }}>
              {profile?.avatar ? 'Click to change your photo' : 'Add a photo to personalize your profile'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {profile?.avatar && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleDeleteAvatar}
                  disabled={deleteAvatarLoading}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                >
                  <TrashIcon size={14} style={{ marginRight: '0.375rem' }} />
                  Remove
                </Button>
              )}
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#a1a1aa' }}>
              JPG, PNG, GIF or WebP. Max 5MB.
            </p>
          </div>
        </div>

        <Form onSubmit={handleProfileSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="username">
                Username
                <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                id="username"
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">
                Email Address
                <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                disabled
                placeholder="Enter your email"
                autoComplete="email"
              />
              <HelperText>Email cannot be changed</HelperText>
            </FormGroup>
          </FormRow>

          {updateProfileError && (
            <ErrorMessage>
              <XCircle size={14} />
              {updateProfileError.data?.errors?.username?.[0] ||
                updateProfileError.data?.errors?.email?.[0] ||
                'Failed to update profile'}
            </ErrorMessage>
          )}

          <FormActions>
            <Button type="submit" disabled={updateProfileLoading}>
              {updateProfileLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </FormActions>

          <Divider />

          <MetaInfo>
            <MetaItem>
              <MetaLabel>Account Created</MetaLabel>
              <MetaValue>{formatDate(profile?.createdAt)}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Sign-in Method</MetaLabel>
              <MetaValue>{profile?.provider === 'google' ? 'Google Account' : 'Email & Password'}</MetaValue>
            </MetaItem>
          </MetaInfo>
        </Form>
      </SectionContent>
    </Section>
  );
};

export default ProfileSection;
