set fish_greeting ""

# Set autojump
set -gx OSTYPE (uname -a | tr '[:upper:]' '[:lower:]')
if test -f ~/.autojump/share/autojump/autojump.fish; . ~/.autojump/share/autojump/autojump.fish; end

# Set PATH : 
set -gx PATH $HOME/.local/bin \
	     ./node_modules/.bin \
	     $HOME/.yarn/bin \
	     $HOME/.cargo/bin \
	     /home/linuxbrew/.linuxbrew/bin \
	     $PATH

# Set GOPATH
#set -gx GOPATH $HOME/code/go

# Set JAVA_HOME
#set -gx JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64

# Aliases
## System
alias ll='ls -lah'
alias rcp='rsync -avhr --info=progress2'

## Kubernetes
alias k=kubectl
alias kc=kubectx
alias kt=kubetail
alias kf=kubefwd
alias kp=kubeps
alias kn=kubens

# Direnv
set -x DIRENV_LOG_FORMAT ""
direnv hook fish | source
