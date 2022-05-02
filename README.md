<link rel="stylesheet" type="text/css" href="css/github.css"> 
 
<h1 align="center"> 
  <img src="images/ddoi_social.png" alt="DDoI VPN Logo" width="75%" align="middle">
</h1> 

## Distributed Denial of Identity VPN

Everyone needs their alter-egos... <br>


## Table of contents:

* [DDoI VPN](#distributed-denial-of-id-vpn) 
* [Table of Contents](#table-of-contents) 
* [Description](#description)
	* [Pros](#pros)
	* [Cons](#cons)
* [Theory of Operation](#theory-of-operation) 
	* [Hardware Components](#hardware-components)
	* [Software Components](#software-components)
	* [Usage and Network Flow](#usage-and-network-flow)
	* [Other Points](#other-points)
* [Requirements](#requirements)
* [Installation](#installation)
	* [Common Tasks to All Systems](#common-tasks-to-all-systems)
	* [ProxyVM Installation and Configuration](#proxyvm-installation-and-configuration)
		* [WireGuard on ProxyVM](#wireguard-on-proxyvm)
		* [iptables on ProxyVM](#iptables-on-proxyvm)
	* [Linode1 Installation and Configuration](#linode1-installation-and-configuration)
		* [WireGuard on Linode 1](#wireguard-on-linode1)
		* [Squid on Linode1](#squid-on-linode1)
		* [iptables on Linode1](#iptables-on-linode1)
	* [Linode2 Installation and Configuration](#linode2-installation-and-configuration)
		* [WireGuard on Linode2](#wireguard-on-linode2)
		* [Squid on Linode2](#squid-on-linode2)
		* [iptables on Linode 2](#iptables-on-linode2)
* [Best Practices](#best-practices)
	* [Browsers](#browsers)
		* [Firefox and Variants](#firefox-and-variants)
			* [Managing Profiles in Firefox](#managing-profiles-in-firefox)
				* [Creating New Profiles](#creating-new-profiles)
				* [Forcing from Command Line](#forcing-from-command-line)
				* [Using Themes to Discern](#using-themes-to-discern)
				* [Bookmark All Common Sites](#bookmark-all-common-sites)
			* [Managing Proxies](#managing-proxies)
				* [Forced Through Command Line](#forced-through-command-line)
				* [Proxy Switching Extensions](#proxy-switching-extensions)
			* [Basic Hardening](#basic-hardening)
		* [Chrome and Variants](#chrome-and-variants)
			* [Managing Profiles in Chrome](#managing-profiles-in-chrome)
				* [Creating New Profiles](#creating-new-profiles)
				* [Forcing from Command Line](#forcing-from-command-line)
				* [Using Themes to Discern](#using-themes-to-discern)
				* [Bookmark All Common Sites](#bookmark-all-common-sites)
			* [Managing Proxies](#managing-proxies)
				* [Forced Through Command Line](#forced-through-command-line)
				* [Proxy Switching Extensions](#proxy-switching-extensions)
			* [Basic Hardening](#basic-hardening)
	* [Protecting Your Network](#protecting-your-network)
		* [Hardening With iptables](#hardening-with-iptables)
		* [Obscuring](#obscuring)
		* [Logging and Alerting](#logging-and-alerting)
	* [Fake Online Identities](#fake-online-identities)
		* [Country of Origin vs Current Country](#country-of-origin-vs-current-country)
			* [Make Sure the Browser is Not Ratting You Out](#make-sure-the-browser-is-not-ratting-you-out)
			* [Language Habits](#language-habits)
			* [Making Friends](#making-friends)
		* [Sources of Selfies](#sources-of-selfies)



## Description:
[Table of Contents](#table-of-contents)

DDoI (pronounced, "duh doi") VPN is mostly intended to assist others in realizing their potential for taking 
complete control over their fake online (web-based) identities.  This is documented and tested
as an all-linux solution, though it could easily be changed for other OSes.  

Here are the main pros and cons of this solution over others:

### Pros:

* No third-party VPN service to trust
* No applications to install on the "Browsing Client"
* No network configuration required on the "Browsing Client"
* "Browsing Clients" can therefore be anything that has a web browser with proxy configuration capability (PC, Phone, Chromebook, tablet, etc.)
* Multiple, segregated browser instances can be open at once, allowing you to check email on fake ID #7, while still being logged into Facebook on Fake ID #18.
* No "kill-switch"ing.  The browser you open stays contained, and everything else runs business-as-usual.  Less likely to leak ID metadata 
across each other.

### Cons:

* Not as cheap as third-party services.  You are going to pay $5/mo per region you desire.
* Linode currently has limited regions.  This might be easily changed to work in AWS, however.
* The final egress is static for each region.  Linode offers no easy way to change IP addresses on an instance.


## Theory of Operation:
[Table of Contents](#table-of-contents)

We will refer to the following diagram for this explaination:

<h1 align="center"> 
  <img src="images/ddoi_diagram.png" alt="DDoI VPN Diagram" width="75%" align="middle">
</h1> 

### Hardware Components:

DDoI VPN has 3 major hardware components, all of which are under your complete control at all times.  These are: the "Browsing Client", 
the "ProxyVM", and the "Linodes".  The ProxyVM might be better named something else, like "VPNrouter", "ProxyForwarder", or 
even just "Waypoint", but the name was chosen when the main purpose of the box was indeed to be purely a simple proxy. 

The ProxyVM can be an internal machine.  All that is important is that it can reach the external Linode machines via UDP.  The 
choices for interface names is arbitrary and were chosen only to make the most sense in this diagram.  The choices for ports 
are also arbitrary.

This example only covers how to set DDoI up for two Linode instances, but you will see that it is easily expandable to as 
many as you can afford, essentially.

### Software Components:

There are two major software components to DDoI: WireGuard and Squid.  The rest is handled in this example through iptables, though
you are also free to use your favorite front-end.

WireGuard is a very fast VPN tunnel which will securely connect the ProxyVM to the Linodes.  Squid is a fairly robust proxy
software also freely avalable.  The Squid proxy runs on each Linode and is configured to listen to a port on the WireGuard
VPN tunnel, but use the Linode's external interface to browse the web.  There is nothing actually listening on the 
"proxy" ports on the ProxyVM.  All traffic coming into those ports are forwarded directly through the WireGuard VPN
tunnel to whichever Linode has been associated with it.  This is all done through iptables on the Proxy VPN.  There is no
special iptables trickery on the Linode end.  Squid takes care of proxying the traffic from the VPN tunnel to the outside.

### Usage and Network Flow:

The basic use and flow is:

* User creates a new blank profile for favorite browser and hardens it as much as possible.
* User configures this browser to use ProxyVM:443 as an HTTP proxy.
* User browses, and:
	* Web traffic exits Browsing Client and hits port 443 on ProxyVM.
	* iptables on ProxyVM forwards all traffic hitting port 443 on eth0 on ProxyVM to port 4443 on wgl1 on Linode1.
	* Squid on Linode1 is listening for traffic on wgl1:4443, and sees the traffic and verifies, if desired.
	* Squid proxies the web traffic out an ephermeral port on eth0 on Linode1.
	* Squid proxies the return traffic back through the WireGuard tunnel to the wgpa interface on ProxyVM.
	* iptables on ProxyVM then forwards the return web traffic back through port 443 on ProxyVM's eth0.
	* Return web traffic is handled by user's browser on Browsing client.

Very simple.  Very fast.

### Other Points:

There are many "best practices" to consider when doing this sort of thing, and we will cover some of them.  ALL web browsers, 
no matter how "secure" they claim to be, are constantly vomiting metadata.  Youy will be able to witness much of it occur just by 
watching the Squid proxy logs.  This needs to be controlled.  This design also introduces a possible pathway from the Internet 
and back through into your IDN.  This pathway must be tightly controlled.

But, once everything is up and going, there is nothing left but to add another browser or profile that uses the other ProxyVM port, 
and you have a second fresh identity/footprint ready to be created.  A combination of browser brands, profiles, proxy switching 
extensions, and private+public browsing will give one the ability to come up with multiple web identities, the number limited only to 
your resources.  And, many of them can be up and worked at the same time!  Gone will be the days of closing one browser down, 
making configuration changes, making VPN location changes, and bringing a new one up, just to switch over to another online presense.


## Requirements:
[Table of Contents](#table-of-contents)

The requirements for making this work are much fewer than making it work exactly like this example.  This example will be concentrated 
on here, though, and replacements for any part of this will be left to the reader.

The following things are required to precisely duplicate this design:

* A Redhat/CentOS/Rocky Linux machine on the local network, with access to the outside.  I use Rocky Linux 8.5 for everything, and the ProxyVM
is a virtual machine on my primary ESXi server.  A physical machine, docker container, or other virtualized solution should be fine.  The 
procedure is tweaked for Rocky Linux, though.   <a href="https://rockylinux.org/download/">Rocky Linux</a> is 100% bug-for-bug compatible 
with RedHat Enterprise Linux, started by one of the originl CentOS founders.  It is what CentOS would have become had they not gone the way
they did.
* Two or more <a href="https://www.linode.com/">Linode</a> "nanodes" or better.  The cheapest 1GB Nanode with shared CPU is fine for this.  
They were $5/mo per instance at the time of this writing.  Check the options to see what might work best for you.  I am not using mine to watch 
tons of movies or trade warez, so the 1TB data cap is fine, so far.  
* Both of my Linodes also have Rocky Linux 8.x images installed.
* It makes the most sense for this if these instances are not near your own region.  But, you can do it however you like.  I have tested 
Singapore from where I am (far away from Singapore) and speeds are fine, except sometimes in the middle of their afternoons.  I tend to
build fake international identities, though.
* This solution will use the <a href="https://www.wireguard.com/">WireGuard</a> VPN tunnel.
* This solution will use the <a href="http://www.squid-cache.org/">Squid</a> caching proxy.
* This solution will utilize the <a href="https://www.netfilter.org/projects/iptables/index.html">iptables</a> userspace command line program.
You can use whatever you are comfortable with, but I will show you how to tear firewalld out and put iptables back into place on a RedHat 
variant OS.
* This example will use the <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a> browser on a Windows 10 machine.  Everything you
learn here about how to get Firefox going should carry over to all of the "secure" packaged variants, like Tor browser.  Chrome will also
be covered a little, which should open up its variants (Brave, Epic, et al) for you to explore as well.


## Installation:
[Table of Contents](#table-of-contents)

Assuming you have built all of the boxes, and configured/hardened them to your satisfaction, you will need to gather the following:

* ProxyVM external IP address.   (If this is an internal, NAT/MASQ'ed machine, try: "curl -4 icanhazip.com")
* Linode1 external IP address.
* Linode2 external IP address.

All of the configuration files you should need are included in this repository, sorted into directories.  Most of them you can just copy
into place and go.  The iptables files you will need to integrate into your existing iptables by hand, though.  To have them all at-hand, SSH 
into each box and:

```shell
cd /usr/local/src/
yum -y install git
git clone https://github.com/AwJaa/DDoI-VPN
cd DDoI-VPN/

```

Caveat: 

I have been admining *nix for 30 years.  I use root.  Sudo is useful for multi-user systems, and I get that.  I just do not use it on 
my personal systems.  Thousands of command lines per day... 365 days a year... 5 characters saved for each command.  I am saving over 
1.5 million characters typed, every year.  My keyboards last longer, meaning less e-waste in the dumps.  I am saving the planet, maaaaan.

But, if you are into sudo for everything, just tack that onto the beginning of every command.  If that's your thing.   If that's how you roll.

I never kink shame.

### Common Tasks to All Systems:
[Table of Contents](#table-of-contents)

1. Either SSH into each machine as root, like a real man, or use your beta sudo crutch.
2. Perform the following:

```shell
# Disable firewalld and install, start, and enable iptables:
# NOTE: I disable IPv6 on my systems - you can perform the commented-out commands if you do not.
yum -y install iptables-services
systemctl stop firewalld
systemctl start iptables
# systemctl start ip6tables
systemctl disable firewalld
systemctl mask firewalld
systemctl enable iptables
#systemctl enable ip6tables

# Install WireGuard:
# NOTE: If you do not like the idea of copr, you can try another method from:
# https://www.wireguard.com/install/
yum config-manager --set-enabled powertools extras
yum -y install epel-release
yum -y copr enable jdoss/wireguard
yum -y install wireguard-dkms wireguard-tools

# Stage the DDoI VPN repository:
cd /usr/local/src
yum -y install git
git clone https://github.com/AwJaa/DDoI-VPN

# Generate the WireGuard key pair for this system:
cd /etc/wireguard
wg genkey | tee privatekey | wg pubkey > publickey

```

### ProxyVM Installation/Configuration:
[Table of Contents](#table-of-contents)

1. SSH into your ProxyVM box and, as root:

#### WireGuard on ProxyVM:
```shell

######################
### WireGuard:
######################

cd /etc/wireguard
# Save this to use on Linode1 and Linode2:
cat publickey
# Save this to use on this ProxyVM:
cat privatekey

# I could give you tons of fancy-shmancy CLI wizardry to build the WireGuard config 
# file, here, but just transfer the one from the repo and edit the following values:
#   [PROXYVM_EXTERNAL_IP_ADDRESS]
#   [PROXYVM_PRIVATE_KEY]
#   [YOUR_INTERNAL_NAMESERVER_IF_ANY,]
#   [LINODE1_PUBLIC_KEY]
#   [LINODE1_EXTERNAL_IP_ADDRESS]
\cp /usr/local/src/DDoI-VPN/proxyvm/wireguard/wgpa.conf .
chmod 600 *
# use your favorite editor now

# I could give you tons of fancy-shmancy CLI wizardry to build the WireGuard config 
# file, here, but just transfer the one from the repo and edit the following values:
#   [PROXYVM_EXTERNAL_IP_ADDRESS]
#   [PROXYVM_PRIVATE_KEY]
#   [YOUR_INTERNAL_NAMESERVER_IF_ANY,]
#   [LINODE2_PUBLIC_KEY]
#   [LINODE2_EXTERNAL_IP_ADDRESS]
\cp /usr/local/src/DDoI-VPN/proxyvm/wireguard/wgpb.conf .
chmod 600 *
# use your favorite editor now

# Start and enable the WireGuard service for these interfaces:
systemctl start wg-quick@wgpa
systemctl start wg-quick@wgpb
systemctl enable wg-quick@wgp1
systemctl enable wg-quick@wgpb

```

#### iptables on ProxyVM:
```shell
######################
### iptables:
######################

# You now need to integrate the /usr/local/src/DDoI-VPN/proxyvm/iptables/iptables file into your
# existing /etc/sysconfig/iptables file, using your favorite editor:

# Enable these iptables changes in a persistant way:
cat /etc/sysconfig/iptables | iptables-restore

# You also need to enable packet forwarding in the kernel:
cat<<'EOF'>>/etc/sysctl.conf

## Turn on bbr ##
net.core.default_qdisc = fq

## Turn on basic protection/security ##
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.tcp_syncookies = 1

## for IPv4 ##
net.ipv4.ip_forward = 1
## for IPv6 - uncomment the following line ##
#net.ipv6.conf.all.forwarding = 1


EOF

# Make sysctl read new values from file (/etc/sysctl.conf
sysctl -p

```


### Linode1 Installation and Configuration:
[Table of Contents](#table-of-contents)

1. SSH into your Linode1 box and, as root:

#### WireGuard on Linode1:
```shell

######################
### WireGuard:
######################

cd /etc/wireguard
# Save this to use on ProxyVM:
cat publickey
# Save this to use on this Linode1:
cat privatekey

# I could give you tons of fancy-shmancy CLI wizardry to build the WireGuard config 
# file, here, but just transfer the one from the repo and edit the following values:
#   [LINODE1_EXTERNAL_IP_ADDRESS]
#   [LINODE1_PRIVATE_KEY]
#   [PROXYVM_PUBLIC_KEY]
\cp /usr/local/src/DDoI-VPN/linode1/wireguard/wgl1.conf .
chmod 600 *
# use your favorite editor now

# Start and enable the WireGuard service for this interface:
systemctl start wg-quick@wgl1
systemctl enable wg-quick@wgl1

```

#### Squid on Linode1:
```shell
######################
### Squid:
######################

# Install Squid:
yum -y install squid

# Same as before, just copy the repo file over and edit the following values:
#   [LINODE1_EXTERNAL_IP_ADDRESS]
#   [LINODE1_EXTERNAL_IP_ADDRESS]
cd /etc/squid
\cp /usr/local/src/DDoI-VPN/linode1/squid/squid.conf .
chmod 640 squid.conf
# use your favorite editor now

# Start and enable the WireGuard service for this interface:
systemctl start squid
systemctl enable squid

```

#### iptables on Linode1:
```shell
######################
### iptables:
######################

# You now need to integrate the /usr/local/src/DDoI-VPN/linode1/iptables/iptables file into your
# existing /etc/sysconfig/iptables file, using your favorite editor, changing the following values:
#   [PROXYVM_EXTERNAL_IP_ADDRESS]

# Enable these iptables changes in a persistant way:
cat /etc/sysconfig/iptables | iptables-restore

```


### Linode2 Installation and Configuration:
[Table of Contents](#table-of-contents)

1. SSH into your Linode2 box and, as root:

#### WireGuard on Linode2:
```shell

######################
### WireGuard:
######################

cd /etc/wireguard
# Save this to use on ProxyVM:
cat publickey
# Save this to use on this Linode2:
cat privatekey

# I could give you tons of fancy-shmancy CLI wizardry to build the WireGuard config 
# file, here, but just transfer the one from the repo and edit the following values:
#   [LINODE2_EXTERNAL_IP_ADDRESS]
#   [LINODE2_PRIVATE_KEY]
#   [PROXYVM_PUBLIC_KEY]
\cp /usr/local/src/DDoI-VPN/linode2/wireguard/wgl1.conf .
chmod 600 *
# use your favorite editor now

# Start and enable the WireGuard service for this interface:
systemctl start wg-quick@wgl2
systemctl enable wg-quick@wgl2

```

#### Squid on Linode2:
```shell
######################
### Squid:
######################

# Install Squid:
yum -y install squid

# Same as before, just copy the repo file over and edit the following values:
#   [LINODE2_EXTERNAL_IP_ADDRESS]
#   [LINODE2_EXTERNAL_IP_ADDRESS]
cd /etc/squid
\cp /usr/local/src/DDoI-VPN/linode2/squid/squid.conf .
chmod 640 squid.conf
# use your favorite editor now

# Start and enable the WireGuard service for this interface:
systemctl start squid
systemctl enable squid

```

#### iptables on Linode2:
```shell
######################
### iptables:
######################

# You now need to integrate the /usr/local/src/DDoI-VPN/linode2/iptables/iptables file into your
# existing /etc/sysconfig/iptables file, using your favorite editor, changing the following values:
#   [PROXYVM_EXTERNAL_IP_ADDRESS]

# Enable these iptables changes in a persistant way:
cat /etc/sysconfig/iptables | iptables-restore

```


## Best Practices:
[Table of Contents](#table-of-contents)

This section is under long-term construction...

### Browsers:
[Table of Contents](#table-of-contents)

#### Firefox and Variants:

##### Managing Profiles in Firefox:

###### Creating New Profiles:

* Open Firefox
* Browse to "about:profiles"
* Click on [Create a New Profile] button
* Click on [Next] button
* Name the new profile however makes sense for you
* Click on [Choose Folder] and make a new directory in there using the profile name, so it's easier for you to poke through later
* Click on [Finish]

You can now always go into the Profile Manager at "about:profiles" and "Launch profile in new browser" or use the method below to 
force from the command line.

###### Forcing from Command Line:

You will need to use the -P command line switch to immediately force loading a specific profile.  If you are in *nix, you can probably 
figure it out.  The below is for Windows:

* On your desktop, create a new folder.  I called mine "DDoI VPN Browsers".
* Select the shortcut for Firefox (wherever) and copy it.
* Open the new folder and right click/paste the short cut into here.
* Right click on that new shortcut and select "Properties"
* In the "Target" field, after the last double quote, add:  -P "Profile_Name"   Include quotes if there are spaces, and change Profile_Name 
to the profile you've created in the previous section.
* Click on the [Ok] button.

###### Using Themes to Discern:

###### Bookmark All Common Sites:

##### Managing Proxies:

###### Forced Through Command Line:

###### Proxy Switching Extentions:

I recommend an extension called "FoxyProxy".  Very simple and easy.

##### Basic Hardening:

(This section needs to cover all the normal point-n-click things done before the rest)

The idea is to make Firefox stfu and stop leaking things.  If you are using a lot of crazy add-ons and extensions, you may wish to 
rethink that, now, or at least comb through them and research what they are capable of leaking.

The final steps require you to browse to "about:config" and admit to being a responsible adult.
Then, search and change the following settings to the following values:

```
network.captive-portal-service.enabled  false
network.connectivity-service.enabled  false
app.normandy.enabled   false
extensions.getAddons.cache.enabled   false
messaging-system.rsexperimentloader.enabled  false
app.normandy.optoutstudies.enabled  false
browser.newtabpage.activity-stream.feeds.asrouterfeed false
network.prefetch-next   false

network.dns.disablePrefetch   true

browser.startup.homepage_override.mstone    ignore

browser.search.geoip.url   <set a blank string>
browser.aboutHomeSnippets.updateUrl    <set a blank string>

network.http.speculative-parallel-limit  0
```

You can read more details, <a href="https://support.mozilla.org/en-US/kb/how-stop-firefox-making-automatic-connections#w_network-detection">here</a>.

NEW METHOD:

A file called user.js has been provided in this repo.  You can read more about how these things work in the links in the references section, below. 
But, basically, in the "%APPDATA%\Mozilla\PROFILE_NAME" folder, there will be a prefs.js file when you manually poke around in Firefox and change
values.  This file is read upon loading the profile, and saved again upon closing that browser.  So, you must close the browser before saving it, if 
you are editing in a text editor.  It is possible to make these changes permanent by putting them into a new file called user.js .  The user.js file 
has the same structure as prefs.js, but will override any user changes to prefs.js .  There is also a way to make these changes machine-wide for all 
profiles by using a mozilla.cfg file in the installation directory and pointing to it (see references).

Simply copy the supplied user.js into your "%APPDATA%\Mozilla\PROFILE_NAME" folder for the PROFILE_NAME you've built, and your Firefox should no 
longer be leaking much metadata everywhere.  Updating Firefox can add/remove these preferences and change them altogether.  So, be careful with allowing 
Firefox to auto-update.   You will need to go through and make sure there is nothing new to worry about.  Firefox is *rife* with what they call 
"studies", which are basically you volunteering to use your Firefox install on your machine to test their code.  Turn those ALL off, as you find them.

Reference:
* Profile Folders - http://kb.mozillazine.org/Profile_folder
* prefs.js - http://kb.mozillazine.org/Prefs.js_file
* user.js - http://kb.mozillazine.org/User.js_file
* mozilla.cfg - http://kb.mozillazine.org/Locking_preferences

Another suggestion is to go into settings and disable all the default search "engines" and go out and install the StartPage search extension.


#### Chrome and Variants:

##### Managing Profiles in Chrome:

###### Creating New Profiles:

###### Forcing from Command Line:

###### Using Themes to Discern:

###### Bookmark All Common Sites:

##### Managing Proxies:

###### Forced Through Command Line:

###### Proxy Switching Extentions:

##### Basic Hardening:

### Protecting Your Network:
[Table of Contents](#table-of-contents)

#### Hardening With iptables:

#### Obscuring:

#### Logging and Alerting:

### Fake Online Identities:
[Table of Contents](#table-of-contents)

#### Country of Origin vs Current Country:

##### Make Sure the Browser is Not Ratting You Out:

##### Language Habits:

##### Making Friends:

#### Sources of Selfies:

more to come....

