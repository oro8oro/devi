Meteor.publish('publicDocuments', function() {
	return D.p.Documents.find({})
});

Meteor.publish('userDocuments', function() {
	return D.p.Documents.find({userId: this.userId})
});

Meteor.publishComposite('userProjects', {
	find: function() {
		return D.p.RoleMap.find({userId: this.userId})
	},
	children: [
		{
			find: function(map) {
				return D.p.Projects.find({_id: map.projectId})
			}
		}
	]
})