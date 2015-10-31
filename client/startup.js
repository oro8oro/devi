/*Tracker.autorun(function() {
  FlowRouter.watchPathChange()
  var route = FlowRouter.current()
  console.log(route)
  if(route && route.path) {
    if(Meteor.userId() && route.path === '/login')
      FlowRouter.go('/')
    console.log('checkckckc')
    if(!Meteor.userId() && route.path.indexOf('prev') === -1 && route.path !== '/notauth')
      FlowRouter.go('/notauth')
    console.log('bfdjfdfds')
  }
})*/