<p align="center">
  <img src="https://user-images.githubusercontent.com/619186/49823485-eed18480-fd66-11e8-88c0-700d840ad4f1.png" height="100" /><br/>
  <span><b>DevHub</b>: <span>TweetDeck for GitHub <i>[BETA]</i></span><br/>
  <span><a href="https://play.google.com/store/apps/details?id=com.devhubapp" target="_blank">Android</a>, <a href="https://itunes.apple.com/br/app/devhub-for-github/id1191864199?l=en&mt=8" target="_blank">iOS</a>, <a href="https://devhubapp.com/" target="_blank">Web</a> & <a href="https://github.com/devhubapp/devhub/releases" target="_self">Desktop</a> with <b>95%+ code sharing</b> between them<br/><i>thanks to React Native + React Native Web</i></span><br/>
  <a href="https://devhubapp.com/" target="_blank">devhubapp.com</a>
</p>
  
[![DevHub Desktop](https://user-images.githubusercontent.com/619186/49800542-dfcee000-fd2e-11e8-8e08-ff95c5872513.png)](https://devhubapp.com/)


<p align="center">
  <a href="https://devhubapp.com/" target="_blank">
  <img alt="DevHub Mobile - Events" height="620" src="https://user-images.githubusercontent.com/619186/49802010-ebbca100-fd32-11e8-94d6-e8efb1b5dda8.PNG" />
  <img alt="DevHub Mobile - Event Filters" height="620" src="https://user-images.githubusercontent.com/619186/49802011-ebbca100-fd32-11e8-80c1-5d7cad609e7b.png" />
  <img alt="DevHub Mobile - Notification Filters" height="620" src="https://user-images.githubusercontent.com/619186/49802012-ebbca100-fd32-11e8-8740-54ac8741edec.PNG" />
  </a>
</p>

<br/>

## Why

DevHub helps you take back control of your GitHub workflow and stay on top of everything important going on.

## Features

- [x] **Columns layout**: Like TweetDeck, you can see at a quick glance everything that is going on; made for power users;
- [x] **Inbox Zero**: Clear all the seen items and keep your mind clean; Archived items will be moved to a separate place;
- [x] **Filters**: Apply different filters to each column; remove all the noise and make them show just what you want;
- [x] **Enhanced notifications**: See all the relevant information before opening the notification, like issue/pull request status, comment content, release description, etc.;
- [x] **Sanely watch repositories**: Keep up to date with repositories' activities without using the `watch` feature so your notifications don't get cluttered;
- [x] **Stalker mode**: Follow user activities without using the `follow` button and see activities that GitHub doesn't show on your feed, like issue comments and pushed commits;
- [x] **Dashboard viewer**: See other users' home screen (their GitHub dashboard) so you can discover new interesting people and repositories;
- [x] **Save for later**: Save any activity or notification for later, so you don't forget to get back to them;
- [x] **Theme support**: Choose between 6 light or dark themes;
- [x] **And more!**: Desktop apps, native mobile apps, open source, modern tech stack, ...

### Next features:

- [ ] **Support for private repositories**: See what your team members are working on ([#32](https://github.com/devhubapp/devhub/issues/32));
- [ ] **More filters**: Filter items by type (issue, pr, etc.); filter by regex; filter by org/repos;
- [ ] **Issues/PR management**: New column types to manage all issues and PRs, filter the ones assigned to you, etc.;
- [ ] **Trending**: New column type to show Trending repositories ([#48](https://github.com/devhubapp/devhub/issues/48));
- [ ] **Push notifications**: Enable push notifications for your filtered columns on mobile and/or desktop ([#51](https://github.com/devhubapp/devhub/issues/51));
- [ ] **Keyboard shortcuts**: Full support for keyboard shortcuts and other accessibility improvements;
- [ ] **Drag & Drop**: Allow moving columns using drag&drop ([#42](https://github.com/devhubapp/devhub/issues/42))
- [ ] **GitHub Enterprise**: Support for self hosted GitHubs on local networks; contact us via e-mail: [enterprise@devhubapp.com](mailto:enterprise@devhubapp.com) to show your interest.

> Which one do you want first? Any other recommendations? Search for [existing feature requests](https://github.com/devhubapp/devhub/issues?q=is%3Aissue+is%3Aopen+label%3A%22feature+request%22+sort%3Areactions-%2B1-desc) and add a 👍 reaction on them, or create a new one.

#### About paid features

##### What features will be paid?

- Support for private repositories
- Support for GitHub Enterprise
- Push notifications

##### Why is this app not completely free?

> "If you find something you think is cool then give that person some money for it so they can make more things you think are cool" 💙

DevHub plans to be a sustainable open source project. It's not made by a huge company like Facebook. It is made by a single developer that could be making $200k on Facebook, but instead makes $0 working on this full time. DevHub does not intend to work with donations and, instead, plans to create real value for its users and have a few paid features. If you want the project to live and be actively maintained, understand that it will need a revenue and consider subscribing to the paid plan once it launches.

> Any suggestion? [Open an issue](https://github.com/devhubapp/devhub/issues/new)!


<br/>


## Keyboard shortcuts

| Key       | Action                       | Implemented    |
| --------- | ---------------------------- | -------------- |
| `Esc`     | Close current open modal     | ✅
| `Esc`     | Exit full screen mode on desktop | ✅
| `a`, `n`  | Add a new column             | ✅
| `1`...`9` | Go to the `nth` column       | ✅
| `0`       | Go to the last column        | ✅
| `j`, `k`  | Move down/up inside a column | [Contribute!](https://github.com/devhubapp/devhub/blob/6157822c7723c85e11bf4bd781656a0204f81ab2/packages/components/src/screens/MainScreen.tsx#L94-L145)
| `s`       | Toggle save item for later   | [Contribute!](https://github.com/devhubapp/devhub/blob/fbe728fb106712092df1341aba5fdf12807e1f11/packages/components/src/components/cards/partials/NotificationCardHeader.tsx#L125-L133)
| `Arrow keys` + `Space` | Focus on elements and press things | Contribute!
| `Alt + Arrow keys` | Move current column | Contribute!
| `?`       | Show keyboard shortcuts      | Contribute!

> **Tip:** To scroll horizontally on devices without horizontal scrolling (e.g. on Windows), hold `Shift` and scroll vertically

<br/>

<br/>

## Tech Stack

- [TypeScript](https://github.com/Microsoft/TypeScript)
- [Create React App](https://github.com/facebook/create-react-app)
- [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) (Monorepo)
- [React](https://github.com/facebook/react) with [Hooks](https://reactjs.org/docs/hooks-intro.html)
- [React Native](https://github.com/facebook/react-native)
- [React Native Web](https://github.com/necolas/react-native-web)
- [Redux](https://github.com/reduxjs/react-redux)
- [Redux Persist](https://github.com/rt2zz/redux-persist)
- [Redux Saga](https://github.com/redux-saga/redux-saga/)
- [Reselect](https://github.com/reduxjs/reselect)
- [GraphQL](https://github.com/facebook/graphql)


<br/>

## Contributing

Bug reports, feature requests and other contributions are more than welcome! <br/>
Whenever possible, please make a pull request with the implementation instead of just requesting it.

If the feature is big, open an issue first for discussion.

> **Important**: DevHub is a mobile-first cross-platform project. All code syntax targets react-native, not react-dom. Make sure to use `StyleSheet` instead of normal CSS and to test it on both android/ios instead of only the browser.

### Running it locally

#### Requirements

- [Node.js](https://nodejs.org/) (latest)
- [Yarn](https://yarnpkg.com/)

> **Note:** On Windows, you might need to install Bash commands (e.g. via [git-scm](https://git-scm.com/downloads) or via [linux bash shell](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/))

#### How to run

- `git clone git@github.com:devhubapp/devhub.git`
- `yarn`
- `yarn dev`

That's it. It will start three workers: `TypeScript compilation watcher`, `Web server` (create-react-app) and the `Mobile server` (react-native packager). The browser will open automatically.

>  Alternatives to `yarn dev`: `yarn dev:web`, `yarn dev:desktop`, `yarn dev:mobile`

To open the mobile projects, use:

- `yarn xcode`
- `yarn studio`

<br/>

## Author

Follow me on Twitter: [@brunolemos](https://twitter.com/brunolemos)

<a href="https://twitter.com/brunolemos" target="_blank"><img src="https://twitter.com/brunolemos/profile_image?size=original" height="100" /></a>

<br/>

## License

Copyright (c) 2019 Bruno Lemos.

This project is provided as is without any warranties. Use at your own risk.<br/>
By using DevHub you agree with its [privacy](PRIVACY.md) policy and [license](LICENSE.md).
