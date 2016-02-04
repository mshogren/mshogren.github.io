---
layout: post
title: "Bootstrapping the development environment - part 2"
date: 2016-02-05
draft: true
---
 

Next I want create another user and grant it the least privilege it needs in order to launch a new virtual machine from the command line.  This will enable me to ensure that the only access keys I have to download to my local machine will only be able to start a new VM.  Here I have another bootstrapping problem.  If I want to script the creation of this user, I am going to need to download the access keys for my admin user to my local machine and run the scripts.  After that I should delete the access keys from the IAM console.

    
Once that is done I can run a script to setup the other things I need.  The full script is in a new repo called [alsl-infrastructure]() in the [`aws/setup.sh`]() shell script.  In the future I might write a version of this in PowerShell for Windows use.  This is what I started with:

``` bash
#!/bin/bash

userArn=$(aws iam get-user --query User.Arn);
baseArn=${userArn:1:26};

aws iam create-user --user-name alsl-ec2-launch
aws iam detach-user-policy --user-name alsl-ec2-launch --policy-arn ${baseArn}policy/alsl-ec2-launch
aws iam delete-policy --policy-arn ${baseArn}policy/alsl-ec2-launch
aws iam create-policy --policy-name alsl-ec2-launch --policy-document file://alsl-ec2-launch-policy.json
aws iam attach-user-policy --user-name alsl-ec2-launch --policy-arn ${baseArn}policy/alsl-ec2-launch
```

Its not very clever and could use another variable to make it easier to keep up to date.  The good thing about it is that it is idempotent.  I can run it over and over again and I keep getting the same user with the same policy attached to it.  I never delete the user because then I would have to regenerate access keys and reconfigure my local environment.

The policy:


Once that is done once I need to setup the command line tools again:
    
    aws iam create-access-key --user-name alsl-ec2-launch
    aws configure

start with iam dashboard
import ssh keys for ec2
make them available in all regions (useful for spot instances)
setup iam stuff including instance role so aws instance can access other aws resources
instance security policy

    ssh ubuntu@ec2-52-24-101-245-us-west2.compute.amazonaws.com
    sudo apt-get install awscli git
    aws configure 
(to set the region)

    curl http://169.254.169.254/latest/meta-data/placement/availability-zone
    curl http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2_instance_role
    ubuntu@ip-172-31-36-178:~/.aws$ more config
    [default]
    region = us-west-2

Create the CloudWatch alarm to terminate an idle machine.

For a case where you need a machine with multiple users it might be cool to do the provisioning with AWS Opsworks since that will copy all AWS OpsWorks users that have an SSH public key to each machine.  The downside is you get a machine with chef on it which I don't need.

Alpha script should (requires awscli and access key (create user with least privileges)
    *create or update instance security policy*
    create or update roles and instance roles

User script should 
    install git, ansible
    clone repo with bootstrapping script
    run bootstrapping script
    
That bootstrapping script should
    install awscli
    configure awscli
    create cloudwatch alarm for idle termination
    send notification to ??? that the machine is ready
    