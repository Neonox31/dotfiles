function k8s_tiller_tls -d "Retrieve tiller TLS certs from Kubernetes"

  kubectl get secrets/tiller-secret -n "gitlab-managed-apps" -o "jsonpath={.data['ca\.crt']}" | base64 -d > /tmp/tiller-ca.crt
  kubectl get secrets/tiller-secret -n "gitlab-managed-apps" -o "jsonpath={.data['tls\.crt']}" | base64 -d > /tmp/tiller.crt
  kubectl get secrets/tiller-secret -n "gitlab-managed-apps" -o "jsonpath={.data['tls\.key']}" | base64 -d > /tmp/tiller.key

  set -gx TILLER_TLS_FLAGS --tls --tls-ca-cert /tmp/tiller-ca.crt --tls-cert /tmp/tiller.crt --tls-key /tmp/tiller.key
 
end

