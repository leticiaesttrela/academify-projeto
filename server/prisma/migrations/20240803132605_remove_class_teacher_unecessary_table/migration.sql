/*
  Warnings:

  - You are about to drop the `ClassTeacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `teacher` on the `Class` table. All the data in the column will be lost.
  - Added the required column `teacherId` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ClassTeacher";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Class" ("createdAt", "id", "label", "period") SELECT "createdAt", "id", "label", "period" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
