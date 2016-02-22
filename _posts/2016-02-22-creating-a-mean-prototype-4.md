---
layout: post
title: "Creating a MEAN prototype - part 3"
date: 2016-02-22
---
This is the fourth part in a series of posts about building a prototype for the ALSL project.  The complete list of posts in the series are

- [Part 1 - Introduction to MEAN prototypes](/2016/02/15/creating-a-mean-prototype-1.html)
- [Part 2 - Creating a prototype using yeoman](/2016/02/18/creating-a-mean-prototype-2.html)
- [Part 3 - Testing the prototype](/2016/02/19/creating-a-mean-prototype-3.html)
- [Part 4 - Building and deploying the prototype](/2016/02/22/creating-a-mean-prototype-4.html)

In the previous posts in this series I discussed the some of the reasons for building a prototype, and introduced the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)).
I covered what I found when I tried to follow [this guide](http://docs.stormpath.com/angularjs/guide/) to build a MEAN prototype that is integrated with the [StormPath](https://stormpath.com) user management service I have decided to use, but there were some tweaks I needed to make along the way, especially in order to get the tests working.

Once the tests were working I decided to build a cvontinuous deployment pipeline in Snap-CI which you can view [here](https://snap-ci.com/mshogren/alsl-sandbox1/branch/master).  The first stages run the `npm install` and `bower install` commands to get dependencies and then various grunt tasks to run tests and build (minify, etc) the project.

The last step runs `grunt buildcontrol` which uses configuration from the [Gruntfile.js](https://github.com/mshogren/alsl-sandbox1/blob/master/Gruntfile.js) to deploy the built project to a new **deploy** branch of my repo.  The configuration I used in my `Gruntfile.js` is:

``` javascript
buildcontrol: {
  options: {
    dir: 'dist',
    commit: true,
    push: true,
    connectCommits: false,
    message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
  },
  deploy: {
    options: {
      remote: process.env.SNAP_CI ? 'git@github.com:mshogren/alsl-sandbox1.git' : 'https://github.com/mshogren/alsl-sandbox1.git',
      branch: 'deploy'
    }
  }
},
```

You can find out more about this task [here](http://yeoman.io/learning/deployment.html).

At this time I decided I would make use of [Azure App Service free tier](https://azure.microsoft.com/en-us/pricing/details/app-service/) web app hosting for this prototype, and I realized I would also need to use <a href="https://mongolab.com" data-proofer-ignore>mongolab</a> database hosting.  Unfortunately I was unable to script provisioning a database, but I provisioned an instance in Azure's West US region and was given a URI to access this database.  The webapp built by yeoman will use this URI if I supply it to an environment variable called MONGOLAB_URI, which you can see by looking at the configuration of the webapp at [server/config/environment/production.js](https://github.com/mshogren/alsl-sandbox1/blob/master/server/config/environment/production.js).

I was also unable to figure out exactly how to configure my azure website from the command line.  Some of it, like creating an App Service Plan in the free tier and creating a website I could figure out.  I was also able to figure out how to set environment variables for the application.  On the other hand, I was unable to figure out how to specify the git branch to deploy from as you can when setting things up through the Azure Portal like <a href="https://azure.microsoft.com/en-us/documentation/articles/web-sites-publish-source-control/#Step7" data-proofer-ignore>this</a>.  I will have to do some more research into the Azure command line tools to see if I can achieve what I would like in the future.

I now have a prototype and a continuous deployment pipeline for it.  In the final part of this series I will return to using yeoman to build some more functionality for my prototype.  I may also start to look at splitting the deployment of the static front-end application from the server API application.
