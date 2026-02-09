import styled, { css } from 'styled-components';

const sizeStyles = {
  xs: css`
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.625rem;
  `,
  sm: css`
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
  `,
  md: css`
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
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
};

const StyledAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #18181b;
  color: #fafafa;
  font-weight: 500;
  flex-shrink: 0;
  overflow: hidden;
  ${({ $size }) => sizeStyles[$size] || sizeStyles.md}
`;

const Avatar = ({ size = 'md', name, src, alt }) => {
  const initials = name
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return <StyledAvatar $size={size} as="img" src={src} alt={alt || name} />;
  }

  return <StyledAvatar $size={size}>{initials || '?'}</StyledAvatar>;
};

export default Avatar;
