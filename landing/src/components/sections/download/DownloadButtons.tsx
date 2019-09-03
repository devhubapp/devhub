import { getSystemLabel } from '../../../helpers'
import { useSystem } from '../../../hooks/use-system'
import Button from '../../common/buttons/Button'

export interface DownloadButtonsProps {}

export default function DownloadButtons(_props: DownloadButtonsProps) {
  const { category, os } = useSystem()

  return (
    <div className="flex flex-row flex-wrap mb-4">
      {os ? (
        <>
          <Button
            type="primary"
            href="/download?autostart"
            className="mb-2 mr-2"
          >
            {`Download for ${getSystemLabel(os)}`}
          </Button>

          {category === 'desktop' ? (
            <Button type="neutral" href="/download" className="mb-2">
              Other downloads
            </Button>
          ) : (
            <Button
              type="neutral"
              href="https://app.devhubapp.com/"
              target="_top"
              className="mb-2"
            >
              Open web version
            </Button>
          )}
        </>
      ) : (
        <>
          <Button type="primary" href="/download" className="mb-2 mr-2">
            Download the app
          </Button>

          <Button
            type="neutral"
            href="https://app.devhubapp.com/"
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
