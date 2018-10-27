function fish_prompt
  # Cache exit status
  set -l last_status $status

  # Just calculate these once, to save a few cycles when displaying the prompt
  #if not set -q __fish_prompt_hostname
  #  set -g __fish_prompt_hostname (hostname|cut -d . -f 1)
  #end

  set -l white (set_color white)
  set -l green (set_color 6ccc00)
  set -l blue (set_color 4e9fde)

  # Configure __fish_git_prompt
  set -g __fish_git_prompt_char_stateseparator ' '
  set -g __fish_git_prompt_color ed8d82
  set -g __fish_git_prompt_color_flags df5f00
  set -g __fish_git_prompt_color_prefix white 
  set -g __fish_git_prompt_color_suffix white
  set -g __fish_git_prompt_showdirtystate true
  set -g __fish_git_prompt_showuntrackedfiles true
  set -g __fish_git_prompt_showstashstate true
  set -g __fish_git_prompt_show_informative_status true 
  set -g __fish_git_prompt_branch_max_length 20 
 
  # Configure __kube_prompt
  set -g __kube_prompt_char_icon '⎈ '
  set -g __kube_prompt_color_icon 006ed9
  set -g __kube_prompt_color_prefix white
  set -g __kube_prompt_color_suffix white 
  set -g __kube_prompt_color_context 4d96dd
  set -g __kube_prompt_color_namespace 4d96dd
  set -g __kube_prompt_color_separator 908b8b
  set -g __kube_prompt_char_separator '|' 

  # $blue$USER'@'$__fish_prompt_hostname' 

  echo -n ⟡ $green(prompt_pwd)$white
  __fish_git_prompt
  __kube_prompt
  echo ' > '
end


