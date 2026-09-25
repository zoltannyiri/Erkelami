-- AlterTable
ALTER TABLE "NavigationItem" ADD COLUMN     "menuKey" TEXT NOT NULL DEFAULT 'TOP_LEVEL',
ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "NavigationItem" ADD CONSTRAINT "NavigationItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavigationItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
