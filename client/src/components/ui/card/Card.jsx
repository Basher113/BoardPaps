import styled from 'styled-components';

const Card = styled.div`
  border-radius: 0.5rem;
  border: 1px solid #e4e4e7;
  background-color: #ffffff;
  color: #18181b;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.5rem 1.5rem 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
  color: #18181b;
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #71717a;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e4e4e7;
`;

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
