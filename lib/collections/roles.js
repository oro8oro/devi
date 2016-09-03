D.p.Roles = new Mongo.Collection("roles");

_Schemas.rolesSchema = new SimpleSchema({
  type: {
    type: String
  }
});

D.p.Roles.attachSchema(_Schemas.roles);
