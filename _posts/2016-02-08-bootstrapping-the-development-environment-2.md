---
layout: post
title: "Bootstrapping the development environment - part 2"
date: 2016-02-08
---
 This is the second part in a series of posts about provisioning a development environment for the ALSL project.  The complete list of posts in the series are

- [Part 1 - Getting started with Amazon Web Services Elastic Compute Cloud](/2016/02/04/bootstrapping-the-development-environment-1.html)
- [Part 2 - Securing the development infrastructure](/2016/02/08/bootstrapping-the-development-environment-2.html)
- [Part 3 - Configuring the development environment](/2016/02/10/bootstrapping-the-development-environment-3.html)

In the [first post in this series](/2016/02/04/bootstrapping-the-development-environment-1.html) I outlined the first steps I took to create an AWS EC2 virtual machine instance and access it via ssh.

Next I want create another user and grant it the least privilege it needs in order to launch a new virtual machine from the command line.  This will enable me to ensure that the only access keys I have to keep my local machine will only be able to start a new VM.  This should prevent any issues with someone else using my machine to use other AWS services.  So once I am done this step should delete the access keys for my admin user from the IAM console.
    
The full script for creating this limited-access user is in the [alsl-infrastructure](https://github.com/mshogren/alsl-infrastructure) repo in the [`aws/setup-iam-roles.sh`](https://github.com/mshogren/alsl-infrastructure/blob/master/aws/setup-iam-roles.sh) shell script.  In the future I might write a versions of some of these scripts in PowerShell for Windows use.  This is what I started with:

``` bash
#!/bin/bash

region=$(aws configure get region);
userArn=$(aws iam get-user --query User.Arn);
baseArn=${userArn:1:26};
accountId=${userArn:14:12};

sed -e s/\<region\>/$region/g -e s/\<accountid\>/$accountId/g alsl-ec2-launch-policy.json > tmp.json

aws iam create-user --user-name alsl-ec2-launch
aws iam detach-user-policy --user-name alsl-ec2-launch --policy-arn ${baseArn}policy/alsl-ec2-launch
aws iam delete-policy --policy-arn ${baseArn}policy/alsl-ec2-launch
aws iam create-policy --policy-name alsl-ec2-launch --policy-document file://tmp.json
aws iam attach-user-policy --user-name alsl-ec2-launch --policy-arn ${baseArn}policy/alsl-ec2-launch

rm tmp.json
```

Its not very clever and could use another variable to make it easier to keep up to date.  The good thing about it (like the script for setting up the security group) is that it is idempotent.  I can run it over and over again and I keep getting the same user with the same policy attached to it.  I never delete the user because then I would have to regenerate access keys and reconfigure my local environment.

The IAM policy (see [`aws/alsl-ec2-launch-policy.json`](https://github.com/mshogren/alsl-infrastructure/blob/master/aws/alsl-ec2-launch-policy.json)) that is created and attached to the user by this script is just about as limited as I can make it.  The user can create only small or micro EC2 instances, and those instances may only use the security group I have defined and only do anything at all in one particular region.

Once that script is done once I need to setup the command line tools again for the restricted user and configure them for that new user's access keys:
    
    aws iam create-access-key --user-name alsl-ec2-launch
    aws configure
    
I may then delete the admin user's access keys in the IAM console which will prevent the admin user being used anywhere but from the console.

At this point I have a user that can use command line scripts to launch a new EC2 instance, but I am still missing a few things.  For example, the instances that are created should be configured using an [instance profile](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html) with an attached policy that allows the instance to be delegated permissions to other AWS resources.  I need to modify the script as shown below to create that new instance profile, and I also need to allow the restricted launch policy access to pass that role to an instance during launch.  

``` bash
aws iam create-role --role-name alsl-ec2-dev --assume-role-policy-document file://ec2-assume-role-policy.json
aws iam attach-role-policy --role-name alsl-ec2-dev --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess
aws iam create-instance-profile --instance-profile-name alsl-ec2-dev
aws iam add-role-to-instance-profile --instance-profile-name alsl-ec2-dev --role-name alsl-ec2-dev
```

For now I have no particular policy in mind that needs to be passed to the EC2 instance, so I will pass the predefined `AmazonEC2FullAccess` policy.  Here it is important to note that the EC2 instance will now have more access to EC2 instances than the launch policy initially gave.  This is the first step towards securing my AWS resources from the outside world by creating a [bastion host](https://en.wikipedia.org/wiki/Bastion_host) that can only be accessed from certain IP addresses and only by using my private SSH key, which in turn provides all other private access to any of my other resources.

Another task that I should complete is to write some automated tests for my custom policy using the [AWS IAM Policy Simulator](http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html)  Finally I might want to deal with the issue of having multiple users able to use ssh to access a server with their own private keys.  Currently I access the instances launched by logging in as a predefined account such as `ubuntu`, and that is the only user that is configured on the instance.  For a case where you need a machine with access for multiple users it might be cool to do the provisioning with [AWS Opsworks](https://aws.amazon.com/opsworks/) since that will [create all AWS OpsWorks users that have an SSH public key on each machine](http://docs.aws.amazon.com/opsworks/latest/userguide/security-ssh-access.html).  The downside is you get a machine with [Chef](https://www.chef.io) on it which I don't really want.  It may instead be possible to script something that creates new users based on a list of key pairs.  That kind of work scripting how the instance is configured once it starts up is the topic of the next post in this series.

