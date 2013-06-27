$queuestruct = hiera('depmongo')
$mongoip = $queuestruct[0]['ip']

node /^depmongo/ {
  include depdb
}

node /^depnotif/ {
  include dependpoint
}

