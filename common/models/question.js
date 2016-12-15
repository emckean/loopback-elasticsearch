'use strict';

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

module.exports = function(Question) {


	Question.search = function(term, cb){
		Question.all({
                native: {
					query: {
				    multi_match: {
				      query: term,
				      fields: [ 
				        'question.asciifolded',
				        'question.text',
				        'question.text_lc',
				        'question.shingle',
				        'question.shingle_lc',
				        'question.stemmed'
				      ],
				      type: 'most_fields' 
				    }
				  }
                }
                
            }, function (err, questions){
            	if (err){

            	}
				console.log('got here')
				cb(null, questions);
			});
	}

	Question.remoteMethod(
		'search', {
			http: {
				path: '/search',
				verb: 'get'
			},
			description: "Gets questions that include term",
			accepts: {arg: 'term', type: 'string', http: {source: 'query'}, description: "word or phrase to search for"},
			returns: {
				arg: 'questions',
				type: 'json'

			}
		})

	Question.findRandom = function(cb){
		var random = randomInt(1, 300000)
		Question.findOne({
				  "native": {
				    "query": {
				      "function_score": {
				        "functions": [
				          {
				            "random_score": {
				              "seed": random
				            }
				          }
				        ],
				        "score_mode": "sum"
				      }
				    }
				  }
            }, function (err, questions){
				console.log('got here')
				cb(null, questions);
			});
	}

	Question.remoteMethod(
		'findRandom', {
			http: {
				path: '/findRandom',
				verb: 'get'
			},
			description: 'Gets one random question',
			returns: {
				arg: 'questions',
				type: 'json'
			}
		})


	//let's disable the methods we don't want people to use
	// Question.disableRemoteMethodByName('create');		// Removes (POST) /Questions
	Question.disableRemoteMethodByName('exists');		// Removes (GET) /Questions/:id/exists
	// Question.disableRemoteMethodByName('find');		// Removes (GET) /Questions/:id/exists
	Question.disableRemoteMethod('findById', true);		// Removes (GET) /Questions/:id
	Question.disableRemoteMethod('upsert', true);		// Removes (PUT) /Questions
	Question.disableRemoteMethod('deleteById', true);	// Removes (DELETE) /Questions/:id
	Question.disableRemoteMethod('replaceById', true);	// Removes (DELETE) /Questions/:id
	Question.disableRemoteMethod("updateAll", true);		// Removes (POST) /Questions/update
	Question.disableRemoteMethod("replaceOrCreate", true);		// Removes (POST) /Questions/replaceOrCreate
	Question.disableRemoteMethod("updateAttributes", false); // Removes (PUT) /Questions/:id
	Question.disableRemoteMethod('createChangeStream', true); // removes (GET|POST) /Questions/change-stream
	Question.disableRemoteMethod('upsertWithWhere', true); // removes POST /Questions/upsertWithWhere
};
