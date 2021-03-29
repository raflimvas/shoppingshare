import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatingDB1616886848003 implements MigrationInterface {
    name = 'CreatingDB1616886848003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `list_user` (`owner` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `listId` int NOT NULL, PRIMARY KEY (`userId`, `listId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `list` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `description` varchar(200) NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `item` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `description` varchar(200) NULL, `value` decimal(5,2) NOT NULL, `weight` decimal(10,3) NOT NULL, `unit` enum ('kg', 'l', 'un', 'dz', 'g') NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `listId` int NULL, `categoryId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `category` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `listId` int NULL, UNIQUE INDEX `IDX_23c05c292c439d77b0de816b50` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `share` (`id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` ADD `firstName` varchar(100) NOT NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `lastName` varchar(200) NOT NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `passwordHash` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `user` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `email`");
        await queryRunner.query("ALTER TABLE `user` ADD `email` varchar(200) NOT NULL");
        await queryRunner.query("ALTER TABLE `user` ADD UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)");
        await queryRunner.query("ALTER TABLE `list_user` ADD CONSTRAINT `FK_75e50eaaecd15e578f9aff0b37a` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `list_user` ADD CONSTRAINT `FK_824632959cebf2a10e8b02243b0` FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_7bd5f4d3ef52bfaa138ada4cf81` FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_c0c8f47a702c974a77812169bc2` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `category` ADD CONSTRAINT `FK_488a6cdc050c33ad69eb2f5701d` FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `category` DROP FOREIGN KEY `FK_488a6cdc050c33ad69eb2f5701d`");
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_c0c8f47a702c974a77812169bc2`");
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_7bd5f4d3ef52bfaa138ada4cf81`");
        await queryRunner.query("ALTER TABLE `list_user` DROP FOREIGN KEY `FK_824632959cebf2a10e8b02243b0`");
        await queryRunner.query("ALTER TABLE `list_user` DROP FOREIGN KEY `FK_75e50eaaecd15e578f9aff0b37a`");
        await queryRunner.query("ALTER TABLE `user` DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `email`");
        await queryRunner.query("ALTER TABLE `user` ADD `email` varchar(80) NOT NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user` (`email`)");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `updatedAt`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `createdAt`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `passwordHash`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `lastName`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `firstName`");
        await queryRunner.query("DROP TABLE `share`");
        await queryRunner.query("DROP INDEX `IDX_23c05c292c439d77b0de816b50` ON `category`");
        await queryRunner.query("DROP TABLE `category`");
        await queryRunner.query("DROP TABLE `item`");
        await queryRunner.query("DROP TABLE `list`");
        await queryRunner.query("DROP TABLE `list_user`");
    }

}
