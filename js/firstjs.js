//VIEW
var setHomePage = function() {
	var containerNode = document.querySelector('.container')
	var html = ''
	    html += '<p> Welcome to our... website</p>' 

	    containerNode.innerHTML = html

}

var setSearchPage = function(eventObj) {

}


var searchNode = document.querySelector('.search')
searchNode.addEventListener('keydown', function(eventObj) {
	if(eventObj.keyCode === 13) {
       //take the input from the search bar
       //make that input become the URL after the hashtag
		var input = eventObj.target.value 

		location.hash = 'search/' + input  //pattern matching in the routing (when we match 'search' we add the input)

		eventObj.target.value = ''
	}
})

//COLLECTION 
//is an object that contains array of models 
var TimesCollection = Backbone.Collection.extend({
	url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
	//parse takes the API response and return the array that we want 
	parse: function(apiResponse){
		return apiResponse.response.docs
	}

})


//CONTROLLER
var TimesRouter = Backbone.Router.extend({

	//define rout

	routes: {
		"home": "showHomePage",

		"search/:search": "searchPage",
	},

	showHomePage: function() {
		setHomePage()
	},

	searchPage: function(query) {
		var collectionInstance =  new TimesCollection()
		//console.log(collectionInstance)
	   var promise =  collectionInstance.fetch({
      

	    	data: {
	    		q: query,
	    	  'api-key': '108874c9523d4321bb52b17148adb15d'	 

	    	}
	    })

      promise.then(function(){ 
      	console.log(collectionInstance)
      	var html = ''
      	var docsArray = collectionInstance.models

      	for(var i = 0; i < docsArray.length; i ++) {
      		var docModel = docsArray[i]

      		html += '<h3>' + docModel.get('snippet') + '</h3>'
      	}

      	document.querySelector('.news').innerHTML = html

      })

	}

})


var instance = new TimesRouter()

Backbone.history.start()




