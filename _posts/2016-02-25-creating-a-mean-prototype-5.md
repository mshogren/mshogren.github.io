---
layout: post
title: "Creating a MEAN prototype - part 5"
date: 2016-02-25
---
This is the fifth part in a series of posts about building a prototype for the ALSL project.  The complete list of posts in the series are

- [Part 1 - Introduction to MEAN prototypes](/2016/02/15/creating-a-mean-prototype-1.html)
- [Part 2 - Creating a prototype using yeoman](/2016/02/18/creating-a-mean-prototype-2.html)
- [Part 3 - Testing the prototype](/2016/02/19/creating-a-mean-prototype-3.html)
- [Part 4 - Building and deploying the prototype](/2016/02/22/creating-a-mean-prototype-4.html)
- [Part 5 - Preparing to extend the prototype](/2016/02/25/creating-a-mean-prototype-5.html)
- [Part 6 - Extending the prototype](/2016/02/28/creating-a-mean-prototype-6.html)

In the previous posts in this series I discussed the some of the reasons for building a prototype, and introduced the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)).
I covered what I found when I tried to follow [this guide](http://docs.stormpath.com/angularjs/guide/) to build a MEAN prototype that is integrated with the [StormPath](https://stormpath.com) user management service I have decided to use, but there were some tweaks I needed to make along the way, especially in order to get the tests working.  In the [most recent post](/2016/02/22/creating-a-mean-prototype-4.html) I built a deployment pipeline for the prototype.

I thought this would be the final post in the series, where I finally got around to adding at least another form to the application.  As I was thinking about what need to be done I discovered that there was too much little stuff to be resolved, including the [technical debt](http://martinfowler.com/bliki/TechnicalDebt.html) incurred by using a yeoman generator.  I managed to clean up a lot of things working on this post which should make delivering new features to the deployed prototype faster in the future.

The first thing I did was configure social login from Facebook or Google using [this](https://docs.stormpath.com/nodejs/express/latest/social_login.html) as a guide.  Things worked relatively well, but I discovered a minor issue with the default [login page html template](https://github.com/stormpath/stormpath-sdk-angularjs/blob/master/src/spLoginForm.tpl.html) from the [Stormpath Angular JS SDK](http://docs.stormpath.com/angularjs/sdk/#/api), so I created and called my own modified template.  You can have a look at what I did in these two commits:

- [Fixing social login html template](https://github.com/mshogren/alsl-sandbox1/commit/6c41a57cc72709c0f44881e2d2e0cf58ed48bdc8)
- [Fix OAuth Scope requested for social login](https://github.com/mshogren/alsl-sandbox1/commit/f59c4b27ae075c232b52d728cf0c97c3d06f76f4)

I am considering submitting a pull request to the Stormpath team to get this fixed.  While I was doing these changes I decided it would be easier to switch off the Grunt steps that minify the JavaScript and CSS, so I can use debugging tools even on the deployed application.  I did that by simply commenting out some lines in the [`Gruntfile.js`](https://github.com/mshogren/alsl-sandbox1/blob/master/Gruntfile.js).

Next I modified the registration process to accept a username field.  In my opinion it is a shame that the `sp-registration-form` directive doesn't product a form that displays the fields based on the configuration.  I guess that is another potential pull request I could submit. Anyway, the change I made was done in these two commits:

- [Add username to registration](https://github.com/mshogren/alsl-sandbox1/commit/b2bc55871c02ff688c5b9ad331a90725d3bb4b79)
- [Add username to registration form](https://github.com/mshogren/alsl-sandbox1/commit/2cc8cdc82d5129e5ef60bff219d82a340868a94f)

One of the tasks I had set myself previously was to set things up so that the front-end web application could be deployed separately from the back-end API application.  I wanted to do this because serving these two things may scale differently, and because I want to remove any temptation to share any code or tools between the two applications as that would couple them too tightly.  Because the front-end calls the back-end using client side JavaScript, deploying the applications separately requires configuring [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) correctly.  To get this working server side I added the following to my [`server/app.js`](https://github.com/mshogren/alsl-sandbox1/blob/master/server/app.js).

``` javascript
var cors = require('cors');

var whiteList = JSON.parse(process.env.CORS_ORIGIN_WHITELIST || "[]");

app.use(cors({
  origin: function(origin, callback){
    var originIsWhitelisted = whiteList.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
}));
```

The client side change were a bit more complicated but [this change](https://github.com/mshogren/alsl-sandbox1/commit/03447b9f8535716a1eebe994032bf7c46394f2c4) introduces the [grunt-ng-constant](https://www.npmjs.com/package/grunt-ng-constant) package and uses it to build environment specific configuration files.  Once that was done I also added another `grunt buildcontrol` target and added that to my deployment pipeline, so the front-end static web pages are now hosted in Github Pages [here](http://alsl-sandbox1.michael-shogren.com).

I feel almost ready to extend the prototype now but a couple of niggling things still needed to be taken care of.  First I installed [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) and ran it to make sure all my npm and bower packages are at the latest version.  Finally, I moved away from using Trello to organize my tasks and decided to use Github Issues supplemented by [waffle.io](https://waffle.io/) instead.  My new task board is [here](https://waffle.io/mshogren/mshogren.github.io).

Next time I am definitely ready to add a new form to the prototype.
