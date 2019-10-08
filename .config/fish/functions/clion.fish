function clion -d "overriding default clion by detaching it from terminal" -w clion
    ~/.local/bin/clion $argv > /dev/null 2>&1 & disown
end
