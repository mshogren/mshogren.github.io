---
layout: post
title: "Creating a MEAN prototype - part 6"
date: 2016-03-08
---
This is the sixth part in a series of posts about building a prototype for the ALSL project.  The complete list of posts in the series are

- [Part 1 - Introduction to MEAN prototypes](/2016/02/15/creating-a-mean-prototype-1.html)
- [Part 2 - Creating a prototype using yeoman](/2016/02/18/creating-a-mean-prototype-2.html)
- [Part 3 - Testing the prototype](/2016/02/19/creating-a-mean-prototype-3.html)
- [Part 4 - Building and deploying the prototype](/2016/02/22/creating-a-mean-prototype-4.html)
- [Part 5 - Preparing to extend the prototype](/2016/02/25/creating-a-mean-prototype-5.html)
- [Part 6 - Extending the prototype](/2016/03/08/creating-a-mean-prototype-6.html)

In the previous posts in this series I discussed the some of the reasons for building a prototype, and introduced the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)).
I covered what I found when I tried to follow [this guide](http://docs.stormpath.com/angularjs/guide/) to build a MEAN prototype that is integrated with the [StormPath](https://stormpath.com) user management service I have decided to use, but there were some tweaks I needed to make along the way, especially in order to get the tests working.  Now I am ready to start extending the prototype to provide some useful functionality.
<!--excerpt.start-->
This post has been a while coming because I jumped down a couple of rabbit-holes while working on it.  I have concluded that client side stuff is not as bad as it was during the worst days of the [browser wars](https://en.wikipedia.org/wiki/Browser_wars), and I still like angularjs but creating polished rich web applications is still much more difficult than implementing server side business rules.  I will have some future posts about what I found down those rabbit-holes but first I wanted to finish this series.
<!--excerpt.end-->
The first step I took to extend the application was to create a new route (this creates a ui-router state with a url) using:

```
yo angular-fullstack:route thing
```

I also modified the server side thing API to require the Stormpath login for all operations but GET.  You can see that change [here](https://github.com/mshogren/alsl-sandbox1/commit/f50faf18a7136a2592e18f8a92af51664e9ef47b).

Next I spent some time thinking about a problem I had with the application design.  The `MainCtrl` controller was currently getting *things* from the API, where that now seemed to be more correctly the job of the `ThingCtrl` controller.  In addition, the view defined in the `main.html` template depends on *things* too.  I decided a better solution offered by the ui-router was to use a nested view.  Then I changed my mind and decided to use a named view.  I encourage you to read all about these concepts on the [ui-router wiki](https://github.com/angular-ui/ui-router/wiki).  There is a lot there to understand and I am afraid I haven't figured out a way to distill any of that into easily digestible tidbits for this blog yet.

As I was working on this I noticed a couple of things that were really starting to bother me.  One was that the new tests I wrote still had expectations that the ui-router view templates would be retrieved with a GET.  Things got much worse when I started transitioning states in the controller.  Now I had needed expectations on GETs for the templates for the new state, something the controller and its tests definitely shouldn't need to know anything about.  Finding this unacceptable I started some research into mocking the ui-router `$state`.  I found some great information by following the discussion on [this issue](https://github.com/angular-ui/ui-router/issues/212) in the ui-router Github project.  In the end I implemented a `$state` mock based on [this gist](https://gist.github.com/geraldofcneto/7d4690dc8c81b0f1fde0) and you can see that under [`client/components/stateMock/state.mock.js`](https://github.com/mshogren/alsl-sandbox1/blob/master/client/components/stateMock/state.mock.js).  With that I was able to remove my expectations on the view templates and mock out expectations for state transitions.  Very useful indeed.  I have not yet had a change to test setting expectations for state transitions where parameters are specified but I don't expect that to be a big deal.

The other thing that was bugging me was that I needed to specify the base url for any of my API requests, both in the code and the tests.  I read about interceptors in the [angularjs $http documentation](https://docs.angularjs.org/api/ng/service/$http) and decided to create my own API interceptor at [`client/components/apiInterceptor/apiInterceptor.js`](https://github.com/mshogren/alsl-sandbox1/blob/master/client/components/apiInterceptor/apiInterceptor.js).  The interceptor uses the base url I setup using grunt-ng-constant in my [last post](/2016/02/25/creating-a-mean-prototype-5.html).

``` javascript
angular.module('dashboardApp')
  .factory('apiInterceptor', function(ENV) {
    return {
      'request': function(config) {
        if(config.url[0] === '/') {
          config.url = ENV.apiEndpoint + config.url;
        }
        return config;
      }
    };
  });
```

Finally I got down to the business of modifying the views and controllers to allow creating, updating and deleting *things*.  I decided to modify the controllers to use the angularjs `$resource` service instead of the `$http` service.  I configured that by adding the following code to [client/app/thing/thing.js](https://github.com/mshogren/alsl-sandbox1/blob/master/client/app/thing/thing.js) so it is available to be injected into any controller that needs it:

``` javascript
.factory('Thing', function($resource) {
  return $resource('/api/things/:id',
                   { id: '@_id' },
                   {
                     update: {
                       method: 'PUT'
                     }
                   });
})
```

Take note that $resource uses $http so my interceptor still works.  I found [this guide](http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/) very useful while implementing the rest of the functionality.  I created a new view called [`thing-form.html`](https://github.com/mshogren/alsl-sandbox1/blob/master/client/app/thing/thing-form.html) for editing and updating *things*, and added methods to the controller to deal with the creates, updates and deletes.  After that I tidied up some of the unused boilerplate code introduced for the StormPath specific states.  

At this point I had everything working reasonably well.  However, I decided I wanted the new form to come up as a modal dialog, and that is when I got well and truly sidetracked.  I will have more to say about that in the future.  For now I think that is the end of my series about setting up a MEAN prototype with Stormpath.  In the future I may look into making the move to [Angular 2](https://angular.io/) since I don't want to invest to much in the old framework when it may be near the end of its life.  I also need to look more deeply into the testing frameworks and implement more tests and more functionality.  I am sure that the ALSL project will bring other needs beyond this prototype to the surface and I will deal with them when that happens.
