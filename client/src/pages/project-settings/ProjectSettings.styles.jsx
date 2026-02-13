import styled from 'styled-components';

export const SettingsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
`;

export const SettingsHeader = styled.div`
  margin-bottom: 2rem;
`;

export const SettingsTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  margin-bottom: 0.5rem;
`;

export const SettingsSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

export const Section = styled.div`
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e4e4e7;
`;

export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #18181b;
  margin: 0;
  margin-bottom: 0.25rem;
`;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

export const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6366f1;
  background: #f0f0ff;
  border: 1px solid #6366f1;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #6366f1;
    color: #fff;
  }
`;

export const SectionContent = styled.div`
  padding: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const RequiredMark = styled.span`
  color: #ef4444;
  margin-left: 0.25rem;
`;

export const Input = styled.input`
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'secondary' ? `
    background: #fff;
    border: 1px solid #d1d5db;
    color: #374151;

    &:hover:not(:disabled) {
      background: #f9fafb;
    }
  ` : props.variant === 'destructive' ? `
    background: #dc2626;
    border: 1px solid #dc2626;
    color: #fff;

    &:hover:not(:disabled) {
      background: #b91c1c;
    }
  ` : `
    background: #6366f1;
    border: 1px solid #6366f1;
    color: #fff;

    &:hover:not(:disabled) {
      background: #4f46e5;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 0.375rem;
  color: #16a34a;
  font-size: 0.875rem;
`;

export const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const MetaLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const MetaValue = styled.span`
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
`;

export const DangerZone = styled.div`
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

export const DangerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const DangerIconWrapper = styled.div`
  flex-shrink: 0;
`;

export const DangerTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #991b1b;
  margin: 0;
  margin-bottom: 0.25rem;
`;

export const DangerDescription = styled.p`
  font-size: 0.875rem;
  color: #b91c1c;
  margin: 0;
`;

export const DangerContent = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e4e4e7;
  margin: 1.5rem 0;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const LoadingSkeleton = styled.div`
  height: ${props => props.$height || '1rem'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.375rem;

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export const Select = styled.select`
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background: #f9fafb;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e4e4e7;

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #374151;
`;

export const TableBody = styled.tbody``;

export const AvatarWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

export const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const MemberName = styled.span`
  font-weight: 500;
  color: #111827;
`;

export const MemberEmail = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

export const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  
  ${props => props.$role === 'OWNER' ? `
    background: #fef3c7;
    color: #92400e;
  ` : props.$role === 'ADMIN' ? `
    background: #dbeafe;
    color: #1e40af;
  ` : `
    background: #f3f4f6;
    color: #374151;
  `}
`;

export const ActionButton = styled(Button)`
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid #e4e4e7;
  margin-bottom: 1.5rem;
  overflow-x: auto;
`;

export const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.$active ? '#6366f1' : '#6b7280'};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#6366f1' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: #6366f1;
  }
`;

export const TabContent = styled.div``;

export const PendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const PendingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: 1px solid #e4e4e7;
  border-radius: 0.5rem;
`;

export const PendingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const PendingEmail = styled.span`
  font-weight: 500;
  color: #111827;
`;

export const PendingRole = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

export const PendingActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ResendButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6366f1;
  background: transparent;
  border: 1px solid #6366f1;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #6366f1;
    color: #fff;
  }
`;

export const CancelButton = styled.button`
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #dc2626;
  background: transparent;
  border: 1px solid #dc2626;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    color: #fff;
  }
`;
