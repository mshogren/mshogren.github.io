---
layout: post
title: "Creating a MEAN prototype - part 1"
date: 2016-02-15
---
This is the first part in a series of posts about building a prototype for the ALSL project.  The complete list of posts in the series are

- [Part 1 - Introduction to MEAN prototypes](/2016/02/15/creating-a-mean-prototype-1.html)
- [Part 2 - Creating a prototype using yeoman](/2016/02/18/creating-a-mean-prototype-2.html)
- [Part 3 - Testing the prototype](/2016/02/19/creating-a-mean-prototype-3.html)
- [Part 4 - Building and deploying the prototype](/2016/02/22/creating-a-mean-prototype-4.html)
- [Part 5 - Preparing to extend the prototype](/2016/02/25/creating-a-mean-prototype-5.html)
- [Part 6 - Extending the prototype](/2016/03/08/creating-a-mean-prototype-6.html)

<!--excerpt.start-->
Once I had finished figuring out how I would provision environments using Ansible and build and test software using Snap-CI as I have over my last few posts, I thought the next step I would take would be to do a small part of the work that needs to be done for the ALSL project - that is design an API.  This seemed like a reasonable first step since the API defines the interface between our users and the system.  I was all ready to get into talking about [Domain Driven Design](http://domainlanguage.com/ddd/), and I had started looking at ways to define the API in a technology agnostic language such as [RAML](http://raml.org/) when I started talking to a friend about a project he wanted to do. <!--excerpt.end--> He mentioned the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)) as a possible way to quickly create working software, which is a great way to validate any API design.  I got to thinking and reading articles like <a href="https://addyosmani.com/blog/full-stack-javascript-with-mean-and-yeoman/" data-proofer-ignore>this one</a> by Addy Osmani, and decided that building a quick prototype using [mean.io](http://mean.io) or [yeoman](http://yeoman.io) sounded like a great idea.  

Coincidentally, around the same time I started looking at Directory as a Service (DaaS) and Identity as a Service (IdaaS).  I looked at a few solutions and settled on a decision to try [Stormpath](https://stormpath.com) first and maybe later come back to look at [Jumpcloud](https://jumpcloud.com) or [OneLogin](https://www.onelogin.com).  At that stage I was still considering building my API with [ASP.NET Web API](http://www.asp.net/web-api), but I realized that Stormpath had really good documentation about using yeoman to build a prototype application that is integrated with their user management service.

I decided to follow that path for a while and see where that takes me.  I feel better about [yeoman](http://yeoman.io) that using [mean.io](http://mean.io) or [loopback.io](http://loopback.io/), because I want to use the least [opinionated](http://stackoverflow.com/questions/802050/what-is-opinionated-software) [frameworks and libraries](http://stackoverflow.com/questions/148747/what-is-the-difference-between-a-framework-and-a-library) for building software (possibly [opinionated software](http://gettingreal.37signals.com/ch04_Make_Opinionated_Software.php)) that I can, but I guess I am not opposed to revisiting that decision.  I think I should break up the prototype fairly quickly into components that can be worked on separately, and make sure each component is sufficiently isolated from each other one and each library and framework to allow easy maintenance and changes.  I also want to look at the cheapest solutions I can find for database services.  But I also want to get on with building an API and testing some working software, and prototyping something seems like a good way to keep moving forward.

I have already realized that this is likely to be another series of posts rather than a single one so I might even just finish this post without getting into any technical details.
