D.p.RoleMap = new Mongo.Collection("roleMap");

_Schemas.roleMapSchema = new SimpleSchema({
  userId: {
  	type: String
  },
  username: {
  	type: String
  },
  projectId: {
    type: String
  },
  type: {
    type: String
  }
});

D.p.RoleMap.attachSchema(_Schemas.roleMapSchema);
