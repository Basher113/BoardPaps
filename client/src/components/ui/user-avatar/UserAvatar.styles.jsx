import styled from 'styled-components';

export const Avatar = styled.div`
  width: ${props => {
    const sizes = { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem', xl: '3rem' };
    return sizes[props.size] || sizes.sm;
  }};
  height: ${props => {
    const sizes = { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem', xl: '3rem' };
    return sizes[props.size] || sizes.sm;
  }};
  font-size: ${props => {
    const sizes = { xs: '0.75rem', sm: '0.75rem', md: '0.875rem', lg: '1rem', xl: '1.125rem' };
    return sizes[props.size] || sizes.sm;
  }};
  border-radius: 9999px;
  background: linear-gradient(to bottom right, ${props => props.gradient});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
`;
