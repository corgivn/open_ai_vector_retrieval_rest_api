#!/bin/bash
echo "Finding Node.js server processes..."
pids=$(ps -ef | grep "node src/server.js" | grep -v grep | awk '{print $2}')

if [ -z "$pids" ]; then
  echo "No server processes found."
else
  echo "Stopping server processes with PIDs: $pids"
  echo $pids | xargs kill
  echo "Server stopped."
fi
