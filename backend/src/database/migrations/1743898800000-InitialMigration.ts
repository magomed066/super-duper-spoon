import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm'

export class InitialMigration1743898800000 implements MigrationInterface {
  name = 'InitialMigration1743898800000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'firstName',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'lastName',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '30'
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50'
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['OWNER', 'CLIENT', 'MANAGER'],
            enumName: 'users_role_enum'
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()'
          }
        ]
      }),
      true
    )

    await queryRunner.createTable(
      new Table({
        name: 'applications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'restaurantName',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'address',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            enumName: 'applications_status_enum',
            default: "'PENDING'"
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()'
          }
        ]
      }),
      true
    )

    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'token',
            type: 'text'
          },
          {
            name: 'expiresAt',
            type: 'timestamptz'
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()'
          },
          {
            name: 'userId',
            type: 'uuid'
          }
        ]
      }),
      true
    )

    await queryRunner.createForeignKey(
      'refresh_tokens',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const refreshTokensTable = await queryRunner.getTable('refresh_tokens')
    const userForeignKey = refreshTokensTable?.foreignKeys.find(
      (foreignKey) =>
        foreignKey.columnNames.length === 1 &&
        foreignKey.columnNames[0] === 'userId'
    )

    if (userForeignKey) {
      await queryRunner.dropForeignKey('refresh_tokens', userForeignKey)
    }

    await queryRunner.dropTable('refresh_tokens')
    await queryRunner.dropTable('applications')
    await queryRunner.dropTable('users')
  }
}
