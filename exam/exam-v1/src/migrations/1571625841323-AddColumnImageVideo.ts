import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnImageVideo1571625841323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `answers` DROP FOREIGN KEY `FK_677120094cf6d3f12df0b9dc5d3`'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` ADD `image_id` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` ADD `video_id` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `questions` ADD `image_id` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `questions` ADD `video_id` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` CHANGE `answer` `answer` longtext NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` CHANGE `score` `score` float NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `questions` CHANGE `question` `question` longtext NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` ADD CONSTRAINT `FK_677120094cf6d3f12df0b9dc5d3` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `answers` DROP FOREIGN KEY `FK_677120094cf6d3f12df0b9dc5d3`'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` CHANGE `score` `score` float(12) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` CHANGE `answer` `answer` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `questions` CHANGE `question` `question` text NOT NULL'
    );
    await queryRunner.query('ALTER TABLE `questions` DROP COLUMN `video_id`');
    await queryRunner.query('ALTER TABLE `questions` DROP COLUMN `image_id`');
    await queryRunner.query('ALTER TABLE `answers` DROP COLUMN `video_id`');
    await queryRunner.query('ALTER TABLE `answers` DROP COLUMN `image_id`');
    await queryRunner.query(
      'ALTER TABLE `answers` ADD CONSTRAINT `FK_677120094cf6d3f12df0b9dc5d3` FOREIGN KEY (`question_id`, `question_id`, `question_id`) REFERENCES `questions`(`id`,`id`,`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }
}
