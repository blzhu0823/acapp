#! /bin/bash

JS_PATH=/home/zbl/acapp/game/static/js/
JS_DIST_PATH=${JS_PATH}dist/
JS_SRC_PATH=${JS_PATH}src/


find ${JS_SRC_PATH} -type f -name '*.js' | sort | xargs cat > ${JS_DIST_PATH}game.js
