/*
  Warnings:

  - The values [women_bagpacks] on the enum `productCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "productCategory_new" AS ENUM ('baby_products', 'mobile_accessories', 'backpacks');
ALTER TABLE "Product" ALTER COLUMN "category" TYPE "productCategory_new" USING ("category"::text::"productCategory_new");
ALTER TYPE "productCategory" RENAME TO "productCategory_old";
ALTER TYPE "productCategory_new" RENAME TO "productCategory";
DROP TYPE "productCategory_old";
COMMIT;
