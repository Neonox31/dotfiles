# Inspired from:
# https://github.com/jonmosco/kube-ps1
# https://github.com/Ladicle/fish-kubectl-prompt

function __kube_prompt_set_color
    set -l user_variable_name "$argv[1]"
    set -l user_variable $$user_variable_name
    set -l user_variable_bright

    set -l default default_done
    switch (count $argv)
        case 1 # No defaults given, use prompt color
            set default $___fish_git_prompt_color
            set default_done $___fish_git_prompt_color_done
        case 2 # One default given, use normal for done
            set default "$argv[2]"
            set default_done (set_color normal)
        case 3 # Both defaults given
            set default "$argv[2]"
            set default_done "$argv[3]"
    end

    set -l variable _$user_variable_name
    set -l variable_done "$variable"_done

    if not set -q $variable
        if test -n "$user_variable"
            set -g $variable (set_color $user_variable)
            set -g $variable_done (set_color normal)
        else
            set -g $variable $default
            set -g $variable_done $default_done
        end
    end
end

function __kube_ps_update_cache
  function __kube_ps_cache_context
    set -l ctx (kubectl config current-context 2>/dev/null)
    if test $status -eq 0
      set -g __kube_ps_context "$ctx"
    else
      set -g __kube_ps_context "n/a"
    end
  end

  function __kube_ps_cache_namespace
    set -l ns (kubectl config view --minify -o 'jsonpath={..namespace}' 2>/dev/null)
    if test -n "$ns"
      set -g __kube_ps_namespace "$ns"
    else
      set -g __kube_ps_namespace "default"
    end
  end

  set -l kubeconfig "$KUBECONFIG"
  if test -z "$kubeconfig"
    set kubeconfig "$HOME/.kube/config"
  end

  if test "$kubeconfig" != "$__kube_ps_kubeconfig"
    __kube_ps_cache_context
    __kube_ps_cache_namespace
    set -g __kube_ps_kubeconfig "$kubeconfig"
    set -g __kube_ps_timestamp (date +%s)
    return
  end

  for conf in (string split ':' "$kubeconfig")
    if test -r "$conf"
      if test -z "$__kube_ps_timestamp"; or test (/usr/bin/stat -c '%Y' "$conf") -gt "$__kube_ps_timestamp"
        __kube_ps_cache_context
        __kube_ps_cache_namespace
        set -g __kube_ps_kubeconfig "$kubeconfig"
        set -g __kube_ps_timestamp (date +%s)
        return
      end
    end
  end
end

function __kube_prompt
  if test -z "$__kube_ps_enabled"; or test $__kube_ps_enabled -ne 1
    return
  end

  __kube_prompt_set_color __kube_prompt_color_suffix
  __kube_prompt_set_color __kube_prompt_color_icon
  __kube_prompt_set_color __kube_prompt_color_context
  __kube_prompt_set_color __kube_prompt_color_separator
  __kube_prompt_set_color __kube_prompt_color_namespace
  __kube_prompt_set_color __kube_prompt_color_suffix

  __kube_ps_update_cache
  echo -n -s " $___kube_prompt_color_prefix($___kube_prompt_color_icon$__kube_prompt_char_icon$___kube_prompt_color_context$__kube_ps_context$___kube_prompt_color_separator$__kube_prompt_char_separator$___kube_prompt_color_namespace$__kube_ps_namespace$___kube_prompt_color_suffix)"
end
