---
layout: post
title: "Creating a MEAN prototype - part 3"
date: 2016-02-19
---
This is the third part in a series of posts about building a prototype for the ALSL project.  The complete list of posts in the series are

- [Part 1 - Introduction to MEAN prototypes](/2016/02/15/creating-a-mean-prototype-1.html)
- [Part 2 - Creating a prototype using yeoman](/2016/02/18/creating-a-mean-prototype-2.html)
- [Part 3 - Testing the prototype](/2016/02/19/creating-a-mean-prototype-3.html)
- [Part 4 - Building and deploying the prototype](/2016/02/22/creating-a-mean-prototype-4.html)
- [Part 5 - Preparing to extend the prototype](/2016/02/25/creating-a-mean-prototype-5.html)

In the [first post in this series](/2016/02/15/creating-a-mean-prototype-1.html) discussed the some of the reasons for building a prototype, and introduced the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)).
Then in the [second post](/2016/02/18/creating-a-mean-prototype-2.html) I covered what I found when I tried to follow [this guide](http://docs.stormpath.com/angularjs/guide/) to build a MEAN prototype that is integrated with the StormPath user management service I have decided to use. The guide uses [yeoman](http://yeoman.io) and in particular the [angular-fullstack-generator](https://github.com/angular-fullstack/generator-angular-fullstack), to quickly create a working app by generating a lot of boilerplate code.

By the end of that post I had managed to get the `grunt build` task to successfully run and was ready to try the `grunt test` task.  I ran problems with `grunt test` so I started trying to run `grunt test:server` and `grunt test:client` separately to help me solve the problems.

I figured the server side test in [`thing.spec.js`](https://github.com/mshogren/alsl-sandbox1/blob/master/server/api/thing/thing.spec.js) needed to be changed to wait for the StormPath initialization to finish before testing so I tried adding:

``` javascript
before(function(done) {
  this.timeout(10000);

  app.on('stormpath.ready', function() {
    done();
  });
});
```

Then I realized that the tests was failing because of authentication issues.  From this [article](http://jaketrent.com/post/authenticated-supertest-tests/) by Jake Trent I found a solution and created a login helper just as in the article and modified the test to call it as follows.

``` javascript
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest')(app);
var login = require('../login.spec');

describe('GET /api/things', function() {

  var agent;

  before(function(done) {
    this.timeout(10000);

    app.on('stormpath.ready', function() {
      login.login(request, function (loginAgent) {
        agent = loginAgent;
        done();
      });
    });
  });


  it('should respond with JSON array', function(done) {
    var req = request.get('/api/things');

    agent.attachCookies(req);

    req
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
```

For the client-side testing I needed a couple more packages as shown below

```
npm install grunt-node-inspector@latest --save-dev
npm install karma-phantomjs-launcher@latest --save-dev
npm install phantomjs-prebuilt@latest --save-dev
```
and I needed to update my [`karma.conf.js`](https://github.com/mshogren/alsl-sandbox1/blob/master/karma.conf.js) to load the StormPath client side script libraries for the tests by adding these two lines

``` javascript
'client/bower_components/stormpath-sdk-angularjs/dist/stormpath-sdk-angularjs.js',
'client/bower_components/stormpath-sdk-angularjs/dist/stormpath-sdk-angularjs.tpls.js',
```
Once that was done there was one still one failing client side test which I fixed by modifying it to meet the expectation that it would GET the `/me` url to check if the user is logged in before making its main request to `/api/things`.  The test is in [`main.controller.spec.js`](https://github.com/mshogren/alsl-sandbox1/blob/master/client/app/main/main.controller.spec.js).  I also had to add an expectation that the html template would be retrieved with a GET too.  I will look into whether or not that is necessary.

Finally I attempted to run the end-to-end ui tests in the browser using `grunt test:e2e`, but I needed to get some dependencies installed first.  To start I had to modify the `scripts` section of my [`package.json`](https://github.com/mshogren/alsl-sandbox1/blob/master/package.json) as follows.

``` json
"update-webdriver": "node node_modules/protractor/bin/webdriver-manager update"
```

Then I could run
```
npm run update-webdriver
```

I also need to to install Google Chrome and the xvfb package in order to run a browser on a headless server. Then finally the following commands ran the e2e tests successfully.

``` bash
Xvfb :0 -ac -screen 0 1024x768x24 &
export DISPLAY=:0.0
grunt test:e2e
```
I need to turn these installation steps into more Ansible roles in my [alsl-infrastructure](https://github.com/mshogren/alsl-infrastructure) repo.

Now that I have most of the grunt steps working locally in my next post I will discuss creating a continuous deployment pipeline for this app.  In the future I may also want to discuss moving the front-end angularjs code and the back-end express code to separate repos, since they are maintained and should be deployed independently.  The issue with doing that is mostly in configuring the two separate applications to communicate, but also in making sure I can separate what in the `Gruntfile.js` is necessary for building each component.
