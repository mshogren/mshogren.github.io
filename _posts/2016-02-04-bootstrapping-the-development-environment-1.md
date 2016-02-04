---
layout: post
title: "Bootstrapping the development environment - part 1"
date: 2016-02-04
---

As I wrote this I discovered that this was going to be too much for one post so there will be a short series.  This is the first part.

One of the tenets of continuous delivery is to always automate, and that includes automating the creation of one of the first things anyone working on the ALSL project will need, a development environment.  There is an obvious bootstrapping problem here, in that to setup anything in an automated way I need a first environment from which to create others.  Ideally this initial environment can be ignored after the bootstrapping process is done.  In my case the initial environment is an HTPC I bought over 6 years ago that is running Debian Stretch.  I can remote to that computer over SSH from a couple of Android devices I have including a tablet with a bluetooth keyboard.  Alternatively I can plug a keyboard directly into that HTPC and use the TV as a monitor.  The point I am trying to make is that ALSL is not investing in new hardware right now.  

Instead we are going to use the cheapest cloud services we can find for any particular use case.  For example, to create a VM for a developer to use, we are going to use [Amazon Web Services](https://aws.amazon.com/) (AWS).  Later on we might make use of [Azure](https://azure.microsoft.com) and [Google Cloud Services](https://cloud.google.com/).  Each of these providers offer free trials, and possibly free ongoing usage for some things.  Each of them require creating an account through the browser, and setting up the users you wish to give access to.  For now if you are following along we just need an AWS account.  

Once we have that we need to follow a bunch of steps mentioned in the [AWS Identity and Access Management (IAM) user guide](http://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html).  There is a lot of meat in that documentation, but I have tried to follow the [best practices](http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html).  I removed any root access keys and created an admin group and user for myself that I will continue to use through the browser.  I also enabled multi-factor authentication for the root account, so if I want to change payment details I will need a second factor to authenticate.

For everything else I am going to do I would like to use the command line.  That will make it possible to script the steps and keep them in source control.  So before I do anything, I need to make sure I have a local environment with the following packages installed:

- ssh (to access any virtual machines I create)
- git (for access to my source code or in this case, provisioning scripts)
- curl (useful for getting my current IP address and other things)
- [awscli](https://aws.amazon.com/cli/) (for accessing AWS from a command line)

I followed the [instructions](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html) for getting setup with awscli including setting up my access keys on the local environment.  The commands I ran to configure the awscli were:

    aws configure --profile <profilename>
    export AWS_DEFAULT_PROFILE=<profilename>
    
where `<profilename>` is the name of my AWS IAM admin user.

In order to access any virtual machine I create in [AWS Elastic Compute Cloud (EC2)](https://aws.amazon.com/ec2/) I need to use certificate based authentication with ssh.  This [article](https://alestic.com/2010/10/ec2-ssh-keys/) by [Eric Hammond](https://twitter.com/esh) provided a script I can use to upload my personal ssh key to AWS.  More than that, it outlines why you should do that and how to upload the key to all regions so you can use the same key to access virtual machines in any AWS region.  The full script is in a new repo called [alsl-infrastructure]() in the [`aws/upload-ssh-keys.sh`](https://github.com/mshogren/alsl-infrastructure/blob/master/aws/upload-ssh-keys.sh) shell script.

I am almost ready to start a new instance of a virtual machine but there is one thing left to do.  Each EC2 VM instance must have a [security group](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html) that acts as a set of firewall rules controlling access to the virtual machine.  I am going to allow SSH access only from my IP address using the following script:

```bash
IP=$(curl http://checkip.amazonaws.com);

aws ec2 create-security-group --group-name alsl-ec2-dev-sg --description "Security group for developer instances"

aws ec2 describe-security-groups --group-names alsl-ec2-dev-sg --query SecurityGroups[0].IpPermissions > tmp.json

aws ec2 revoke-security-group-ingress --group-name alsl-ec2-dev-sg --ip-permissions file://tmp.json

rm tmp.json

aws ec2 authorize-security-group-ingress --group-name alsl-ec2-dev-sg --protocol tcp --port 22 --cidr $IP/32
```

I have made the script idempotent, that is running it over and over again has the same result.  It either creates or updates the security group with the name **alsl-ec2-dev-sg** by removing all the ingress rules and applying the one I want.  It temporarily stores the JSON of the existing rules in a file so it can be used in the next rule revoking command.

Finally I can add one more command to the script to actually launch a new instance

```bash
aws ec2 run-instances --image-id ami-9abea4fb --key-name $USER --security-groups alsl-ec2-dev-sg --instance-type t2.micro 
```
The full script is [aws/launch-devenv.sh](https://github.com/mshogren/alsl-infrastructure/blob/master/aws/launch-devenv.sh)

When I run it I can test that I can connect to it

    ssh ubuntu@<Instance IP Address>
    
Where `<Instance IP Address>` is the public IP address of the instance which can be found by running:

    aws ec2 describe-instances

This has got pretty long and I have a lot more to cover.  Next up I want to look at locking things down so I don't have to leave AWS Access Keys for my admin user lying around.  I also want to talk about having the EC2 instance that I launched configured with the software I need for the ALSL project.  Finally, if I have time I will try to come back to some of the options there are for creating and managing instances, that might help me save money over just instantiating a machine and leaving it running.