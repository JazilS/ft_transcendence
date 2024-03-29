#!/bin/sh
folder_name="shared" 

folder_path=$(find . -maxdepth 2 -type d -name "$folder_name")
rm -rf ./app/backend/shared 2>>/dev/null
rm -rf ./app/frontend/shared 2>>/dev/null
absolute_path=$(realpath "$folder_path")
ln -s $absolute_path ./app/backend
ln -s $absolute_path ./app/frontend