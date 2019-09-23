import { PlanID } from '@devhub/core'

export interface SubscribeFormProps {
  onSubscribe?: (planId: PlanID) => void
  planId: PlanID | undefined
}
