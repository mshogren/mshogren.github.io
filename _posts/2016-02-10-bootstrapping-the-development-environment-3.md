---
layout: post
title: "Bootstrapping the development environment - part 3"
date: 2016-02-10
---
 This is the third part in a series of posts about provisioning a development environment for the ALSL project.  The complete list of posts in the series are

- [Part 1 - Getting started with Amazon Web Services Elastic Compute Cloud](/2016/02/04/bootstrapping-the-development-environment-1.html)
- [Part 2 - Securing the development infrastructure](/2016/02/08/bootstrapping-the-development-environment-2.html)
- [Part 3 - Configuring the development environment](/2016/02/10/bootstrapping-the-development-environment-3.html)

In the [first post in this series](/2016/02/04/bootstrapping-the-development-environment-1.html) I outlined the first steps I took to create an AWS EC2 virtual machine instance and access it via ssh.  In the [second post](/2016/02/08/bootstrapping-the-development-environment-2.html) I outlined some steps taken to ensure the AWS environment I create is secure.
<!--excerpt.start-->
Now that I have a virtual machine I can access via SSH I need to make sure it has the software I intend to use.  This software needs to be installed in a repeatable manner so I can create and destroy the virtual machine fairly regularly if I need to.  I have decided to make use of [Ansible](http://www.ansible.com) for automating infrastructure configuration.  I briefly considered [Chef](https://www.chef.io), [Puppet](https://puppetlabs.com) and [Salt](http://saltstack.com) but decided to go with Ansible because it does not require installing any agent software on the infrastructure targets.  On the other hand I hear that Ansible may be slow for use with more machines in a large scale infrastructure so I may revisit Salt in the future.
<!--excerpt.end-->
I need at least Ansible installed on my virtual machine instance and then I should be able to use it to do the rest of the setup and configuration.  This should apply equally well to any infrastructure, wherever it is hosted.  To make sure Ansible is installed when my instance is launched I will need to modify the [`aws/launch-devenv.sh`](https://github.com/mshogren/alsl-infrastructure/blob/master/aws/launch-devenv.sh) script to use [user data](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html) to install Ansible and git and run an Ansible playbook script from the [alsl-infrastructure](https://github.com/mshogren/alsl-infrastructure) repo.

My user data script is based on the one I found [here](
http://blog.xi-group.com/2014/07/small-tip-how-to-use-aws-cli-to-start-spot-instances-with-userdata/).
The key commands are shown below.

```
apt_get_install git ansible
su - ubuntu -c "ansible-pull -i \"localhost,\" -d /home/ubuntu/alsl-infrastructure -U https://github.com/mshogren/alsl-infrastructure aws/alsl-ec2-dev.yml"
```
The [`alsl-ec2-dev.yml`](https://github.com/mshogren/alsl-infrastructure/blob/master/aws/alsl-ec2-dev.yml)
file is an Ansible playbook that runs some other ansible plays that are defined in a different folder.  The plays are kept separate since they are not necessarily dependent on AWS EC2, and should run against other infrastructure, whether that be physical machines, virtual machines or containers.

To start with I created the following ansible project structure:

```
devenv.yml
roles
  awscli
  vim
  nodejs
  asp.net
  libuv
```

The playbook is at the top level, and references the roles that should be included.  The roles are defined in their own sub-folder under a roles folder.  This folder structure meets some conventions defined by Ansible and reduces the need to specify paths inside roles or playbooks.  Further information about roles and other includes is [here](http://docs.ansible.com/ansible/playbooks_roles.html).

The vim role downloads vim and sets it up with a configuration that I keep under source control at [https://github.com/mshogren/dotvim](https://github.com/mshogren/dotvim). I got that idea from [here](http://vimcasts.org/episodes/synchronizing-plugins-with-git-submodules-and-pathogen/).  The asp.net role is based on instructions I found [here](https://www.microsoft.com/net/core#ubuntu). Hopefully I have made my point, that is that it should be possible to create and Ansible role out of any script that an installation follows.

Some roles still need to created.  For example, I need a role to clone other source repositories to the machine.  I would also like to create a role that sends a notification when the machine is finished being setup, but that will require a few more things to be sorted out.  I will leave that for a future post in this series.
