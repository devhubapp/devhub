# Contributing

Thanks for your interest in contributing to DevHub! <br />
It's hard to do it alone, so bug reports, feature requests and other contributions are more than welcome! <br/>

Whenever possible, please make a pull request with the implementation instead of just requesting it.
If the feature is big, open an issue first for discussion.

> **Important**: DevHub is a mobile-first cross-platform project. All code syntax targets react-native, not react-dom. Make sure to use `StyleSheet` instead of normal CSS and to test it on both android/ios instead of only the browser.

## Running it locally

### Requirements

- [Node.js](https://nodejs.org/) (latest)
- [Yarn](https://yarnpkg.com/)

> **Note:** On Windows, you might need to install Bash commands (e.g. via [git-scm](https://git-scm.com/downloads) or via [linux bash shell](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/))

**Note:** On Mac, if you have previously installed Apache Hadoop, there may be a preexisting shell command for yarn.  You may need to try one of the yarn aliases.  Also, if you run into issues with the yarn install command, try running `sudo gem update xcodeproj`

### How to run

- `git clone https://github.com/devhubapp/devhub.git`
- `yarn install`
- `cd packages/mobile/ios && pod install && cd ../..`
- `yarn dev`

That's it. It will start three workers: `TypeScript compilation watcher`, `Web server` (create-react-app) and the `Mobile server` (react-native packager). The browser will open automatically.

>  Alternatives to `yarn dev`: `yarn dev:web`, `yarn dev:desktop`, `yarn dev:mobile`, `yarn dev:landing`

To open the mobile projects, use:

- `yarn xcode`
- `yarn studio`
<br />

## Running it online

Alternatively, you can contribute using Gitpod, a free online dev environment for GitHub:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/devhubapp/devhub)
<br/>

> Disclaimer: Gitpod is a third party service and is not affiliated with GitHub neither DevHub.

> When using a third party service, your tokens may be less secured.

