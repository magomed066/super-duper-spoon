import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique
} from 'typeorm'

export class InitialMigration1743898800000 implements MigrationInterface {
  name = 'InitialMigration1743898800000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

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
            type: 'text'
          },
          {
            name: 'phoneHash',
            type: 'varchar',
            length: '64'
          },
          {
            name: 'email',
            type: 'text'
          },
          {
            name: 'emailHash',
            type: 'varchar',
            length: '64',
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
            enum: ['SYSTEM_OWNER', 'CLIENT', 'STAFF'],
            enumName: 'users_role_enum',
            default: "'CLIENT'"
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
            type: 'text'
          },
          {
            name: 'emailHash',
            type: 'varchar',
            length: '64'
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
            type: 'text'
          },
          {
            name: 'addressHash',
            type: 'varchar',
            length: '64'
          },
          {
            name: 'phone',
            type: 'text'
          },
          {
            name: 'phoneHash',
            type: 'varchar',
            length: '64'
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

    await queryRunner.createTable(
      new Table({
        name: 'restaurants',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isUnique: true
          },
          {
            name: 'cuisine',
            type: 'text',
            isArray: true,
            default: "'{}'"
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true
          },
          {
            name: 'phones',
            type: 'text',
            isArray: true,
            default: "'{}'"
          },
          {
            name: 'city',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'logo',
            type: 'varchar',
            length: '500'
          },
          {
            name: 'preview',
            type: 'varchar',
            length: '500'
          },
          {
            name: 'workSchedule',
            type: 'jsonb',
            default: "'[]'"
          },
          {
            name: 'deliveryTime',
            type: 'integer'
          },
          {
            name: 'deliveryConditions',
            type: 'text'
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '255',
            isNullable: true
          },
          {
            name: 'address',
            type: 'text',
            isNullable: true
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'DRAFT',
              'PENDING_APPROVAL',
              'ACTIVE',
              'CHANGES_REQUIRED',
              'REJECTED',
              'BLOCKED',
              'ARCHIVED'
            ],
            enumName: 'restaurants_status_enum',
            default: "'DRAFT'"
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: false
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()'
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()'
          }
        ]
      }),
      true
    )

    await queryRunner.createTable(
      new Table({
        name: 'restaurant_users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'restaurantId',
            type: 'uuid'
          },
          {
            name: 'userId',
            type: 'uuid'
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['OWNER', 'MANAGER'],
            enumName: 'restaurant_users_role_enum'
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
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_restaurant_users_restaurantId_userId',
            columnNames: ['restaurantId', 'userId']
          })
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

    await queryRunner.createForeignKeys('restaurant_users', [
      new TableForeignKey({
        columnNames: ['restaurantId'],
        referencedTableName: 'restaurants',
        referencedColumnNames: ['id']
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id']
      })
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const refreshTokensTable = await queryRunner.getTable('refresh_tokens')
    const userForeignKey = refreshTokensTable?.foreignKeys.find(
      (foreignKey) =>
        foreignKey.columnNames.length === 1 &&
        foreignKey.columnNames[0] === 'userId'
    )
    const restaurantUsersTable = await queryRunner.getTable('restaurant_users')
    const restaurantForeignKey = restaurantUsersTable?.foreignKeys.find(
      (foreignKey) =>
        foreignKey.columnNames.length === 1 &&
        foreignKey.columnNames[0] === 'restaurantId'
    )
    const restaurantUserForeignKey = restaurantUsersTable?.foreignKeys.find(
      (foreignKey) =>
        foreignKey.columnNames.length === 1 &&
        foreignKey.columnNames[0] === 'userId'
    )

    if (userForeignKey) {
      await queryRunner.dropForeignKey('refresh_tokens', userForeignKey)
    }

    if (restaurantForeignKey) {
      await queryRunner.dropForeignKey('restaurant_users', restaurantForeignKey)
    }

    if (restaurantUserForeignKey) {
      await queryRunner.dropForeignKey('restaurant_users', restaurantUserForeignKey)
    }

    await queryRunner.dropTable('restaurant_users')
    await queryRunner.dropTable('restaurants')
    await queryRunner.query('DROP TYPE IF EXISTS "restaurants_status_enum"')
    await queryRunner.query('DROP TYPE IF EXISTS "restaurant_users_role_enum"')
    await queryRunner.dropTable('refresh_tokens')
    await queryRunner.dropTable('applications')
    await queryRunner.dropTable('users')
    await queryRunner.query('DROP TYPE IF EXISTS "applications_status_enum"')
    await queryRunner.query('DROP TYPE IF EXISTS "users_role_enum"')
  }
}
