import styled from "styled-components";

const Card = styled.div`
  background: #f9fafb;
  padding: 2rem;
  border-radius: 1rem;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  }
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: #e0e7ff;
  color: #4338ca;
`;

export function FeatureCard({ icon, title, description }) {
  return (
    <Card>
      <IconWrapper>
        {icon}
      </IconWrapper>
      
      <h3>{title}</h3>
      <p>{description}</p>
    </Card>
  );
}