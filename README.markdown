Stylicious and Selectacular
===========================

This is my entry in the Atlassian [Codegeist](http://codegeist.atlassian.com/entry/168710) 2011 competition.

It is a SpeakEasy extension that allows the user to apply their own personal stylesheets to a Confluence site.

Stylicious
----------

Stylicious allows you to edit and save individual stylesheets for various contexts. eg: to apply everywhere, or just to a
specific wiki page or space, or even just to the dashboard page.

When installed and enabled in Speakeasy, it provides a new menu item 'Stylicious' in your user menu. This will open
an editing window, from which you can select the context from the left hand side and enter your custom CSS in the
textarea on the right.

Your custom CSS is currently saved into the browser localStorage facility.

Selectacular
------------

Selectacular is a tool that makes finding a CSS selector really easy. It can be alone from the 'Selectacular' menu item,
or opened from Stylicious, from where it will be used to replace the current text selection with the found selector.

Installation Instructions
-------------------------

1. Download and install the [Speakeasy 0.9.2](https://maven.atlassian.com/content/repositories/atlassian-public/com/atlassian/labs/speakeasy-plugin/0.9.2/speakeasy-plugin-0.9.2.jar) plugin into Confluence
2. Download [stylicious-1.0.jar](https://github.com/downloads/jollytoad/Stylicious/stylicious-1.0.jar) and install into Confluence as a Speakeasy extension or as a plugin

(The single jar contains both Stylicious and Selectacular)

Usage
-----

See the [video](http://www.youtube.com/watch?v=8rKBLIAUPuQ)

Development
-----------

The extension is built using the [Atlassian Plugin SDK](http://confluence.atlassian.com/display/DEVNET/Developing+your+Plugin+using+the+Atlassian+Plugin+SDK).
