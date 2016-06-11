---
layout: post
title: "Creating a MEAN prototype - part 2"
date: 2016-02-18
---
This is the second part in a series of posts about building a prototype for the ALSL project.  The complete list of posts in the series are

- [Part 1 - Introduction to MEAN prototypes](/2016/02/15/creating-a-mean-prototype-1.html)
- [Part 2 - Creating a prototype using yeoman](/2016/02/18/creating-a-mean-prototype-2.html)
- [Part 3 - Testing the prototype](/2016/02/19/creating-a-mean-prototype-3.html)
- [Part 4 - Building and deploying the prototype](/2016/02/22/creating-a-mean-prototype-4.html)
- [Part 5 - Preparing to extend the prototype](/2016/02/25/creating-a-mean-prototype-5.html)
- [Part 6 - Extending the prototype](/2016/03/08/creating-a-mean-prototype-6.html)

In the [first post in this series](/2016/02/15/creating-a-mean-prototype-1.html) discussed the some of the reasons for building a prototype, and introduced the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)).
Next I am going to talk about what I found when I tried to follow [this guide](http://docs.stormpath.com/angularjs/guide/) to build a MEAN prototype that is integrated with the StormPath user management service I have decided to use. The guide uses [yeoman](http://yeoman.io) and in particular the [angular-fullstack-generator](https://github.com/angular-fullstack/generator-angular-fullstack), to quickly create a working app by generating a lot of boilerplate code.

The guide starts of with installing some packages using the nodejs package manager (npm).  I decided to achieve the same thing with Ansible (see [this post](/2016/02/10/bootstrapping-the-development-environment-3.html) for some information on how I set Ansible up for my development environment).  After running through the guide once and running into problems, I came back to this initial package installation for the fix.  Since the guide was written, work has continued on the [angular-fullstack-generator](https://github.com/angular-fullstack/generator-angular-fullstack) and it has moved from version 2.0.x through 2.1 to 3.x.  At the time I wrote this there were some [issues](https://github.com/angular-fullstack/generator-angular-fullstack/issues/1015) logged with the generator project which happened to affect the steps in the Stormpath guide.  In short the generator now generates a Typescript app instead of a vanilla JavaScript app, but the sub-generators still generate vanilla JavaScript.  I tried a couple of things but decided it was easiest to just make sure I was using a pre-3.0 version of the angular-fullstack-generator.  Again I set that up in Ansible but the command line you can use to install the prerequisites for the guide is below.

```
npm install yo grunt-cli bower angular-fullstack-generator@2.1.1 --global
```

This installs the following command line tools and the generator:

- yo (The yeoman command line tool)
- [grunt](http://gruntjs.com/) (A JavaScript build tool)
- [bower](https://bower.io/) (A client side asset management tool)

As I moved through the guide there were a couple of other deviations I made from the prescribed steps.  For example, in the initial app scaffolding step with yeoman I configured it to use [mongoose](http://mongoosejs.com/) for [MongoDb](https://www.mongodb.com/) database access and to include the [Angular UI Bootstrap](https://angular-ui.github.io/bootstrap/) components so I could give the prototype the same look and feel as my blog if I wanted to.  The database components required a MongoDb installation so I created an Ansible role to mimic the install instructions I found [here](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/).  Once I was finished the guide I had everything checked into a new repo at https://github.com/mshogren/alsl-sandbox1.  Note the suffix to denote that this may the first of several prototypes.

One of the highlights of using yeoman is that it builds a [`Gruntfile.js`](https://github.com/mshogren/alsl-sandbox1/blob/master/Gruntfile.js) for grunt to use to perform various tasks.  The guide asks us to use `grunt serve` but I also want to make sure that `grunt build` and `grunt test` do what I expect. In fact I found that the build step failed in attempting to minify the image files until I ran this command to update one of the project dependencies.

```
npm install grunt-contrib-imagemin@latest --save-dev
```
Note the `--save-dev` here ensures that [`package.json`](https://github.com/mshogren/alsl-sandbox1/blob/master/package.json) is updated too.

I also had some problems with `grunt test` but they turned out to be significant enough that I should deal with them in a separate post.
