
12/5
slc loopback
empty project

https://www.npmjs.com/package/loopback-connector-es	

  ##Explorer
  `npm install --save loopback-component-explorer` 
  Add a section to `server/component-config.json` to setup the component
```{
  "loopback-component-explorer": {
    "mountPath": "/explorer"
  }
}
this should be added automatically

1 add loopback express connector
2 get local elasticsearch details
3 add mappings for data
4 upload data

## elasticsearch
am using version 2.3.4
install and run (./bin/elasticsearch)
create index: 'curl -XPUT 'http://localhost:9200/jeopardy'
check if index created: curl -XGET 'http://localhost:9200/_cat/indices?v'
check mapping curl -XGET 'http://localhost:9200/_mapping?pretty=true'
check health curl -XGET http://localhost:9200/_cluster/health?pretty=true

** data has single quotes in it, screws up posting
http://stackoverflow.com/questions/18612248/how-to-escape-single-quotes-into-double-quotes-into-single-quotes
http://stackoverflow.com/questions/15936616/import-index-a-json-file-into-elasticsearch

curl -XPUT http://localhost:9200/jeopardy/question/1 -d @"/Users/emckean/Code/jeopardy-example/data/single-question.json"

elasticdump? http://tech.taskrabbit.com/blog/2014/01/06/elasticsearch-dump/

** use API to actually post all the data
** elasticsearch will create id



12/7
example *does not work* (in Code/myESConnector/example)
the path is CASESENSITIVE: e.g. jeopardy/question/1 and jeopardy/Question/1 are different!
** have to figure out multifield mapping **
** how to reload mapping? ** 
** need to post analyzer and mapping separately ** 
https://github.com/strongloop-community/loopback-connector-elastic-search/issues/59

NEXT STEPS:
load mapping/analyzer separately (make quick script to do this)
test searches that require analyzed fields


single doc: {"category": "HISTORY", "air_date": "2004-12-31", "question": "'For the last 8 years of his life, Galileo was under house arrest for espousing this man's theory'", "value": "$200", "answer": "Copernicus", "round": "Jeopardy!", "show_number": "4680"}