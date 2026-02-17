import styled from 'styled-components';

export const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
`;

export const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: #fff;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

export const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ActivityCount = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: auto;
`;

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e4e7;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #fff;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e4e4e7;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`;

export const ActivityAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ActivityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
`;

export const ActivityUser = styled.span`
  font-weight: 600;
  color: #111827;
`;

export const ActivityAction = styled.span`
  color: #374151;
`;

export const ActionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  background: ${props => props.$bgColor || '#f3f4f6'};
  color: ${props => props.$textColor || '#374151'};
`;

export const ActivityDetails = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

export const ActivityTimestamp = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

export const MetadataSection = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: #4b5563;
`;

export const MetadataItem = styled.div`
  display: flex;
  gap: 0.5rem;

  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }
`;

export const MetadataLabel = styled.span`
  font-weight: 500;
  color: #6b7280;
`;

export const MetadataValue = styled.span`
  color: #111827;
`;

export const ExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6366f1;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 0.25rem;

  &:hover {
    background: #f0f0ff;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
`;

export const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #6b7280;
`;

export const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const EmptyTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
`;

export const EmptyDescription = styled.p`
  font-size: 0.875rem;
  margin: 0;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LoadingItem = styled.div`
  height: 4rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.5rem;

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;