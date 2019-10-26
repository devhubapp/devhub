import { PlanID } from '@devhub/core'

export interface SubscribeFormProps {
  onSubscribe?: (planId: PlanID | undefined) => void
  planId: PlanID | undefined
}
