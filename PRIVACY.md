# Privacy Policy
## DevHub

### Personal user information
This app requires GitHub authentication.<br/>
These are all permissions that may be requested to you and their reasons:

- [required] `user`: Read basic user information, like name and email, if provided by GitHub; This will also be used for autocomplete purposes and to fill the "Me" tab that is yet to be implemented;
- [required] `notifications`: Read user notifications; mark as read;
- [required] `read:org`: Read user organization for autocomplete purposes in the future (to be implemented);
- [required] `public_repo`: Read public GitHub content, like events from any user or repository;
- [optional] `repo`: Read user's private content, like feed events from private repositories.

This app does not access any code from any repository.

### Server

To sync between multiple devices, some informations are saved on [Firebase](https://firebase.google.com):

- `app`: App version;
- `config`: User preferences (theme, ...);
- `data`: Columns created;
- `user`: User basic informations (name, email and logged in date).

No repository content is ever sent to any server (events, commits, notifications, etc, stay only in the user device).


### Diagnostics information
This app uses [Bugsnag](bugsnag.com) to collect information about errors occured while using the app. 
The personal informations collected are `name` and `e-mail`.
It might be included some details about the device, like `brand`, `model` and `operation system` for debug purposes.
Other information sent are only related to the crash itself, like the error call stack.

### Support
Feel free to open an issue or contact me on twitter [@brunolemos](https://twitter.com/brunolemos).<br/>
If you find any bug, please contribute sending a PR with the fix or with a failing test.

---

Created March 17th, 2017.<br/>
Updated March 17th, 2017.
