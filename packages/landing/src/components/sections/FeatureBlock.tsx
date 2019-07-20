import className from 'classnames'

import { aspectRatioToStyle } from '../../helpers'

export interface FeatureBlockProps {
  inverted?: boolean
  title: string
  subtitle: string
}

export default function FeatureBlock(props: FeatureBlockProps) {
  const { inverted, title, subtitle } = props

  return (
    <section className="feature-block container mb-16 md:mb-32">
      <div
        className={className(
          'flex flex-col lg:px-8 xl:items-center',
          inverted ? 'lg:flex-row-reverse' : 'lg:flex-row',
        )}
      >
        <div className={className('lg:w-5/12', inverted ? '' : 'lg:mr-16')}>
          <h3 className="mb-2 text-4xl leading-normal font-semibold text-black">
            {title}
          </h3>
          <h4 className="mb-6 text-xl leading-normal font-normal text-gray-800">
            {subtitle}
          </h4>
        </div>

        <div className={className('lg:w-7/12', inverted ? 'lg:mr-16' : '')}>
          <div
            className="bg-gray-200 rounded-lg"
            style={aspectRatioToStyle(9 / 16)}
          />
        </div>
      </div>
    </section>
  )
}
