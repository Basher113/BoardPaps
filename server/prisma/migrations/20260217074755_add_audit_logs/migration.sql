-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('PROJECT_CREATED', 'PROJECT_UPDATED', 'PROJECT_DELETED', 'PROJECT_ARCHIVED', 'PROJECT_RESTORED', 'OWNERSHIP_TRANSFERRED', 'MEMBER_ROLE_CHANGED', 'MEMBER_REMOVED', 'MEMBER_LEFT', 'INVITATION_CREATED', 'INVITATION_ACCEPTED', 'INVITATION_DECLINED', 'INVITATION_CANCELLED', 'INVITATION_RESENT');

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_projectId_idx" ON "AuditLog"("projectId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
