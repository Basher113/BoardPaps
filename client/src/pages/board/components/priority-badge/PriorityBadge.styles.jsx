import styled from 'styled-components';

export const Badge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    const colors = {
      LOW: '#f3f4f6',
      MEDIUM: '#dbeafe',
      HIGH: '#fed7aa',
      CRITICAL: '#fecaca'
    };
    return colors[props.priority] || colors.MEDIUM;
  }};
  color: ${props => {
    const colors = {
      LOW: '#374151',
      MEDIUM: '#1e40af',
      HIGH: '#c2410c',
      CRITICAL: '#991b1b'
    };
    return colors[props.priority] || colors.MEDIUM;
  }};
`;
