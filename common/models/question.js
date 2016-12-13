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
				        'question',
				        'question.text'
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
		//replace w/'count'
		// var random = randomInt(1, 10000)
		var random = 2836
		Question.findOne({
	                where: {
	                	'random': random
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

	Question.observe('before save', function addRandom(ctx, next) {


	  if (ctx.instance) {
	  	var random = randomInt(1,10000);
	  	console.log(random)
	    ctx.instance.random = random;
	  } 
	  // else {
	  //   ctx.data.updated = new Date();
	  // }
	  next();
	});

	//let's disable the methods we don't want people to use
	// Question.disableRemoteMethodByName('create');		// Removes (POST) /Questions
	Question.disableRemoteMethodByName('exists');		// Removes (GET) /Questions/:id/exists
	Question.disableRemoteMethodByName('find');		// Removes (GET) /Questions/:id/exists
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
