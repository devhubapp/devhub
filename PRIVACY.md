# Privacy Policy
## DevHub

### Personal user information
This app requires GitHub authentication.<br/>
These are all permissions that may be requested to you and their reasons:

- [required] `read:user`: Read-only access to the user's profile data, like username, email and avatar;
- [required] `user:email`: Read-only access to the user's e-mail, so DevHub has a way to contact its users if necessary, e.g. security disclosures;
- [required] `notifications`: Read user's public and private notifications; mark as read;
- [required] `read:org`: Read-only access to the user's organizations;
- [deprecated] `public_repo`: Allow starring repositories (removed while DevHub doesn't have this feature activated);
- [deprecated] `repo`: Read user's private content, like events from private repositories ([not recommended](https://github.com/devhubapp/devhub/issues/32)).


### Diagnostics information
This app uses [Bugsnag](https://bugsnag.com), [Google Analytics](https://analytics.google.com/) and [Firebase](https://firebase.google.com/) to collect information about crashes and app usage. 
No personal information is ever sent to third parties, only an annonymous id. Services may collect user's IP. Some device information may be included for debugging purposes, like `brand`, `model` and `operation system`.


### Security & Limited Liability

DevHub follows good practises of security, but 100% security can't be granted in software. DevHub is provided as is without any warranty. Use at your own risk.

Client-side communication is encrypted using HTTPS. Server-side tokens are encrypted or behind environment variables.

Disclaimer: DevHub does not access any code from any repository, but GitHub's oauth permissions `public_repo` and `repo` provide write access. Make sure to keep your tokens safe. For example, be extra careful with which browser extensions you have installed. Token safety is user's reponsability.


### Support
Feel free to open an issue or contact us via e-mail ([support@devhubapp.com](mailto:support@devhubapp.com)).<br/>
If you find any bug, please contribute by opening an issue or sending a pull request with the fix.

---

Updated January 3rd, 2019.
