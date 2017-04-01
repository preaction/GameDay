#!/bin/sh
NAME=gameday

cd dist/$NAME
for BUILD in *; do
    cd $BUILD
    rm ../../$NAME-$BUILD.zip
    zip -r ../../$NAME-$BUILD.zip *
    cd ..
done

