D.p.UserDocs = new Mongo.Collection("userdocs");

_Schemas.userDocsSchema = new SimpleSchema({
  userId: {
  	type: String
  },
  documentId: {
    type: String
  },
  type: {
    type: String
  }
});

D.p.UserDocs.attachSchema(_Schemas.userDocsSchema);
