-- DropIndex
DROP INDEX `products_category_idx` ON `products`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `twoFactorEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `twoFactorSecret` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `codeHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `password_reset_tokens_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `products_category_isPublished_deletedAt_sortOrder_idx` ON `products`(`category`, `isPublished`, `deletedAt`, `sortOrder`);

-- CreateIndex
CREATE INDEX `products_isPublished_deletedAt_category_sortOrder_idx` ON `products`(`isPublished`, `deletedAt`, `category`, `sortOrder`);
