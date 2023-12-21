#!/usr/bin/env node

/**
	  ______                     __      __           
	 /_  __/__  ____ ___  ____  / /___ _/ /____  _____
	  / / / _ \/ __ `__ \/ __ \/ / __ `/ __/ _ \/ ___/
	 / / /  __/ / / / / / /_/ / / /_/ / /_/  __(__  ) 
	/_/  \___/_/ /_/ /_/ .___/_/\__,_/\__/\___/____/  
	                  /_/                             
	A project by Team Bracketed & ninjaninja140!

	@name @bracketed/create-templates
	@author [ Team Bracketed ] & ninjaninja140
	@version 1.1.0

*/

if (Number(process.versions.node.split('.')[0]) < 16) {
	console.error(
		'You are running Node ' +
			process.versions.node +
			'.\n' +
			'@bracketed/create-templates requires a higher version to run. \n' +
			'Please update your version of Node before using @bracketed/create-templates.'
	);
	process.exit(1);
}

import { run } from './process.js';

run();

