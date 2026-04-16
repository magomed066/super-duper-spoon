import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

export function applyMenuCategorySorting<Entity extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<Entity>,
  alias: string
): SelectQueryBuilder<Entity> {
  return queryBuilder
    .orderBy(`${alias}.sortOrder`, 'ASC')
    .addOrderBy(`${alias}.createdAt`, 'ASC')
    .addOrderBy(`${alias}.id`, 'ASC')
}

export function applyMenuItemSorting<Entity extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<Entity>,
  alias: string
): SelectQueryBuilder<Entity> {
  return queryBuilder
    .orderBy(`${alias}.sortOrder`, 'ASC')
    .addOrderBy(`${alias}.createdAt`, 'ASC')
    .addOrderBy(`${alias}.id`, 'ASC')
}
