# TemplateCLI (@bracketed/create-templates)

A Template creation system by ninjaninja140 & Team Bracketed!

Welcome to TemplateCLI, this is a tool made for cloning template repositories made by Team Bracketed or ninjaninja140.
To use this tool, all you have to do is run either of these commands:
Yarn: `yarn create @bracketed/templates <DIRECTORY> --template <TEMPLATE NAME>`
NPM: `npx @bracketed/create-templates <DIRECTORY> --template <TEMPLATE NAME>`

A rundown of what things do and the extras:
In Directory you can put either a dot (".") to transform the local directory that the command was ran into the template project, or you can supply a name for the project, where the name of the project will be made into a folder which will contain the template project.

In the --template (-t) flag you put the name of the template, to find templates on either ninjaninja140's github profile or the Team Bracketed organisation on github, you just have to search for repositories that start with `templates-`. You take the stuff past `templates-` or keep it in the name, and the cli will clone it for you.

There is an extra flag, --authentication (-a), in the event that you get rate limited by github when using this tool please use this flag with a github token. It will allow you to surpass the free non-authenticated limit of 60 requests per hour.

Happy coding!
