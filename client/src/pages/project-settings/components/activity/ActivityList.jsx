import { useState } from 'react';
import {
  ActivityContainer,
  ActivityList as List,
  ActivityCount,
  PaginationContainer,
  PaginationButton,
  PageInfo,
  EmptyState,
  EmptyTitle,
  EmptyDescription,
  LoadingContainer,
  LoadingItem
} from './ActivityList.styles';
import { useGetProjectAuditLogsQuery } from '../../../../reducers/slices/project/project.apiSlice';
import ActivityItem from './ActivityItem';
import ActivityFilters from './ActivityFilters';

const ITEMS_PER_PAGE = 25;

const ActivityList = ({ projectId, members }) => {
  // Filter state
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Fetch audit logs
  const { data, isLoading, isError, refetch } = useGetProjectAuditLogsQuery({
    projectId,
    limit: ITEMS_PER_PAGE,
    offset,
    action: actionFilter || undefined,
    userId: userFilter || undefined
  });

  const logs = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleActionFilterChange = (value) => {
    setActionFilter(value);
    setCurrentPage(1);
  };

  const handleUserFilterChange = (value) => {
    setUserFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActionFilter('');
    setUserFilter('');
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calculate display range
  const startItem = total > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

  if (isLoading) {
    return (
      <ActivityContainer>
        <LoadingContainer>
          {[...Array(5)].map((_, i) => (
            <LoadingItem key={i} />
          ))}
        </LoadingContainer>
      </ActivityContainer>
    );
  }

  if (isError) {
    return (
      <ActivityContainer>
        <EmptyState>
          <EmptyTitle>Error Loading Activity</EmptyTitle>
          <EmptyDescription>
            There was a problem loading the activity log. Please try again.
          </EmptyDescription>
          <PaginationButton onClick={() => refetch()} style={{ marginTop: '1rem' }}>
            Retry
          </PaginationButton>
        </EmptyState>
      </ActivityContainer>
    );
  }

  return (
    <ActivityContainer>
      <ActivityFilters
        actionFilter={actionFilter}
        setActionFilter={handleActionFilterChange}
        userFilter={userFilter}
        setUserFilter={handleUserFilterChange}
        members={members}
        onClearFilters={handleClearFilters}
      />

      <ActivityCount>
        Showing {startItem}-{endItem} of {total} {total === 1 ? 'activity' : 'activities'}
      </ActivityCount>

      {logs.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No Activity Found</EmptyTitle>
          <EmptyDescription>
            {actionFilter || userFilter 
              ? 'No activities match your current filters.'
              : 'No activities have been recorded for this project yet.'}
          </EmptyDescription>
        </EmptyState>
      ) : (
        <>
          <List>
            {logs.map((log) => (
              <ActivityItem key={log.id} log={log} />
            ))}
          </List>

          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
              <PageInfo>
                Page {currentPage} of {totalPages}
              </PageInfo>
              <PaginationButton 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}
    </ActivityContainer>
  );
};

export default ActivityList;