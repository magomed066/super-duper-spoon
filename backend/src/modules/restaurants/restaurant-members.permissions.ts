import { ForbiddenException } from '@nestjs/common';

import { RestaurantMemberRole } from './entities/restaurant-member-role.enum';
import { RestaurantMember } from './entities/restaurant-member.entity';

const VIEW_MEMBERS_ROLES = new Set<RestaurantMemberRole>([
  RestaurantMemberRole.OWNER,
  RestaurantMemberRole.ADMIN,
  RestaurantMemberRole.MANAGER,
]);

const MANAGE_MEMBERS_ROLES = new Set<RestaurantMemberRole>([
  RestaurantMemberRole.OWNER,
  RestaurantMemberRole.ADMIN,
]);

export function assertCanViewRestaurantMembers(
  membership: Pick<RestaurantMember, 'role'>,
): void {
  if (!VIEW_MEMBERS_ROLES.has(membership.role)) {
    throw new ForbiddenException(
      'You do not have permission to view restaurant members',
    );
  }
}

export function assertCanManageRestaurantMembers(
  membership: Pick<RestaurantMember, 'role'>,
): void {
  if (!MANAGE_MEMBERS_ROLES.has(membership.role)) {
    throw new ForbiddenException(
      'You do not have permission to manage restaurant members',
    );
  }
}

export function assertCanAssignRestaurantRole(
  actorMembership: Pick<RestaurantMember, 'role'>,
  nextRole: RestaurantMemberRole,
): void {
  if (
    nextRole === RestaurantMemberRole.OWNER &&
    actorMembership.role !== RestaurantMemberRole.OWNER
  ) {
    throw new ForbiddenException('Only OWNER can assign the OWNER role');
  }
}
