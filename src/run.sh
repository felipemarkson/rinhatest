set -e

_term() { 
  echo "Caught SIGTERM signal!" 
  pkill -TERM npm
  exit
}

trap _term SIGTERM

npm run server &
wait $!
