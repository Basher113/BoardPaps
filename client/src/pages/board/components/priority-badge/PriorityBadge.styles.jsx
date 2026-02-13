import styled, { css } from 'styled-components';

const priorityStyles = {
  LOW: css`
    background-color: #dcfce7;
    color: #166534;
  `,
  MEDIUM: css`
    background-color: #fef9c3;
    color: #854d0e;
  `,
  HIGH: css`
    background-color: #ffedd5;
    color: #9a3412;
  `,
  CRITICAL: css`
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `,
};

export const Badge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  ${props => priorityStyles[props.$priority] || priorityStyles.MEDIUM}
`;

const priorityIconStyles = {
  LOW: css`
    color: #22c55e;
  `,
  MEDIUM: css`
    color: #eab308;
  `,
  HIGH: css`
    color: #f97316;
  `,
  CRITICAL: css`
    color: #ef4444;
  `,
};

export const PriorityIcon = styled.span`
  ${props => priorityIconStyles[props.$priority] || priorityIconStyles.MEDIUM}
`;

export const Label = styled.span`
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-size: 0.6875rem;
`;
