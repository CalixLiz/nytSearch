//VIEWS

var setHomePage = function() {
	var containerNode = document.querySelector('.container')
	var html = ''

	    containerNode.innerHTML = html
	}

var DetailView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.model, 'sync', this._render)
	},

	_render: function() {
		var containerNode = document.querySelector('.container')
		var html = ''

		if(this.model.get('multimedia').length) {
			html += '<img src="http://www.nytimes.com/' + this.model.get('multimedia')[0].url + '">'
		}


		html += '<div>' 
		html += '<h3>' + this.model.get('headline').main + '</h3>'
		html += '<h6>' + this.model.get('snippet') + '</h6>'
		html += '<p> Section: ' + this.model.get('section_name') + '</p>'
		html += '</div>'
		 

		containerNode.innerHTML = html
	}

})


var ListView = Backbone.View.extend({
	initialize: function() {

	document.querySelector('.container').innerHTML = '<img src="balls.gif">'

		//listenTo takes 3 inputs:
		//-1- the object that we're listening to (this.collection)
		//-2- the name of the event that the object will be broadcast (sync)
		//-3- the function that was should run upon "hearing" that event  this._render
		// (`this` is a reference to a view instance)
		this.listenTo(this.collection, 'sync', this._render)

	},

	_render: function() {
		var containerNode = document.querySelector('.container')
		var html = ''
		var articlesArray = this.collection.models
		

		//for loop 
		// for(var i = 0; i < articlesArray.length; i ++) {
		// 	var model = articlesArray[i]
		// 	html += '<div class="summary">' 
		// 	html += '<h5>' + model.get('snippet') + '</h5>'
		// 	html += '</div>'

		//fancy mode no For loop 

			this.collection.forEach(function(inputModel){
	
			html +=   '<a href="#detail/' + inputModel.get('_id') +  '">'	
			html +=   '<div class="summary">' 
			html +=      '<p>' + inputModel.get('snippet') + '</p>'
			//.get accesses the attributes of model 
			html +=    '</div>'
			html += '</a>'

			})
		
		containerNode.innerHTML = html 

	}
})
 

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



//MODELS 
//is an object that contains array of models 
var TimesCollection = Backbone.Collection.extend({
	url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
	//parse takes the API response and return the array that we want 
	parse: function(apiResponse){
		console.log(apiResponse.response.docs)
		return apiResponse.response.docs
	}
})

var TimesModel = Backbone.Model.extend({
	url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
	parse: function(apiResponse) {
		return apiResponse.response.docs[0]

	}
})



//CONTROLLER
var TimesRouter = Backbone.Router.extend({

	//define rout

	routes: {
		"home": "showHomePage",
		"search/:search": "searchPage",
		"detail/:id" : "ShowDetailPage"
	},
		showHomePage: function() {
			setHomePage()
		},
		searchPage: function(query) {
		   var collectionInstance =  new TimesCollection()
		   var promise =  collectionInstance.fetch({ 

	    	data: {
	    		q: query,
	    	  'api-key': '108874c9523d4321bb52b17148adb15d'	 
	    	}
	    })
 

	   var viewInstance = new ListView({
	   	collection: collectionInstance
	   }) 
	},

	    ShowDetailPage: function(articleId) {
	    	var modelInstance = new TimesModel() //new instance of model
	    	    modelInstance.fetch({
	    		data: {

	    			'api-key': '108874c9523d4321bb52b17148adb15d',
	    			//fq stands for filter query 'this is in api NYT document'
	    			'fq': '_id:' + articleId

	    		}
	    	})

	    	    var viewInstance = new DetailView({
		    	model: modelInstance
	    	    
	    	    })
	    }
})


var instance = new TimesRouter()

Backbone.history.start()




