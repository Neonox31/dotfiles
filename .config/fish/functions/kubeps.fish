function kubeps
  if test -z "$__kube_ps_enabled"; or test "$__kube_ps_enabled" = 0
    set -U __kube_ps_enabled 1
    return
  end

  set -U __kube_ps_enabled 0
  return
end
