# Privacy Policy

## DevHub


### Personal user information
DevHub requires a basic GitHub OAuth authentication.<br/>
DevHub requests access to the user's profile, e-mail and public notifications.


### Personal Access Token (PAT)
You have the option to add a PAT to have access to private repositories.
The token created will be stored locally and will never be sent to DevHub or any server other than GitHub.
DevHub servers will not have access to this token nor the resources it allows access to.

### GitHub App permissions
You have the option to install DevHub's GitHub App in some specific repositories.
This is one of the ways to enable access to private repositories.
The main difference from PAT is that PATs quietly give access to all repositories while GitHub Apps are opt-in per repository and may require admin approval.

DevHub will have access to issues, pull requests, comments, labels, assignees, milestones, merges, collaborators and some other metadata (e.g. repository name).
The token may or may not include access to code to be able to return some types of activities, like commits. For that reason, we currently recommend using PAT instead, which is local-only (safer).


### Diagnostics information
This app uses [Bugsnag](https://bugsnag.com), [Google Analytics](https://analytics.google.com/) and [Firebase](https://firebase.google.com/) to collect information about crashes and app usage. 
No personal information is ever sent to third parties, only an anonymous id. Services may collect the user's IP. Some device information may be included for debugging purposes, like `brand`, `model` and `operation system`.


### Security & Limited Liability

DevHub follows good practices of security, but 100% security can't be granted in software. 
DevHub is provided as is without any warranty. Use at your own risk.

Client-side communication is encrypted using HTTPS. Server-side tokens are encrypted or behind environment variables.
We recommend being extra careful with which browser extensions you have installed to avoid token exposure to third parties.


### Marketing

We might contact you (very rarely) via e-mail to share things like big updates or important announcements, with the option to unsubscribe any time.


### Support
Feel free to open an issue or contact us via e-mail ([support@devhubapp.com](mailto:support@devhubapp.com)).<br/>
If you find any bug, please contribute by opening an issue or sending a pull request with the fix.

---

Updated: Dec 08th, 2020.
