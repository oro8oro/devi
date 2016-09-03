Template.projects.onCreated(function() {
	this.subscribe('userProjects')
})

Template.projects.helpers({
	projects: function() {
		return D.p.Projects.find().fetch()
	}
})

Template.projects.events({
	'click #addProject': function(ev, instance) {
		Meteor.call('createProject', function(e, id) {
			if(e)
				console.log(e)
			if(id)
				Session.set('project', id)
		})
	}
})

Template.project.helpers({
	project: function() {
		return D.p.Projects.findOne(Session.get('project'))
	}
})