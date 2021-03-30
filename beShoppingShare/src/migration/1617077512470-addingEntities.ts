import {MigrationInterface, QueryRunner} from "typeorm";

export class addingEntities1617077512470 implements MigrationInterface {
    name = 'addingEntities1617077512470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_7bd5f4d3ef52bfaa138ada4cf81`");
        await queryRunner.query("ALTER TABLE `category` DROP FOREIGN KEY `FK_488a6cdc050c33ad69eb2f5701d`");
        await queryRunner.query("DROP INDEX `IDX_23c05c292c439d77b0de816b50` ON `category`");
        await queryRunner.query("CREATE TABLE `category_template` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `share` ADD `value` decimal(5,2) NOT NULL");
        await queryRunner.query("ALTER TABLE `share` ADD `weight` decimal(10,3) NOT NULL");
        await queryRunner.query("ALTER TABLE `share` ADD `unit` enum ('0', '1', '2', '3', '4') NOT NULL");
        await queryRunner.query("ALTER TABLE `share` ADD `userId` int NULL");
        await queryRunner.query("ALTER TABLE `share` ADD `itemId` int NULL");
        await queryRunner.query("ALTER TABLE `category_template` ADD CONSTRAINT `FK_0c1d5e5604ef06b771543e33687` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `share` ADD CONSTRAINT `FK_07e293248ed4aeb7965af840b13` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `share` ADD CONSTRAINT `FK_9c374f3f8890163add8f5dff205` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_7bd5f4d3ef52bfaa138ada4cf81` FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `category` ADD CONSTRAINT `FK_488a6cdc050c33ad69eb2f5701d` FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `category` DROP FOREIGN KEY `FK_488a6cdc050c33ad69eb2f5701d`");
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_7bd5f4d3ef52bfaa138ada4cf81`");
        await queryRunner.query("ALTER TABLE `share` DROP FOREIGN KEY `FK_9c374f3f8890163add8f5dff205`");
        await queryRunner.query("ALTER TABLE `share` DROP FOREIGN KEY `FK_07e293248ed4aeb7965af840b13`");
        await queryRunner.query("ALTER TABLE `category_template` DROP FOREIGN KEY `FK_0c1d5e5604ef06b771543e33687`");
        await queryRunner.query("ALTER TABLE `share` DROP COLUMN `itemId`");
        await queryRunner.query("ALTER TABLE `share` DROP COLUMN `userId`");
        await queryRunner.query("ALTER TABLE `share` DROP COLUMN `unit`");
        await queryRunner.query("ALTER TABLE `share` DROP COLUMN `weight`");
        await queryRunner.query("ALTER TABLE `share` DROP COLUMN `value`");
        await queryRunner.query("DROP TABLE `category_template`");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_23c05c292c439d77b0de816b50` ON `category` (`name`)");
        await queryRunner.query("ALTER TABLE `category` ADD CONSTRAINT `FK_488a6cdc050c33ad69eb2f5701d` FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_7bd5f4d3ef52bfaa138ada4cf81` FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
