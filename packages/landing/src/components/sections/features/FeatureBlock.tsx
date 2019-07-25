import className from 'classnames'

import { aspectRatioToStyle } from '../../../helpers'

export interface FeatureBlockProps {
  children?: React.ReactNode
  inverted?: boolean
  title: string
  subtitle: string
}

export default function FeatureBlock(props: FeatureBlockProps) {
  const { children, inverted, title, subtitle } = props

  return (
    <section className="feature-block container">
      <div
        className={className(
          'flex flex-col lg:px-8 xl:items-center',
          inverted ? 'lg:flex-row-reverse' : 'lg:flex-row',
        )}
      >
        <div className={className('lg:w-5/12', inverted ? '' : 'lg:mr-16')}>
          <h1 className="mb-2">{title}</h1>
          <h2 className="mb-6">{subtitle}</h2>
          {children}
          {!!children && <div className="pb-6" />}
        </div>

        <div className={className('lg:w-7/12', inverted ? 'lg:mr-16' : '')}>
          <div
            className="bg-less-1 rounded-lg"
            style={aspectRatioToStyle(16 / 9)}
          />
        </div>
      </div>
    </section>
  )
}
