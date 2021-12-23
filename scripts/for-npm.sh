npm install -g json
json -I -f package.json \
  -e 'this.name="cxhub-query-builder"' \
  -e 'this.repository.url="https://github.com/aShelist/react-awesome-query-builder"' \
  -e 'delete this.publishConfig'
