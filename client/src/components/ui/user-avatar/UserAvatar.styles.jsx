import styled, { css } from 'styled-components';

const sizeStyles = {
  xs: css`
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.5rem;
  `,
  sm: css`
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.625rem;
  `,
  md: css`
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  `,
  lg: css`
    width: 2.5rem;
    height: 2.5rem;
    font-size: 0.875rem;
  `,
  xl: css`
    width: 3rem;
    height: 3rem;
    font-size: 1rem;
  `,
  '2xl': css`
    width: 6rem;
    height: 6rem;
    font-size: 1.5rem;
  `,
};

export const Avatar = styled.div`
  width: ${props => {
    const sizes = { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem', xl: '3rem', '2xl': '6rem' };
    return sizes[props.$size] || sizes.sm;
  }};
  height: ${props => {
    const sizes = { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem', xl: '3rem', '2xl': '6rem' };
    return sizes[props.$size] || sizes.sm;
  }};
  font-size: ${props => {
    const sizes = { xs: '0.5rem', sm: '0.625rem', md: '0.75rem', lg: '0.875rem', xl: '1rem', '2xl': '1.5rem' };
    return sizes[props.$size] || sizes.sm;
  }};
  border-radius: 9999px;
  background-color: #18181b;
  color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  flex-shrink: 0;
  overflow: hidden;
  ${props => sizeStyles[props.$size] || sizeStyles.sm}
`;
