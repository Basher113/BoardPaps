import styled from 'styled-components';
import Modal from '../../../../components/ui/modal/Modal';
import IssueTypeIcon from '../../components/issue-type-icon/IssueTypeIcon';
import Avatar from '../../../../components/ui/avatar/Avatar';
import Button from '../../../../components/ui/button/Button';
import { formatDate } from '../../../../utils/date';

const IssueDetailContainer = styled.div`
  padding: 16px;
`;

const IssueHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
`;

const IssueTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #18181b;
`;

const IssueDescriptionSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #71717a;
  letter-spacing: 0.5px;
`;

const DescriptionText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #18181b;
  white-space: pre-wrap;
`;

const ReporterSection = styled.div`
  margin-bottom: 16px;
`;

const ReporterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReporterDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReporterName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #18181b;
`;

const ReporterDate = styled.span`
  font-size: 12px;
  color: #71717a;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #e4e4e7;
`;

const IssueDetailModal = ({ isOpen, onClose, issue }) => {
  if (!isOpen || !issue) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={issue.title}>
      <IssueDetailContainer>
        
        
        <IssueDescriptionSection>
          <SectionTitle>Description</SectionTitle>
          <DescriptionText>
            {issue.description || 'No description provided.'}
          </DescriptionText>
        </IssueDescriptionSection>
        
        <ReporterSection>
          <SectionTitle>Reported by</SectionTitle>
          <ReporterInfo>
            <Avatar 
              $size="md" 
              name={issue.reporter?.username} 
              src={issue.reporter?.avatar} 
            />
            <ReporterDetails>
              <ReporterName>{issue.reporter?.username || 'Unknown'}</ReporterName>
              <ReporterDate>{formatDate(issue.createdAt)}</ReporterDate>
            </ReporterDetails>
          </ReporterInfo>
        </ReporterSection>
      </IssueDetailContainer>
      
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default IssueDetailModal;
