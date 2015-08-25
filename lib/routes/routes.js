FlowRouter.route('/', {
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