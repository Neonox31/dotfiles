function nspeed -d "check network speed" -w nspeed
    dd if=/dev/zero of=/tmp/.network-speed bs=2G count=1 > /dev/null 2>&1; and scp /tmp/.network-speed lolo@192.168.10.253:/dev/null; and rm -rf /tmp/.network-speed
end
