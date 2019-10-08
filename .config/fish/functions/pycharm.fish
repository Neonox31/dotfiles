function pycharm -d "overriding default pycharm by detaching it from terminal" -w pycharm
    ~/.local/bin/pycharm $argv > /dev/null 2>&1 & disown
end
