-- AlterTable: Add issueKey column with temporary default
ALTER TABLE "Issue" ADD COLUMN "issueKey" TEXT;

-- AlterTable: Add dueDate column
ALTER TABLE "Issue" ADD COLUMN "dueDate" TIMESTAMP(3);

-- Update existing issues with issueKey based on project key and a sequential number
-- We need to generate issue keys for existing issues
DO $$
DECLARE
    issue_record RECORD;
    project_key TEXT;
    issue_number INTEGER;
BEGIN
    -- Loop through each issue and generate an issue key
    FOR issue_record IN SELECT i.id, i."projectId", p.key FROM "Issue" i JOIN "Project" p ON i."projectId" = p.id ORDER BY i."createdAt" ASC LOOP
        -- Get the next issue number for this project
        SELECT COALESCE(MAX(CAST(SUBSTRING("issueKey" FROM LENGTH(issue_record.key) + 2) AS INTEGER)), 0) + 1
        INTO issue_number
        FROM "Issue"
        WHERE "projectId" = issue_record."projectId" AND "issueKey" LIKE issue_record.key || '-%';
        
        -- Update the issue with the generated key
        UPDATE "Issue" SET "issueKey" = issue_record.key || '-' || issue_number WHERE id = issue_record.id;
    END LOOP;
END $$;

-- Now make issueKey required and unique
ALTER TABLE "Issue" ALTER COLUMN "issueKey" SET NOT NULL;
CREATE UNIQUE INDEX "Issue_issueKey_key" ON "Issue"("issueKey");

-- CreateTable: IssueComment
CREATE TABLE "IssueComment" (
    "id" TEXT NOT NULL,
    "content" VARCHAR(5000) NOT NULL,
    "issueId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IssueComment_issueId_idx" ON "IssueComment"("issueId");

-- CreateIndex
CREATE INDEX "IssueComment_authorId_idx" ON "IssueComment"("authorId");

-- AddForeignKey
ALTER TABLE "IssueComment" ADD CONSTRAINT "IssueComment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueComment" ADD CONSTRAINT "IssueComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterEnum: Add COMMENT_ADDED and COMMENT_DELETED to AuditAction
ALTER TYPE "AuditAction" ADD VALUE 'COMMENT_ADDED';
ALTER TYPE "AuditAction" ADD VALUE 'COMMENT_DELETED';
