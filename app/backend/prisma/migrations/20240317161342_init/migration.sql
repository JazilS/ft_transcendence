-- CreateTable
CREATE TABLE "_blockUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_blockUser_AB_unique" ON "_blockUser"("A", "B");

-- CreateIndex
CREATE INDEX "_blockUser_B_index" ON "_blockUser"("B");

-- AddForeignKey
ALTER TABLE "_blockUser" ADD CONSTRAINT "_blockUser_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blockUser" ADD CONSTRAINT "_blockUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
