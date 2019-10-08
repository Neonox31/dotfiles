function idea -d "overriding default idea by detaching it from terminal" -w idea
    ~/.local/bin/idea $argv > /dev/null 2>&1 & disown
end
