import { RestaurantStatus } from './enums/restaurant-status.enum.js'
import { RestaurantsHttpError } from './restaurants.errors.js'

type TransitionConfig = {
  readonly to: ReadonlySet<RestaurantStatus>
  readonly defaultIsActive: boolean
}

const RESTAURANT_STATUS_TRANSITIONS: ReadonlyMap<
  RestaurantStatus,
  TransitionConfig
> = new Map<RestaurantStatus, TransitionConfig>([
  [
    RestaurantStatus.DRAFT,
    {
      to: new Set([RestaurantStatus.PENDING_APPROVAL]),
      defaultIsActive: false
    }
  ],
  [
    RestaurantStatus.CHANGES_REQUIRED,
    {
      to: new Set([RestaurantStatus.PENDING_APPROVAL]),
      defaultIsActive: false
    }
  ],
  [
    RestaurantStatus.PENDING_APPROVAL,
    {
      to: new Set([
        RestaurantStatus.ACTIVE,
        RestaurantStatus.CHANGES_REQUIRED,
        RestaurantStatus.REJECTED
      ]),
      defaultIsActive: false
    }
  ],
  [
    RestaurantStatus.ACTIVE,
    {
      to: new Set([RestaurantStatus.BLOCKED, RestaurantStatus.ARCHIVED]),
      defaultIsActive: true
    }
  ],
  [
    RestaurantStatus.BLOCKED,
    {
      to: new Set([RestaurantStatus.ACTIVE]),
      defaultIsActive: false
    }
  ],
  [
    RestaurantStatus.REJECTED,
    {
      // Conservative MVP: rejection is terminal until an explicit reopen flow exists.
      to: new Set(),
      defaultIsActive: false
    }
  ],
  [
    RestaurantStatus.ARCHIVED,
    {
      to: new Set(),
      defaultIsActive: false
    }
  ]
])

export class RestaurantStatusTransitionService {
  getAllowedTransitions(from: RestaurantStatus): RestaurantStatus[] {
    return Array.from(this.getTransitionConfig(from).to)
  }

  canTransition(from: RestaurantStatus, to: RestaurantStatus): boolean {
    return this.getTransitionConfig(from).to.has(to)
  }

  assertCanTransition(
    from: RestaurantStatus,
    to: RestaurantStatus,
    actionLabel?: string
  ): void {
    if (this.canTransition(from, to)) {
      return
    }

    const actionSuffix = actionLabel ? ` for ${actionLabel}` : ''

    throw new RestaurantsHttpError(
      409,
      `Restaurant cannot transition from ${from} to ${to}${actionSuffix}`
    )
  }

  getDefaultIsActive(status: RestaurantStatus): boolean {
    return this.getTransitionConfig(status).defaultIsActive
  }

  private getTransitionConfig(status: RestaurantStatus): TransitionConfig {
    const transition = RESTAURANT_STATUS_TRANSITIONS.get(status)

    if (!transition) {
      throw new RestaurantsHttpError(
        500,
        `Restaurant transition configuration is missing for status ${status}`
      )
    }

    return transition
  }
}
