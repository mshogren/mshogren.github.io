---
layout: post
title: "Continuous integration and testing"
date: 2016-01-28
---
I wasn't going to blog much about the blog (too meta!) but I couldn't pass up the opportunity to get started on something very important to the ALSL project - [Continuous Integration (CI)](https://en.wikipedia.org/wiki/Continuous_integration).  In fact what the ALSL project is going to strive for is [Continuous Delivery (CD)](https://en.wikipedia.org/wiki/Continuous_delivery), but I don't know if we are [ready](https://www.go.cd/2016/01/25/are-you-ready-for-continuous-delivery.html) yet.  This blog needs to be tested for broken links, properly formed HTML, etc before it is published, and I am going to use a CI tool to do that, since the deployment or publishing is done automatically by [Github Pages](https://pages.github.com/) whenever I commit to the master branch.

I am not going to get into too much detail on CI or CD as the linked articles do a good job but I will reiterate two things:

1.  I want to put _everything_ in source control
2.  I want to automate relentlessly.

A future post will be on provisioning a development environment for me to use and is going to get into both these points at great length, because I want even my environment to be easily setup in a repeatable and robust way, since in my experience I will have to do it more than once.

There are a vast list of CI tools out there and I have looked at quite a lot but the ones I have a little more to say on are these

-  [Snap CI](https://snap-ci.com)
-  [Travis](https://travis-ci.org)
-  [Appveyor](https://www.appveyor.com)
-  [TeamCity](https://www.jetbrains.com/teamcity/)
-  [Visual Studio Team Services (VSTS)](https://www.visualstudio.com/products/visual-studio-team-services-vs)

My first requirement is a cheap hosted solution, and each of these is capable of that.  However the hosted TeamCity platform at CodeBetter is a little limited, which is a shame, since I have extensive experience with TeamCity already, and like it very much.  Appveyor and VSTS are focused on Windows, which may be helpful since ALSL might leverage .NET in the future.  For now however, I would prefer the flexibility of a linux based CI tool.  After all I should still be able to build [Mono](http://www.mono-project.com) or [.NET Core](https://dotnet.github.io) projects using Snap-CI or Travis, and one of the big advantages they have is that they use [containers](https://en.wikipedia.org/wiki/Operating-system-level_virtualization) for the builds, and these containers are very configurable.

Travis is very popular and there are a couple of things I like about it.  The most important thing is that your build definition is stored in source control as a `.travis.yml` file.  This agrees with the first goal I have above on my journey towards CD.  Another thing I like about it is the fact that it covers the most programming languages of any of the CI tools I have seen, and the documentation for customizing the build environment is excellent.  The containers Travis uses for builds are built using [Ubuntu](http://www.ubuntu.com), a [Debian](https://www.debian.org) derived distribution I am very familiar with.

There is one thing missing from Travis that a really like about Snap-CI which is why I am going to try working with Snap-CI for now.  That is The focus on build pipelines.  The pipeline is defined by [Jez Humble](http://jezhumble.net) in his book [Continuous Delivery](https://www.amazon.com/Continuous-Delivery-Deployment-Automation-Addison-Wesley-dp-0321601912/dp/0321601912) as:

> At an abstract level, a deployment pipeline is an automated manifestation of your process for getting software from version control into the hands of your users.

At the place I work, we have built a pipeline in TeamCity with a tree of 57 build and deployment stages that compiles, tests, deploys to an integration environment, test again and packages artifacts for our project.  It is a good start, but it doesn't even deploy anything to an acceptance or production environment yet.  My decision about which CI tool to use comes down to the fact that it looks much easier to do something like that in Snap-CI than in Travis.  One the other hand, build commands are stored on the Snap-CI server and I am not sure if they are versioned and kept for ever.  Also, Snap-CI uses one of the RedHat based distros for containers, so I might have to learn a bit more about [yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified) in order to configure my build environments.

For now I have decided to try out Snap-CI, but I am not opposed to the idea of trying out other tools as the need arises.  ALSL might eventually need builds done on Windows, for example.  I will have a post up later about how I get on with setting up Snap-CI to run tests on this blog.
