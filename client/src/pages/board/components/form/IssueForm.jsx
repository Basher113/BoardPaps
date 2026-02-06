import React, { useState, useMemo } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  FormGrid,
  FormActions,
  Button,
  ErrorMessage,
  RequiredMark
} from './Form.styles';

const getInitialFormData = (issue, currentUserId) => {
  if (issue) {
    return {
      title: issue.title || '',
      description: issue.description || '',
      type: issue.type || 'TASK',
      priority: issue.priority || 'MEDIUM',
      assigneeId: issue.assigneeId || issue.assignee?.id || ''
    };
  }
  return {
    title: '',
    description: '',
    type: 'TASK',
    priority: 'MEDIUM',
    assigneeId: currentUserId || ''
  };
};

const IssueForm = ({ 
  issue, 
  onSubmit, 
  onCancel, 
  currentUserId, 
  projectMembers,
  columnId,
  isLoading = false 
}) => {
  // Use useMemo to compute initial state based on issue
  const initialData = useMemo(
    () => getInitialFormData(issue, currentUserId),
    [issue, currentUserId]
  );
  
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Reset form when issue changes (key prop should be used on parent)
  // This is handled by the parent component remounting the form
  
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
      assigneeId: true
    });
    
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      const submitData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        assigneeId: formData.assigneeId || null
      };
      
      // Include columnId for create mode
      if (!issue && columnId) {
        submitData.columnId = columnId;
      }
      
      onSubmit(submitData);
    }
  };
  
  const isEditMode = !!issue;
  
  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormGroup>
        <Label htmlFor="issue-title">
          Title <RequiredMark>*</RequiredMark>
        </Label>
        <Input
          id="issue-title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="Enter issue title"
          $hasError={touched.title && errors.title}
          aria-invalid={touched.title && errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
          disabled={isLoading}
          autoFocus
        />
        {touched.title && errors.title && (
          <ErrorMessage id="title-error" role="alert">
            {errors.title}
          </ErrorMessage>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="issue-description">Description</Label>
        <TextArea
          id="issue-description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Enter issue description (optional)"
          rows="3"
          $hasError={touched.description && errors.description}
          aria-invalid={touched.description && errors.description ? 'true' : 'false'}
          aria-describedby={errors.description ? 'description-error' : undefined}
          disabled={isLoading}
        />
        {touched.description && errors.description && (
          <ErrorMessage id="description-error" role="alert">
            {errors.description}
          </ErrorMessage>
        )}
      </FormGroup>
      
      <FormGrid>
        <FormGroup>
          <Label htmlFor="issue-type">Type</Label>
          <Select
            id="issue-type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            disabled={isLoading}
          >
            <option value="TASK">Task</option>
            <option value="BUG">Bug</option>
            <option value="STORY">Story</option>
            <option value="EPIC">Epic</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="issue-priority">Priority</Label>
          <Select
            id="issue-priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            disabled={isLoading}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </Select>
        </FormGroup>
      </FormGrid>
      
      <FormGroup>
        <Label htmlFor="issue-assignee">Assignee</Label>
        <Select
          id="issue-assignee"
          value={formData.assigneeId || ''}
          onChange={(e) => handleChange('assigneeId', e.target.value || null)}
          disabled={isLoading}
        >
          <option value="">Unassigned</option>
          {memberUsers.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </Select>
      </FormGroup>
      
      <FormActions>
        <Button 
          type="button" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (isEditMode ? 'Update Issue' : 'Create Issue')}
        </Button>
      </FormActions>
    </Form>
  );
};

export default IssueForm;
