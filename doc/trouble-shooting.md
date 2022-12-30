## (1) "error Ignoring ffi-1.13.1 because its extensions are not built"
`npx --ignore-existing react-native init app --template react-native-template-typescript`
```
...
✖ Installing Bundler
error Ignoring ffi-1.13.1 because its extensions are not built. Try: gem pristine ffi --version 1.13.1
```
### Solution
[stackoverflow](https://stackoverflow.com/a/65248326)  
`gem install ffi --version 1.13.1 --user-install`  
Then add the installation path to mPATH variable: add this line to my ~/.zshrc:
```
export PATH=$HOME/.gem/ruby/2.6.0/bin:$PATH
```

## (2) "error Your Ruby version is 2.6.10, but your Gemfile specified 2.7.5"
`npx --ignore-existing react-native init app --template react-native-template-typescript`
```
...
✖ Installing Bundler
error Your Ruby version is 2.6.10, but your Gemfile specified 2.7.5
```
### Solution
(0) Check current ruby version  
`ruby -v`
```
ruby 2.6.10p210 (2022-04-12 revision 67958) [universal.x86_64-darwin22]
```
(1) Install `rvm`
[Install RVM in macOS (step by step)](https://nrogap.medium.com/install-rvm-in-macos-step-by-step-d3b3c236953b)
```
brew install gnupg
gpg --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash
```
Complete the post-installation instructions:
```
Downloading https://github.com/rvm/rvm/archive/master.tar.gz
Installing RVM to /Users/kuang/.rvm/
    Adding rvm PATH line to /Users/kuang/.profile /Users/kuang/.mkshrc /Users/kuang/.bashrc /Users/kuang/.zshrc.
    Adding rvm loading line to /Users/kuang/.profile /Users/kuang/.bash_profile /Users/kuang/.zlogin.
Installation of RVM in /Users/kuang/.rvm/ is almost complete:

  * To start using RVM you need to run `source /Users/kuang/.rvm/scripts/rvm`
    in all your open shell windows, in rare cases you need to reopen all shell windows.
Thanks for installing RVM 🙏
Please consider donating to our open collective to help us maintain RVM.

👉  Donate: https://opencollective.com/rvm/donate

```
Don't forget to add the line
```
source /Users/kuang/.rvm/scripts/rvm
```
to ~/.zshrc file if you are using zsh.

(2) Install `ruby-2.7.5` with `rvm`
```
rvm install 2.7.5
```
In case switching ruby version is needed,
```
rvm use 2.6.10
```
(3)  Continue  
Go to the root folder of the new created app,
```
bundle install
cd ios && bundle exec pod install
```
