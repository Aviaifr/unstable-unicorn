if [ "$NODE_ENV" == "production" ]
then
    node server/index.ts
else
    npm install -g node-dev
    node-dev server/index.ts --inspect=0.0.0.0:9229
fi