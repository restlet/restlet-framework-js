# Contributing to Restlet JS

## Github repository

Restlet Framework is hosted here on Github, and you're currently browsing a page of the Github wiki of the project.
Here's the repository: [Restlet Framework](https://github.com/restlet/restlet-framework-js)

## Issue tracker

The project is using the Github [issue tracker](https://github.com/restlet/restlet-framework-js/issues).

While using the Restlet Framework, you may encounter issues that you want to report to us. Those issues can be of several types including bugs, enhancement or new feature requests.

For general support questions, you might also consider asking your questions under the ['restlet.js' tag](https://stackoverflow.com/questions/tagged/restlet.js) or ['restlet' + 'javascript' tags](https://stackoverflow.com/questions/tagged/restlet+javascript) at StackOverflow.

### Check list

Before entering a new report, you should [query](https://github.com/restlet/restlet-framework-js/issues?sort=created&direction=desc&state=open) the current issue database for similar open issues. You might also want to talk about your issue by raising a question on Stackoverflow, as mentioned above. Eventually, make sure that you also consult the [documentation section](http://restlet.com/technical-resources/restlet-framework/guide/2.3) of the version of the Restlet Framework you are using.

### Reporting an issue

The Restlet project relies on an issue tracker hosted at GitHub to manage all those reports. If you want to create a new report, you should first have a GitHub account. If necessary, you can create a new one by going to the [signup page](https://github.com/signup/free). Then you should go to the [Issue Tracker page](https://github.com/restlet/restlet-framework-js/issues/new). If you don't see the page to enter an issue, make sure that you are correctly logged into GitHub.

## Submit contributions
	
If you found a bug and fixed it locally, or if you developed an enhancement that could benefit to others, you are welcome to submit your code changes. You simply need to follow these steps:

* Verify that you follow the code style running the command `npm run code:style`
* Verify that all tests pass running the command `npm run test:default
* Consider writing additional unit tests covering your contribution
* Right before creating a pull request, squash all your commits into a single one with the command `git rebase HEAD~number` (1) and provide a 
  commit   message that follows convention from conventional changelog (2)
* Create a pull request on GitHub based on [those instructions](http://help.github.com/send-pull-requests/)
* Once your patch is accepted, a signed [Joint Copyright Assignment (JCA)](https://github.com/restlet/restlet-sites/blob/master/modules/com.restlet/participate/Joint%20Copyright%20Assignment%20-%20General.pdf?raw=true) will be required

These two links can be helpful at this level:

* (1) [Contribute open-source projects using Git](https://templth.wordpress.com/2014/10/31/contribute-open-source-projects-using-git/)
* (2) [Commit Message Format](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md)

[NOTE]
----
Note that the JCA is necessary in order to maintain a principal copyright holder for the whole code base and allow us to propose several open source licenses in parallel, to upgrade to future versions of those licenses or to choose new ones. It also allows Restlet to offer restricted commercial licenses to other vendors or organizations wishing to incorporate and redistribute Restlet in their proprietary product without the constraints of our open source licenses or to develop custom versions without wanting to redistribute their changes publicly. In these case, it helps us to fund the ongoing development of our open source project.
----