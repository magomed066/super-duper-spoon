import type { MigrationInterface, QueryRunner } from 'typeorm'

export class BackfillSystemOwnerRole1743997200000
  implements MigrationInterface
{
  name = 'BackfillSystemOwnerRole1743997200000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'users_role_enum'
        ) THEN
          IF EXISTS (
            SELECT 1
            FROM pg_enum enum_value
            INNER JOIN pg_type enum_type
              ON enum_type.oid = enum_value.enumtypid
            WHERE enum_type.typname = 'users_role_enum'
              AND enum_value.enumlabel = 'OWNER'
          ) AND NOT EXISTS (
            SELECT 1
            FROM pg_enum enum_value
            INNER JOIN pg_type enum_type
              ON enum_type.oid = enum_value.enumtypid
            WHERE enum_type.typname = 'users_role_enum'
              AND enum_value.enumlabel = 'SYSTEM_OWNER'
          ) THEN
            ALTER TYPE "users_role_enum" RENAME VALUE 'OWNER' TO 'SYSTEM_OWNER';
          ELSIF NOT EXISTS (
            SELECT 1
            FROM pg_enum enum_value
            INNER JOIN pg_type enum_type
              ON enum_type.oid = enum_value.enumtypid
            WHERE enum_type.typname = 'users_role_enum'
              AND enum_value.enumlabel = 'SYSTEM_OWNER'
          ) THEN
            ALTER TYPE "users_role_enum" ADD VALUE 'SYSTEM_OWNER';
          END IF;
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name = 'users'
        ) AND EXISTS (
          SELECT 1
          FROM pg_enum enum_value
          INNER JOIN pg_type enum_type
            ON enum_type.oid = enum_value.enumtypid
          WHERE enum_type.typname = 'users_role_enum'
            AND enum_value.enumlabel = 'OWNER'
        ) THEN
          UPDATE "users"
          SET "role" = 'SYSTEM_OWNER'
          WHERE "role"::text = 'OWNER';
        END IF;
      END
      $$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_enum enum_value
          INNER JOIN pg_type enum_type
            ON enum_type.oid = enum_value.enumtypid
          WHERE enum_type.typname = 'users_role_enum'
            AND enum_value.enumlabel = 'SYSTEM_OWNER'
        ) AND NOT EXISTS (
          SELECT 1
          FROM pg_enum enum_value
          INNER JOIN pg_type enum_type
            ON enum_type.oid = enum_value.enumtypid
          WHERE enum_type.typname = 'users_role_enum'
            AND enum_value.enumlabel = 'OWNER'
        ) THEN
          ALTER TYPE "users_role_enum" RENAME VALUE 'SYSTEM_OWNER' TO 'OWNER';
        END IF;
      END
      $$;
    `)
  }
}
