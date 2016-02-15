---
layout: post
title: "Creating a MEAN prototype - part 1"
date: 2016-02-15
---

Once I had finished figuring out how I would provision environments using Ansible and build and test software using Snap-CI as I have over my last few posts, I thought the next step I would take would be to do a small part of the work that needs to be done for the ALSL project - that is design an API.  This seemed like a reasonable first step since the API defines the interface between our users and the system.  I was all ready to get into talking about [Domain Driven Design](), and I had started looking at ways to define the API in a technology agnostic language such as [RAML]() when I started talking to a friend about a project he wanted to do.  He mentioned the [MEAN stack]() as a possible way to quickly create working software, which is a great way to validate any API design.  I got to thinking and reading articles like [this one](https://addyosmani.com/blog/full-stack-javascript-with-mean-and-yeoman/) by Addy Osmani, and decided that building a quick prototype using [mean.io] or [yeoman] sounded like a great idea.  

Coincidentally, around the same time I started looking at User Management as a Service.  I looked at a few solutions and settled on a decision to try [Stormpath]().  At that stage I was still considering building my API with [ASP.NET Web API](), but I realized that Stormpath had [really good documentation](http://docs.stormpath.com/angularjs/guide/) about using yeoman to build a prototype application that is integrated with their user management service.

I decided to follow that path for a while and see where that takes me.  I feel better about yeoman that using mean.io or loopback.io, because I want to use the least opinionated framework for building software that I can, but I guess I am not opposed to revisiting that decision.  I think I should break up the prototype fairly quickly into components that can be worked on separately, and also look at the cheapest solutions I can find for database services.  But I also want to get on with building an API and testing some working software, and prototyping something seems like a good way to keep moving forward.

I have already realized that this is likely to be another series of posts rather than a single one so I might even just finish this post without getting into any technical details.

- user management as a service (other solutions)
- http://docs.stormpath.com/angularjs/guide/
- npm packages including specific version of  generator-angular-fullstack because of issue
- included mongoose and bootstrap-ui
- new repo (needs README)
- update optipng-bin
- buildcontrol
- mongolabs
- azure-cli
- environment variables
- http://alsl-sandbox1.azurewebsites.net/

- can I deploy a version without uglifying everything?
- does it work on mobile browser?
