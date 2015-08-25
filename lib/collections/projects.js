D.p.Projects = new Mongo.Collection("projects");

_Schemas.projectsSchema = new SimpleSchema({
  name: {
    type: String
  },
  parentId: {
  	type: String,
  	optional: true
  },
  creatorId: {
    type: String
  },
  leaderId: {
    type: String,
    optional: true
  }
});

D.p.Projects.attachSchema(_Schemas.projectsSchema);
