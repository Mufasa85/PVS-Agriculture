-- DropIndex
DROP INDEX `products_category_idx` ON `products`;

-- CreateIndex
CREATE INDEX `products_category_isPublished_deletedAt_sortOrder_idx` ON `products`(`category`, `isPublished`, `deletedAt`, `sortOrder`);

-- CreateIndex
CREATE INDEX `products_isPublished_deletedAt_category_sortOrder_idx` ON `products`(`isPublished`, `deletedAt`, `category`, `sortOrder`);
