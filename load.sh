let numberofQuestions=$(cat data/JEOPARDY_QUESTIONS1.json| jq '. | length')
echo "There are $numberofQuestions questions to load ..."

COUNTER=0
LIMIT=100

while [  $COUNTER -lt $LIMIT ]; do
	#this line uses jq to grab the COUNTERth item from the large json file, and then escapes single quotes before outputting to temp file
	echo $(cat data/JEOPARDY_QUESTIONS1.json | jq '.['$COUNTER']' | sed "s/'/\\\u0027/g")	> data/tempfile.txt

	#this line posts tempfile to elasticsearch -- make sure you have the right index and collection name! it will autogenerate an id
	curl -XPOST http://localhost:9200/jeopardy/Question/ -d @"data/tempfile.txt"
	
	#put in a newline for readability
	echo ""
	
	#increment counter
	let COUNTER=COUNTER+1 
	
	#let's give some indication of how many are left to load
	if (( $COUNTER % 10 == 0 ))
	then
     echo -e "\n`expr $numberofQuestions - $COUNTER` left to load ..."
	fi
		
	
done