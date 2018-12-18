<p align="center">
  <img src="https://user-images.githubusercontent.com/619186/49823485-eed18480-fd66-11e8-88c0-700d840ad4f1.png" height="100" /><br/>
  <span><b>DevHub</b>: <span>TweetDeck for GitHub [BETA]</span><br/>
  <span>Android, <a href="https://itunes.apple.com/br/app/devhub-for-github/id1191864199?l=en&mt=8" target="_blank">iOS</a> & <a href="https://devhubapp.com/" target="_blank">Web</a> with <b>95%+ code sharing</b> between them</span><br/>
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
- [x] **Dashboard spier**: See other users' home screen (their GitHub dashboard) so you can discover new interesting people and repositories;
- [x] **Save for later**: Save any activity or notification for later, so you don't forget to get back to them;
- [x] **Theme support**: Choose between 6 light or dark themes;
- [x] **And more!**: Native apps, keyboard shortcuts, open source, modern tech stack, ...

### Next features:

- [ ] **Android app**: [#19](https://github.com/devhubapp/devhub/issues/19)
- [ ] **Desktop apps**: [#2](https://github.com/devhubapp/devhub/issues/2)
- [ ] **More filters**: Filter items by type (issue, pr, etc.); filter by regex; filter by org/repos;
- [ ] **Issues/PR management**: New column types to manage all issues and PRs, filter the ones assigned to you, etc.;
- [ ] **Trending**: New column type to show Trending repositories ([#48](https://github.com/devhubapp/devhub/issues/48));
- [ ] **Keyboard shortcuts**: Full support for keyboard shortcuts and other accessibility improvements;
- [ ] **Drag & Drop**: Allow moving columns using drag&drop ([#42](https://github.com/devhubapp/devhub/issues/42))

> Which one do you want first? Any other recommendations? Search for [existing feature requests](https://github.com/devhubapp/devhub/issues?q=is%3Aissue+is%3Aopen+label%3A%22feature+request%22+sort%3Areactions-%2B1-desc) and add a 👍 reaction on them, or create a new one.

### Paid features:

#### Why is this app "just" 99% free and not 100%?

> "If you find something you think is cool then give that person some money for it so they can make more things you think are cool" 💙

DevHub plans to be a sustainable open source project. It's not made by a huge company like Facebook. It was created by a single developer that could be making $200k on Facebook, but instead makes $0 working on this full time. DevHub does not plan to work with donations and, instead, plan to create real value for its users and have a few paid features. If you want the project to live and be actively maintained, understand that it will need a revenue and consider subscribing to the paid plan once it launches.

- [ ] **Support for private repositories**: See what your team members are working on ([#32](https://github.com/devhubapp/devhub/issues/32));
- [ ] **Push notifications**: Enable push notifications for your filtered columns on mobile and/or desktop ([#51](https://github.com/devhubapp/devhub/issues/51));
- [ ] **GitHub Enterprise**: Support for self hosted GitHubs on local networks; contact us via e-mail: [enterprise@devhubapp.com](mailto:enterprise@devhubapp.com) so we can work on this together.

> Any suggestion for other paid features? Thoughts about the topic?  [Open an issue](https://github.com/devhubapp/devhub/issues/new)!


<br/>


## Keyboard shortcuts

| Key       | Action                       | Implemented    |
| --------- | ---------------------------- | -------------- |
| `Esc`     | Close current open modal     | ✅
| `a`, `n`  | Add a new column             | ✅
| `1`...`9` | Go to the `nth` column       | ✅
| `0`       | Go to the last column        | ✅
| `j`, `k`  | Move down/up inside a column | [Contribute!](https://github.com/devhubapp/devhub/blob/6157822c7723c85e11bf4bd781656a0204f81ab2/packages/components/src/screens/MainScreen.tsx#L94-L145)
| `s`       | Toggle save item for later   | [Contribute!](https://github.com/devhubapp/devhub/blob/fbe728fb106712092df1341aba5fdf12807e1f11/packages/components/src/components/cards/partials/NotificationCardHeader.tsx#L125-L133)
| `Arrow keys` + `Space` | Focus on elements and press things | Contribute!
| `Alt + Arrow keys` | Move current column | Contribute!
| `?`       | Show keyboard shortcuts      | Contribute!


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

> If the feature is big, please open an issue first for discussion.

### Running it locally

- `git clone git@github.com:devhubapp/devhub.git`
- `yarn`
- `yarn dev`

That's it. It will start three workers: `TypeScript compilation watcher`, `Web server` (create-react-app) and the `Mobile server` (react-native packager). The browser will open automatically.

To open the mobile projects, use:

- `yarn xcode`
- `yarn studio`

> Note: See License below. For example, you are allowed to use this locally, but not allowed to distribute the changed app to other people or remove its paid features, if any.

<br/>

## Author

Follow me on Twitter: [@brunolemos](https://twitter.com/brunolemos)

<a href="https://twitter.com/brunolemos" target="_blank"><img src="https://twitter.com/brunolemos/profile_image?size=original" height="100" /></a>

<br/>

## License

Copyright (c) 2018 [Bruno Lemos](https://twitter.com/brunolemos).

This is project provided as is without any warranties.<br/>
By using this app you agree with its [privacy](PRIVACY.md) policy and the  [license](LICENSE.md) below:

- ✅ You are encouraged to use, share and submit pull requests with improvements;

- ✅ You are allowed to use the official hosted version ([devhubapp.com](https://devhubapp.com/)) on your company or commercial projects;

- ✅ You are allowed to use the source code for personal non-commercial purposes only, like studying or contributing;

- 🚫 You are not allowed to distribute this app anywhere, neither changed versions of this app, including but not limited to Apple Store, Google Play or Web; Changes to the source code can only be used locally, taking in consideration the other points of this License;

- 🚫 You are not allowed to charge people for this app, neither bypass its paid features, if any;

> Don't like this license? [Suggestions welcome](https://github.com/devhubapp/devhub/issues/33).
