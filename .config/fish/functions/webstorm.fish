function webstorm -d "overriding default webstorm by detaching it from terminal" -w webstorm
    ~/.local/bin/webstorm $argv > /dev/null 2>&1 & disown
end
