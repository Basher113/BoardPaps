import React, { useState } from 'react';
import { X, ArrowRight, Search } from 'lucide-react';
import {
  DrawerOverlay,
  DrawerContainer,
  DrawerHeader,
  HeaderTop,
  ProjectTag,
  CloseButton,
  DrawerTitle,
  DrawerContent,
  FormSection,
  InputGroup,
  InputLabel,
  TitleInput,
  GridParams,
  SelectCustom,
  PersonnelWrapper,
  AssigneeSelect,
  TextAreaCustom,
  DrawerFooter,
  StatusMsg,
  ErrorMessage,
  DateInput,
  SearchIcon,
} from './IssueDrawer.styles';
import Button from '../../../../components/ui/button/Button';

const getInitialFormData = (issue, currentUserId) => {
  if (issue) {
    return {
      title: issue.title || '',
      description: issue.description || '',
      type: issue.type || 'TASK',
      priority: issue.priority || 'MEDIUM',
      assigneeId: issue.assigneeId || issue.assignee?.id || '',
      dueDate: issue.dueDate ? new Date(issue.dueDate).toISOString().split('T')[0] : ''
    };
  }
  return {
    title: '',
    description: '',
    type: 'TASK',
    priority: 'MEDIUM',
    assigneeId: currentUserId || '',
    dueDate: ''
  };
};

const IssueDrawerForm = ({
  issue,
  onSubmit,
  onClose,
  currentUserId,
  projectMembers,
  columnId,
  projectKey = 'PROJ',
  isLoading = false
}) => {
  // Initialize form state with a key-based reset pattern
  // When issue changes, the parent component passes a new key which remounts this component
  const [formData, setFormData] = useState(() => getInitialFormData(issue, currentUserId));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Get member users from project members
  const memberUsers = projectMembers?.map(member => member.user) || [];

  // Validation function
  const validate = (data) => {
    const newErrors = {};

    if (!data.title || data.title.trim().length === 0) {
      newErrors.title = 'Title is required';
    } else if (data.title.trim().length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (data.description && data.description.length > 5000) {
      newErrors.description = 'Description must be 5000 characters or less';
    }

    if (!['TASK', 'BUG', 'STORY', 'EPIC'].includes(data.type)) {
      newErrors.type = 'Invalid issue type';
    }

    if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(data.priority)) {
      newErrors.priority = 'Invalid priority';
    }

    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationErrors = validate(formData);
    setErrors(validationErrors);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      type: true,
      priority: true,
      assigneeId: true,
      dueDate: true
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const submitData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        assigneeId: formData.assigneeId || null,
        dueDate: formData.dueDate || null
      };

      // Include columnId for create mode
      if (!issue && columnId) {
        submitData.columnId = columnId;
      }

      onSubmit(submitData);
    }
  };

  const isEditMode = !!issue;

  // Handle click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <DrawerOverlay onClick={handleOverlayClick} />
      <DrawerContainer>
        <DrawerHeader>
          <HeaderTop>
            <ProjectTag>Project: {projectKey}</ProjectTag>
            <CloseButton onClick={onClose} aria-label="Close drawer">
              <X size={20} />
            </CloseButton>
          </HeaderTop>
          <DrawerTitle>{isEditMode ? 'Edit Issue' : 'New Issue'}</DrawerTitle>
        </DrawerHeader>

        <DrawerContent>
          <FormSection>
            <InputGroup>
              <InputLabel htmlFor="issue-title">Entry Title</InputLabel>
              <TitleInput
                id="issue-title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                placeholder="ISSUE_NAME_HERE"
                $hasError={touched.title && errors.title}
                disabled={isLoading}
                autoFocus
              />
              {touched.title && errors.title && (
                <ErrorMessage>{errors.title}</ErrorMessage>
              )}
            </InputGroup>
          </FormSection>

          <FormSection>
            <GridParams>
              <InputGroup>
                <InputLabel htmlFor="issue-type">Issue Type</InputLabel>
                <SelectCustom
                  id="issue-type"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  disabled={isLoading}
                >
                  <option value="TASK">TASK</option>
                  <option value="BUG">BUG</option>
                  <option value="STORY">STORY</option>
                  <option value="EPIC">EPIC</option>
                </SelectCustom>
              </InputGroup>

              <InputGroup>
                <InputLabel htmlFor="issue-priority">Priority</InputLabel>
                <SelectCustom
                  id="issue-priority"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  disabled={isLoading}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </SelectCustom>
              </InputGroup>
            </GridParams>
          </FormSection>

          <FormSection>
            <InputGroup>
              <InputLabel htmlFor="issue-assignee">Assignee</InputLabel>
              <PersonnelWrapper>
                <SearchIcon>
                  <Search size={16} />
                </SearchIcon>
                <AssigneeSelect
                  id="issue-assignee"
                  value={formData.assigneeId || ''}
                  onChange={(e) => handleChange('assigneeId', e.target.value || null)}
                  disabled={isLoading}
                >
                  <option value="">UNASSIGNED</option>
                  {memberUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username?.toUpperCase() || user.email?.toUpperCase()}
                    </option>
                  ))}
                </AssigneeSelect>
              </PersonnelWrapper>
            </InputGroup>

            <InputGroup>
              <InputLabel htmlFor="issue-dueDate">Due Date</InputLabel>
              <DateInput
                id="issue-dueDate"
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => handleChange('dueDate', e.target.value || null)}
                disabled={isLoading}
                min={new Date().toISOString().split('T')[0]}
              />
            </InputGroup>
          </FormSection>

          <FormSection>
            <InputGroup>
              <InputLabel htmlFor="issue-description">Description</InputLabel>
              <TextAreaCustom
                id="issue-description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                placeholder="DEFINE_SCOPE_AND_REQUIREMENTS..."
                disabled={isLoading}
              />
              {touched.description && errors.description && (
                <ErrorMessage>{errors.description}</ErrorMessage>
              )}
            </InputGroup>
          </FormSection>
        </DrawerContent>

        <DrawerFooter>
          <StatusMsg>
            {isLoading ? 'Processing...' : 'System Ready // Waiting for commit'}
          </StatusMsg>
          <Button
            
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isEditMode ? 'Execute Update' : 'Execute Create')}
            {!isLoading && <ArrowRight size={16} />}
          </Button>
        </DrawerFooter>
      </DrawerContainer>
    </>
  );
};

// Wrapper component that handles isOpen conditional rendering
// Uses key prop to force remount when issue changes, ensuring fresh form state
const IssueDrawer = ({
  isOpen,
  issue,
  onSubmit,
  onClose,
  currentUserId,
  projectMembers,
  columnId,
  projectKey = 'PROJ',
  isLoading = false
}) => {
  if (!isOpen) return null;

  // Use issue.id as key to force remount when switching between issues
  // For create mode (no issue), use 'create' as key
  const formKey = issue?.id || 'create';

  return (
    <IssueDrawerForm
      key={formKey}
      issue={issue}
      onSubmit={onSubmit}
      onClose={onClose}
      currentUserId={currentUserId}
      projectMembers={projectMembers}
      columnId={columnId}
      projectKey={projectKey}
      isLoading={isLoading}
    />
  );
};

export default IssueDrawer;
