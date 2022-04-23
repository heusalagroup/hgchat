#!/bin/bash
set -x
set -e

export REACT_APP_IO_URL='https://io.viesti.app'

npm run build

rsync -a build/ viestiapp-1:sites/www.viesti.app/www/
