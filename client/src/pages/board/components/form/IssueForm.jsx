import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  FormGrid,
  FormActions,
  Button
} from './Form.styles';
import { USERSDATA } from '../../../../components/ui/user-avatar/UserAvatar';

const IssueForm = ({ issue, onSubmit, onCancel, currentUserId }) => {
  const [formData, setFormData] = useState(issue || {
    title: '',
    description: '',
    type: 'TASK',
    priority: 'MEDIUM',
    assigneeId: currentUserId
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Title</Label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Description</Label>
        <TextArea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
        />
      </FormGroup>
      
      <FormGrid>
        <FormGroup>
          <Label>Type</Label>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="TASK">Task</option>
            <option value="BUG">Bug</option>
            <option value="STORY">Story</option>
            <option value="EPIC">Epic</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Priority</Label>
          <Select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </Select>
        </FormGroup>
      </FormGrid>
      
      <FormGroup>
        <Label>Assignee</Label>
        <Select
          value={formData.assigneeId}
          onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
        >
          {USERSDATA.map(user => (
            <option key={user.id} value={user.id}>{user.fullName}</option>
          ))}
        </Select>
      </FormGroup>
      
      <FormActions>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {issue ? 'Update' : 'Create'} Issue
        </Button>
      </FormActions>
    </Form>
  );
};

export default IssueForm;