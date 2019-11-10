import classNames from 'classnames'

import {
  ResponsiveImage,
  ResponsiveImageProps,
} from '../../common/ResponsiveImage'

export interface FeatureBlockProps {
  children?: React.ReactNode
  image: ResponsiveImageProps & { position: 'left' | 'right' | 'full' }
  title: string
  subtitle: string
}

export default function FeatureBlock(props: FeatureBlockProps) {
  const {
    children,
    image: { position, ...imageProps },
    title,
    subtitle,
  } = props

  return (
    <section className="feature-block container">
      <div
        className={classNames(
          'flex flex-col',
          position === 'left'
            ? 'lg:flex-row-reverse lg:px-8 xl:items-center'
            : position === 'right'
            ? 'lg:flex-row lg:px-8 xl:items-center'
            : 'sm:items-center text-center',
        )}
      >
        <div
          className={classNames(
            position === 'left'
              ? 'lg:w-5/12'
              : position === 'right'
              ? 'lg:w-5/12 lg:mr-16'
              : 'lg:w-10/12 xl:w-8/12 mb-4',
          )}
        >
          <h1 className="mb-2 text-3xl">{title}</h1>
          <h2 className="mb-6 text-xl">{subtitle}</h2>
          {children}
          {!!children && <div className="pb-6" />}
        </div>

        <ResponsiveImage
          enableBorder
          minHeight={500}
          containerClassName={classNames(
            position === 'left'
              ? 'lg:w-7/12 lg:mr-16'
              : position === 'right'
              ? 'lg:w-7/12'
              : undefined,
          )}
          {...imageProps}
        />
      </div>
    </section>
  )
}
