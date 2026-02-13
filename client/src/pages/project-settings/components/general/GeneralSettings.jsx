import { useState, useEffect } from 'react';
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
  LoadingSkeleton,
} from '../../ProjectSettings.styles';
import Modal from '../../../../components/ui/modal/Modal';

const GeneralSettings = ({
  project,
  canManageSettings,
  onEdit
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!project) {
    return <LoadingSkeleton $height="200px" />;
  }

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>General Information</SectionTitle>
        <SectionDescription>View and edit your project details</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          {canManageSettings && (
            <Button type="button" onClick={onEdit}>
              Edit Project
            </Button>
          )}
        </div>

        <MetaInfo>
          <MetaItem>
            <MetaLabel>Project Name</MetaLabel>
            <MetaValue>{project.name}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Project Key</MetaLabel>
            <MetaValue>{project.key}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Description</MetaLabel>
            <MetaValue>{project.description || 'No description'}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Created</MetaLabel>
            <MetaValue>{formatDate(project.createdAt)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Owner</MetaLabel>
            <MetaValue>{project.owner?.username}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Members</MetaLabel>
            <MetaValue>{project.members?.length || 0}</MetaValue>
          </MetaItem>
        </MetaInfo>
      </SectionContent>
    </Section>
  );
};

// Edit Modal Component
export const GeneralSettingsEditModal = ({
  isOpen,
  onClose,
  project,
  onSave,
  isLoading
}) => {
  const [form, setForm] = useState({
    name: '',
    key: '',
    description: ''
  });
  const [error, setError] = useState('');

  // Initialize form when modal opens
  useEffect(() => {
    const setFormEffect = () => {
       if (isOpen && project) {
        setForm({
          name: project.name || '',
          key: project.key || '',
          description: project.description || ''
        });
        setError('');
      }
    }
    setFormEffect();
  }, [isOpen, project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!form.key.trim()) {
      setError('Project key is required');
      return;
    }

    onSave(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
    >
      <Form onSubmit={handleSubmit}>
        {error && (
          <ErrorMessage style={{ marginBottom: '1rem' }}>
            {error}
          </ErrorMessage>
        )}

        <FormGroup>
          <Label htmlFor="name">
            Project Name
            <RequiredMark>*</RequiredMark>
          </Label>
          <Input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter project name"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="key">
            Project Key
            <RequiredMark>*</RequiredMark>
          </Label>
          <Input
            id="key"
            type="text"
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value.toUpperCase() })}
            placeholder="PROJ"
            maxLength={10}
            style={{ textTransform: 'uppercase' }}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            type="text"
            as="textarea"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter project description"
            style={{ minHeight: '80px', resize: 'vertical' }}
          />
        </FormGroup>

        <FormActions>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </FormActions>
      </Form>
    </Modal>
  );
};

export default GeneralSettings;
