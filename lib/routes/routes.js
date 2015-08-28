FlowRouter.route('/:id?', {
  name: 'home',
  action: function() {
    BlazeLayout.render('ApplicationLayout', {main: 'main'});
  }
});

FlowRouter.route('/projects', {
  name: 'projects',
  action: function() {
    BlazeLayout.render('ApplicationLayout', {main: 'projects'});
  }
});

FlowRouter.route('/prev/:id', {
  name: 'prev',
  action: function(params) {
  	Session.set("document", params.id);
    BlazeLayout.render('ApplicationLayout', {main: 'preview'});
  }
});

FlowRouter.route('/raw/:id', {
  name: 'home',
  action: function() {
    BlazeLayout.render('ApplicationLayout', {main: 'raw'});
  }
});