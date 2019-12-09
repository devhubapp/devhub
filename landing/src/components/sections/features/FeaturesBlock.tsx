import Link from 'next/link'

import CheckLabel from '../../common/CheckLabel'
import { CheckLabels } from '../../common/CheckLabels'
import FeatureBlock from './FeatureBlock'

export interface FeaturesBlockProps {}

export default function FeaturesBlock(_props: FeaturesBlockProps) {
  return (
    <div>
      <div className="hidden sm:block">
        <FeatureBlock
          image={{
            position: 'full',
            src: '/static/screenshots/dark/devhub-desktop-menubar.jpg',
            aspectRatio: 1440 / 900,
            alt:
              'DevHub - Desktop app with Menubar mode, and a Push Notification at the top right',
          }}
          title="Desktop app, with Push Notifications"
          subtitle="Choose between two modes: Desktop or Menubar; Enable Push Notifications only for the columns you want"
        />
      </div>

      <div className="block sm:hidden">
        <FeatureBlock
          image={{
            position: 'full',
            src: '/static/screenshots/dark/devhub-desktop-menubar.jpg',
            aspectRatio: (1440 * (1 - 40 / 100)) / 900,
            alt:
              'DevHub - Desktop app with Menubar mode, and a Push Notification at the top right',
            imageStyle: {
              backgroundPosition: 'right',
            },
            // disableHorizontalScrolling: true,
          }}
          title="Desktop app, with Push Notifications"
          subtitle="Choose between two modes: Desktop or Menubar; Enable Push Notifications only for the columns you want"
        />
      </div>

      <div className="pb-16 md:pb-32" />

      {/* <FeatureBlock
        image={{
          position: 'full',
          src: '',
          aspectRatio: 1440 / 798,
          alt: '',
        }}
        title="Manage GitHub Notifications"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
      />

      <div className="pb-16 md:pb-32" /> */}

      {/* <FeatureBlock
        image={{
          position: 'full',
          src: '',
          aspectRatio: 1440 / 798,
          alt: '',
        }}
        title="Filter repository activities"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
      />

      <div className="pb-16 md:pb-32" /> */}

      <FeatureBlock
        image={{
          position: 'full',
          src: '/static/screenshots/dark/devhub-desktop-labels.jpg',
          aspectRatio: 1440 / 798,
          alt: 'DevHub - Label filter',
        }}
        title="Filter by labels and many other filters"
        subtitle="All columns support a common set of filters, like Bot, Label, Issue Status, Text, etc. The Issues & Pull Requests columns are special: they give you all the power of GitHub Advanced Search on your hands (filter by assignee, number of comments, ...)"
      />

      <div className="pb-16 md:pb-32" />

      <FeatureBlock
        image={{
          position: 'full',
          src: '/static/screenshots/dark/devhub-desktop-users.jpg',
          aspectRatio: 1440 / 798,
          alt: 'DevHub - 4 columns with user activities',
        }}
        title="Watch user activities"
        subtitle="Create a column for each person and see what they are up to: Commits, Comments, Issues, Pull Requests, Tags, Releases, ..."
      />

      <div className="pb-16 md:pb-32" />

      <FeatureBlock
        image={{
          position: 'full',
          src: '/static/screenshots/dark/devhub-cross-platform.jpg',
          aspectRatio: 1440 / 900,
          alt:
            'DevHub - Desktop app with Menubar mode, and a Push Notification at the top right',
        }}
        title="Cross Platform"
        subtitle="The same experience on all your devices"
      >
        <CheckLabels center>
          <a
            href="https://itunes.apple.com/us/app/devhub-for-github/id1191864199?l=en&mt=8&utm_source=devhub_landing_page"
            target="_blank"
            rel="noopener"
          >
            <CheckLabel label="iOS" />
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.devhubapp&utm_source=devhub_landing_page"
            target="_blank"
            rel="noopener"
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
    </div>
  )
}
