import Link from 'next/link'
import React from 'react'

import CheckLabel, { CheckLabelProps } from './CheckLabel'

export interface CheckLabelsProps {
  labels: Array<CheckLabelProps & { href?: string; target?: string }>
}

export function CheckLabels(props: CheckLabelsProps) {
  const { labels } = props

  if (!(labels && labels.length)) return null

  return (
    <div className="flex flex-row flex-wrap">
      {labels.map(({ href, target, ...label }) => (
        <Link href={href}>
          <a key={`label-${label.label}`} target={target} className="mr-4">
            <CheckLabel {...label} />
          </a>
        </Link>
      ))}
    </div>
  )
}
