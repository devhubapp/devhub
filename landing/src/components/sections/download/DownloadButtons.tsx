import classNames from 'classnames'

import { constants } from '@brunolemos/devhub-core'
import { getSystemLabel } from '../../../helpers'
import { useSystem } from '../../../hooks/use-system'
import Button from '../../common/buttons/Button'

export interface DownloadButtonsProps {
  center?: boolean
  className?: string
}

export default function DownloadButtons(props: DownloadButtonsProps) {
  const { center, className } = props

  const { os } = useSystem()

  return (
    <div
      className={classNames(
        'flex flex-row flex-wrap',
        center && 'items-center justify-center m-auto text-center',
        className,
      )}
    >
      {os ? (
        <>
          <Button
            type="primary"
            href="/pricing"
            target="_top"
            className="mb-2 mr-2"
          >
            Start free trial
          </Button>

          <Button
            type="neutral"
            href="/download?autostart"
            className="mb-2 mr-2"
          >
            {`Download for ${getSystemLabel(os)}`}
          </Button>
        </>
      ) : (
        <>
          <Button type="primary" href="/download" className="mb-2">
            Download the app
          </Button>

          <Button
            type="neutral"
            href={constants.APP_BASE_URL}
            target="_top"
            className="mb-2"
          >
            Open web version
          </Button>
        </>
      )}
    </div>
  )
}
