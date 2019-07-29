import Link from 'next/link'
import CheckLabel from '../../common/CheckLabel'
import { CheckLabels } from '../../common/CheckLabels'
import FeatureBlock from './DownloadBlock'

export interface FeaturesBlockProps {}

export default function FeaturesBlock(_props: FeaturesBlockProps) {
  return (
    <section id="features">
      <div className="pb-16 md:pb-32" />

      <FeatureBlock
        title="Manage Notifications"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      />

      <div className="pb-16 md:pb-32" />

      <FeatureBlock
        inverted
        title="Filter repository activities"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      />

      <div className="pb-16 md:pb-32" />

      <FeatureBlock
        title="Cross Platform"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      >
        <CheckLabels>
          <a
            href="https://itunes.apple.com/us/app/devhub-for-github/id1191864199?l=en&mt=8&utm_source=devhub_landing_features"
            target="_blank"
          >
            <CheckLabel label="iOS" />
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.devhubapp&utm_source=devhub_landing_features"
            target="_blank"
          >
            <CheckLabel label="Android" />
          </a>

          <Link href="/download?os=macos">
            <a>
              <CheckLabel label="macOS" />
            </a>
          </Link>

          <Link href="/download?os=windows">
            <a>
              <CheckLabel label="Windows" />
            </a>
          </Link>

          <Link href="/download?os=linux">
            <a>
              <CheckLabel label="Linux" />
            </a>
          </Link>
        </CheckLabels>
      </FeatureBlock>
    </section>
  )
}
