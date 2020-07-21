# Local Development
Guideline to install what you need to dev

### Prerequisites

Node and Git:
  - Node: 13.x or latest stable version
  - Git: `sudo apt install git`

expo-cli:
  - Install with `npm i -g expo-cli` or `yarn global add expo-cli`
  - Login 

Expo Client App:
  - Android [PlayStore](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - iOS [AppStore](https://itunes.com/apps/exponent)

## Installing project

If not done yet, generate your ssh key and add it to github

`ssh-keygen` <= creates a new sshkey in `~/.ssh`
In github, account, settings, SSH and GPG keys. Paste the `cat ~/.ssh/id_rsa.pub` output in the new key.

#### Cloning

Using SSH : `git clone git@github.com:awalshy/prayer-notifications-app.git`

#### Installing depedencies

Run the following command: `yarn install`

You might need to install expo first with `yarn add expo`

#### Launching

Run `expo-cli start` to launch metro server and expo. It should appear in your Expo Client app.