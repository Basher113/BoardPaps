import {
  DangerZone as DangerZoneWrapper,
  DangerHeader,
  DangerIconWrapper,
  DangerTitle,
  DangerDescription,
  DangerContent,
  Divider,
  Button
} from '../../ProjectSettings.styles';
import { Trash2, UserCog, ArrowRight } from 'lucide-react';

const DangerZone = ({ onTransfer, onDelete }) => {
  return (
    <>
      {/* Transfer Ownership */}
      <DangerZoneWrapper>
        <DangerHeader>
          <DangerIconWrapper>
            <UserCog size={20} color="#f59e0b" />
          </DangerIconWrapper>
          <div>
            <DangerTitle>Transfer Ownership</DangerTitle>
            <DangerDescription>
              Transfer this project to another member. You will become an admin after the transfer.
            </DangerDescription>
          </div>
        </DangerHeader>
        <DangerContent>
          <Button type="button" onClick={onTransfer}>
            <ArrowRight size={16} style={{ marginRight: '0.5rem' }} />
            Transfer Ownership
          </Button>
        </DangerContent>
      </DangerZoneWrapper>

      <Divider />

      {/* Delete Project */}
      <DangerZoneWrapper>
        <DangerHeader>
          <DangerIconWrapper>
            <Trash2 size={20} color="#dc2626" />
          </DangerIconWrapper>
          <div>
            <DangerTitle>Delete Project</DangerTitle>
            <DangerDescription>
              Permanently delete this project and all associated data. This action cannot be undone.
            </DangerDescription>
          </div>
        </DangerHeader>
        <DangerContent>
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
          >
            <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
            Delete Project
          </Button>
        </DangerContent>
      </DangerZoneWrapper>
    </>
  );
};

export default DangerZone;
