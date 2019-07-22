export interface PlanFeature {
  label: string
  available: boolean
}

export interface Plan {
  name: string
  description: string
  price: number
  period: 'month' | 'year'
  features: PlanFeature[]
}
