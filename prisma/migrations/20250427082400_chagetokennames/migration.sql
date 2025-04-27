/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `expiresIn` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `idHint` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `Token` table. All the data in the column will be lost.
  - Added the required column `access_token` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_in` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_type` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "accessToken",
DROP COLUMN "expiresIn",
DROP COLUMN "idHint",
DROP COLUMN "tokenType",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "expires_in" INTEGER NOT NULL,
ADD COLUMN     "id_hint" TEXT,
ADD COLUMN     "token_type" TEXT NOT NULL;
