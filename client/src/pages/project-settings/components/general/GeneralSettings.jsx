import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  Section,
  SectionHeader,
  SectionHeaderContent,
  SectionTitle,
  SectionDescription,
  SectionContent,
  Form,
  FormGroup,
  FormRow,
  Label,
  RequiredMark,
  Input,
  Textarea,
  Select,
  Button,
  FormActions,
  ErrorMessage,
  DetailRow,
  DetailLabel,
  DetailValue,
} from '../../ProjectSettings.styles';
import Modal from '../../../../components/ui/modal/Modal';
import { useUpdateProjectMutation } from '../../../../reducers/slices/project/project.apiSlice';
import { logger } from '../../../../utils/logger';

const GeneralSettings = ({ project, canManageSettings, refetchProject }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionHeaderContent>
            <SectionTitle>General Details</SectionTitle>
            <SectionDescription>Basic information about your project.</SectionDescription>
          </SectionHeaderContent>
          {canManageSettings && (
            <Button 
              type="button" 
              onClick={() => setShowEditModal(true)}
              style={{ background: '#1a1a1a', color: 'white', border: 'none' }}
            >
              Edit Project
            </Button>
          )}
        </SectionHeader>
        <SectionContent>
          <DetailRow>
            <DetailLabel>Project Name</DetailLabel>
            <DetailValue>{project?.name || '—'}</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Project Key</DetailLabel>
            <DetailValue>{project?.key || '—'}</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Project Category</DetailLabel>
            <DetailValue>Software Design System</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>Project Description</DetailLabel>
            <DetailValue>{project?.description || 'No description provided.'}</DetailValue>
          </DetailRow>
        </SectionContent>
      </Section>

      {/* Edit Modal */}
      <GeneralSettingsEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        project={project}
        refetchProject={refetchProject}
      />
    </>
  );
};

// Edit Modal Component
const GeneralSettingsEditModal = ({
  isOpen,
  onClose,
  project,
  refetchProject
}) => {
  // Use useMemo to derive initial form values from project
  const initialFormValues = useMemo(() => ({
    name: project?.name || '',
    key: project?.key || '',
    description: project?.description || ''
  }), [project]);

  const [form, setForm] = useState(initialFormValues);
  const [error, setError] = useState('');

  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  // Reset form when modal opens
  const handleOpen = () => {
    setForm(initialFormValues);
    setError('');
  };

  const handleSubmit = async (e) => {
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

    try {
      await updateProject({
        projectId: project.id,
        ...form
      }).unwrap();
      toast.success('Project updated successfully');
      onClose();
      refetchProject();
    } catch (err) {
      logger.apiError('Project update', err);
      setError(err.data?.message || 'Failed to update project');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpen={handleOpen}
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
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter project description"
            style={{ minHeight: '80px' }}
          />
        </FormGroup>

        <FormActions>
          <Button type="button" $variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" $variant="primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </FormActions>
      </Form>
    </Modal>
  );
};

export default GeneralSettings;
