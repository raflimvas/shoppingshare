import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingCascadeOnDelete1616950804314 implements MigrationInterface {
    name = 'AddingCascadeOnDelete1616950804314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `list_user` DROP FOREIGN KEY `FK_75e50eaaecd15e578f9aff0b37a`");
        await queryRunner.query("ALTER TABLE `list_user` DROP FOREIGN KEY `FK_824632959cebf2a10e8b02243b0`");
        await queryRunner.query("ALTER TABLE `item` CHANGE `unit` `unit` enum ('0', '1', '2', '3', '4') NOT NULL");
        await queryRunner.query("ALTER TABLE `list_user` ADD CONSTRAINT `FK_75e50eaaecd15e578f9aff0b37a` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `list_user` ADD CONSTRAINT `FK_824632959cebf2a10e8b02243b0` FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `list_user` DROP FOREIGN KEY `FK_824632959cebf2a10e8b02243b0`");
        await queryRunner.query("ALTER TABLE `list_user` DROP FOREIGN KEY `FK_75e50eaaecd15e578f9aff0b37a`");
        await queryRunner.query("ALTER TABLE `item` CHANGE `unit` `unit` enum ('kg', 'l', 'un', 'dz', 'g') NOT NULL");
        await queryRunner.query("ALTER TABLE `list_user` ADD CONSTRAINT `FK_824632959cebf2a10e8b02243b0` FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `list_user` ADD CONSTRAINT `FK_75e50eaaecd15e578f9aff0b37a` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
