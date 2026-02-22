import styled from 'styled-components';

// Page Layout
export const SettingsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

// Header
export const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SettingsTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0 0 0.5rem 0;
`;

export const SettingsSubtitle = styled.p`
  font-size: 0.875rem;
  color: #808080;
  margin: 0;
  max-width: 500px;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Settings Grid Layout
export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// Settings Navigation (Left Sidebar)
export const SettingsNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: sticky;
  top: 1rem;
  height: fit-content;

  @media (max-width: 1024px) {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
    position: static;
  }
`;

export const SettingsNavItem = styled.button`
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.$active ? '#1a1a1a' : '#808080'};
  background: ${props => props.$active ? '#ffffff' : 'transparent'};
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: left;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(0, 0, 0, 0.06)' : 'none'};
  font-weight: ${props => props.$active ? '600' : '500'};

  &:hover {
    background: ${props => props.$active ? '#ffffff' : 'rgba(0, 0, 0, 0.04)'};
    color: #1a1a1a;
  }

  @media (max-width: 1024px) {
    white-space: nowrap;
  }
`;

// Settings Content
export const SettingsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

// Section Card
export const Section = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${props => props.$danger && `
    border: 1px solid #ffcccc;
    background: #fffafa;
  `}
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const SectionHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.$danger ? '#ff4444' : '#1a1a1a'};
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin: 0;

  &::before {
    content: '';
    width: 4px;
    height: 1.125rem;
    background: ${props => props.$danger ? '#ff4444' : '#1a1a1a'};
    border-radius: 2px;
  }
`;

export const SectionDescription = styled.p`
  font-size: 0.8125rem;
  color: #808080;
  margin: 0;
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Form Elements
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

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const RequiredMark = styled.span`
  color: #ef4444;
  margin-left: 0.25rem;
`;

export const Input = styled.input`
  padding: 0.75rem 0.875rem;
  border: 1px solid #e8e8e8;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-family: inherit;
  color: #1a1a1a;
  background: #fafafa;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const Textarea = styled.textarea`
  padding: 0.75rem 0.875rem;
  border: 1px solid #e8e8e8;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-family: inherit;
  color: #1a1a1a;
  background: #fafafa;
  transition: all 0.3s ease;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  padding: 0.75rem 0.875rem;
  border: 1px solid #e8e8e8;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-family: inherit;
  color: #1a1a1a;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;

// Buttons
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.$variant === 'primary' && `
    background: #1a1a1a;
    color: white;

    &:hover:not(:disabled) {
      background: #2d2d2d;
      box-shadow: 0 6px 16px rgba(26, 26, 26, 0.18);
    }
  `}

  ${props => props.$variant === 'secondary' && `
    background: #ffffff;
    color: #1a1a1a;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    &:hover:not(:disabled) {
      background: #fafafa;
      border-color: #d0d0d0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
  `}

  ${props => props.$variant === 'danger' && `
    background: #ff4444;
    color: white;

    &:hover:not(:disabled) {
      background: #cc0000;
      box-shadow: 0 6px 16px rgba(204, 0, 0, 0.18);
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

// Detail Row (for read-only display)
export const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f8f8;

  &:last-child {
    border-bottom: none;
  }
`;

export const DetailLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const DetailValue = styled.span`
  font-size: 0.9375rem;
  color: #1a1a1a;
  font-weight: 500;
`;

// Tabs (Legacy - keeping for compatibility)
export const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #e4e4e7;
  margin-bottom: 1.5rem;
  overflow-x: auto;
`;

export const Tab = styled.button`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.$active ? '#18181b' : '#71717a'};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#18181b' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: #18181b;
  }
`;

export const TabContent = styled.div`
  flex: 1;
`;

// Table
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
`;

export const TableHeader = styled.thead``;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #f8f8f8;

  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

export const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #374151;
`;

// User Cell
export const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #1a1a1a;
  border: 1px solid #e0e0e0;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MemberName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
`;

export const MemberEmail = styled.span`
  font-size: 0.75rem;
  color: #808080;
`;

// Role Badge
export const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.$isLead ? '#1a1a1a' : '#f5f5f5'};
  color: ${props => props.$isLead ? 'white' : '#707070'};
  border: 1px solid ${props => props.$isLead ? '#1a1a1a' : '#e0e0e0'};
`;

// Action Button
export const ActionButton = styled.button`
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f5f5;
    color: #1a1a1a;
  }
`;

export const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Role Dropdown
export const RoleDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

export const RoleDropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.25rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 160px;
  overflow: hidden;
`;

export const RoleDropdownItem = styled.button`
  width: 100%;
  padding: 0.625rem 0.875rem;
  text-align: left;
  background: none;
  border: none;
  font-size: 0.8125rem;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f5f5f5;
  }
`;

// Danger Zone Items
export const DangerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${props => props.$first ? '0' : '1rem'};
  border-top: ${props => props.$first ? 'none' : '1px solid #ffeded'};
`;

export const DangerItemInfo = styled.div``;

export const DangerItemTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem;
`;

export const DangerItemDescription = styled.p`
  font-size: 0.75rem;
  color: #808080;
  margin: 0;
`;

// Messages
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

// Meta Info
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

// Legacy exports for compatibility
export const EditButton = styled.button``;
export const DangerZone = styled.div``;
export const DangerHeader = styled.div``;
export const DangerIconWrapper = styled.div``;
export const DangerTitle = styled.h3``;
export const DangerDescription = styled.p``;
export const DangerContent = styled.div``;
export const Divider = styled.hr``;
export const LoadingSkeleton = styled.div``;
export const AvatarWrapper = styled.div``;
export const MemberInfo = styled.div``;

// Pending Invitations styles
export const PendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const PendingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f8f8f8;

  &:last-child {
    border-bottom: none;
  }
`;

export const PendingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const PendingEmail = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
`;

export const PendingRole = styled.span`
  font-size: 0.75rem;
  color: #808080;
`;

export const PendingActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;


// Modal form styles
export const ModalFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const ModalLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
`;
