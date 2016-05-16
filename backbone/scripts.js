// Extend Backbone Model
var Blog = Backbone.Model.extend({
	defaults: {
		title: "title",
		author: "author",
		url: "url"
	}
});

// Instantiate sample models
var blog1 = new Blog({
	title: "blog1",
	author: "author1",
	url: "url1"
});

var blog2 = new Blog({
	title: "blog2",
	author: "author2",
	url: "url2"
});

// Extend Backbone collection
var Blogs = Backbone.Collection.extend({});

// Instantiate collection with sample models
var blogs = new Blogs([blog1, blog2]);

// Extend Backbone View
var BlogView = Backbone.View.extend({	
//	model: {},
	
	// Tag for the created el
	tagName: 'tr',
	
	// JQuery events, constructor wires them automatically by calling delegateEvents
	events: {
		"click .edit-blog": "edit",
		"click .update-blog": "update",
		"click .cancel-edit-blog": "cancelEdit",
		"click .delete-blog": "deleteBlog"
	},
	
	edit: function() {
		console.log('edit called');
		
		// this.$ scopes JQuery inside view element
		this.$('.edit-blog').hide();
		this.$('.delete-blog').hide();
		this.$('.update-blog').show();
		this.$('.cancel-edit-blog').show();
		
		var title = this.$('.title').html();
		var author = this.$('.author').html();
		var url = this.$('.url').html();
		
		this.$('.title').html('<input type="text" class="form-control title-update" value="' + title + '"></input>');
		this.$('.author').html('<input type="text" class="form-control author-update" value="' + author + '"></input>');
		this.$('.url').html('<input type="text" class="form-control url-update" value="' + url + '"></input>');
	},
	
	update: function() {
		this.model.set('title', this.$('.title-update').val());
		this.model.set('author', this.$('.author-update').val());
		this.model.set('url', this.$('.url-update').val());
	},
	
	cancelEdit: function() {
		this.render();
	},
	
	deleteBlog: function() {
		this.model.destroy();
	},

	// Template agnostic
	initialize: function() {	
		this.template = _.template($('.blogs-list-template').html());
	},

	// $el is cached JQuery object (convenient to access html)
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		
		// Good convention to enable chained calls
		return this;
	}
})

var BlogsView = Backbone.View.extend({

	model: blogs,
	
	// If el isn't specified, it's created from tagName, className, id and attributes. May be empty div
	el: $(".blogs-list"),

	initialize: function() {
		
		// Better way
		this.listenTo(this.model, 'add', this.render);
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'remove', this.render);

//		this.model.on('add', function() {
//			console.log('added to model');
//			self.render();
//		}, this);
	},

	render: function() {

		var self = this;
		this.$el.html('');

		_.each(this.model.toArray(), function(blog) {
			self.$el.append(new BlogView({model: blog}).render().$el);
		})
		return this;
	}
})

var blogsView = new BlogsView();

$(document).ready(function() {
	$('.add-blog').on('click', function() {
		var blog = new Blog({
			title: $('.title-input').val(),
			author: $('.author-input').val(),
			url: $('.url-input').val()
		});
		console.log(blog.toJSON());
		blogs.add(blog);
	});
})












