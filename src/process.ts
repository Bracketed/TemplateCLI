import { Command } from 'commander';
import * as download from '@bracketed/gitdownloader';
import * as path from 'path';
import * as fs from 'fs';
import { output } from './utilities/output.js';
import { github } from './utilities/github.js';
import { LIB_VERSION } from './utilities/version.js';
import chalk from 'chalk';

interface options {
	template: string;
	authentication: string | null | undefined;
}

const logo: Array<string> = [
	'  ______                     __      __       ________    ____',
	' /_  __/__  ____ ___  ____  / /___ _/ /____  / ____/ /   /  _/',
	'  / / / _ \\/ __ `__ \\/ __ \\/ / __ `/ __/ _ \\/ /   / /    / /  ',
	' / / /  __/ / / / / / /_/ / / /_/ / /_/  __/ /___/ /____/ /   ',
	'/_/  \\___/_/ /_/ /_/ .___/_/\\__,_/\\__/\\___/\\____/_____/___/   ',
	'                  /_/                                         ',
	'A project by Team Bracketed & ninjaninja140!',
];

function run() {
	const program = new Command('create-templates');

	program
		.version(LIB_VERSION)
		.arguments('<directory>')
		.option(
			'-t, --template <template>',
			'Any repository that starts with "templates-" on ninjaninja140\'s GitHub Repositories or in the Bracketed Organisation Repositories'
		)
		.option('-a, --authentication <token>', "Authenticate to GitHub's API when using this tool.")
		.action(async (directory: string, options: options) => {
			console.clear();
			output.log(logo);
			output.log();
			output.log(
				`TemplateCLI by ninjaninja140 | CLI Version: v${output.versions.lib} | Node Version: ${
					output.versions.node
				} | NPM Version: ${output.getNPMVersion()}`
			);
			output.log();

			let templateName = options.template.toLowerCase() || undefined;
			const templateDirectory = directory || undefined;

			if (!templateDirectory) {
				output.log(`${chalk.bold(chalk.red('ERR!'))} No directory supplied in command.`);
				return output.log([
					'If you think that this error was a mistake, try running the command again!',
					'If this error continues to persist, open an issue on the TemplateCLI Repository here: https://github.com/bracketed/templatecli/issues',
				]);
			}

			if (!templateName) {
				output.log(`${chalk.bold(chalk.red('ERR!'))} No template name supplied in command.`);
				return output.log([
					'If you think that this error was a mistake, try running the command again!',
					"If you're looking for templates, maybe look in the repositories section of ninjaninja140's profile or the Bracketed Organisation!",
					'If this error continues to persist, open an issue on the TemplateCLI Repository here: https://github.com/bracketed/templatecli/issues',
				]);
			}

			if (templateName.startsWith('templates-')) {
				templateName = templateName.replace('templates-', '');
			}

			const targetPath = path.resolve(process.cwd(), templateDirectory);
			let templatePackageName = templateDirectory;

			if (templatePackageName === '.') {
				const filePath = process.cwd();
				const splitFilePath = filePath.split('\\');
				const dirName = splitFilePath[splitFilePath.length - 1];

				templatePackageName = dirName;
				output.log('Directory is ".", using folder name as project name.');
			}

			if (!options.authentication) {
				output.log([
					`${chalk.bold(
						chalk.hex('e39000')('WARNING:')
					)} We advise you add a Github Authorisation Token to this command, otherwise you are at risk of being rate limited.`,
					`To add your Github Authorisation Token to this command, add ${chalk.underline(
						'-a'
					)} or ${chalk.underline('--authorisation')} to the end of this command with your token next to it.`,
					"If you don't have one, you can generate one in your Github User Settings at Developer Settings > Personal access tokens > Tokens (classic)!",
				]);
				output.log();
			}

			const BracketedCheckBuffer = output.buffer('Checking Bracketed Repositories for the template supplied...');
			BracketedCheckBuffer.start();
			const BracketedRepo = await github.check('bracketed', `templates-${templateName}`, options.authentication);
			BracketedCheckBuffer.succeed('Repositories checked!');

			const Ninjaninja140CheckBuffer = output.buffer(
				'Checking Bracketed Repositories for the template supplied...'
			);
			Ninjaninja140CheckBuffer.start();
			const Ninjaninja140Repo = await github.check(
				'ninjaninja140',
				`templates-${templateName}`,
				options.authentication
			);
			Ninjaninja140CheckBuffer.succeed('Repositories checked!');

			let Repository: string | undefined;

			if (BracketedRepo === 200) {
				Repository = `bracketed/templates-${templateName}`;
				output.log('Found requested template in the Bracketed Repositories!');
			} else if (Ninjaninja140Repo === 200) {
				Repository = `ninjaninja140/templates-${templateName}`;
				output.log("Found requested template in the ninjaninja140's Repositories!");
			}

			if (BracketedRepo === 403 || Ninjaninja140Repo === 403) {
				output.log(`${chalk.bold(chalk.hex('e39000')('WARNING:'))} You are being rate limited.`);
				return output.log([
					'If you believe this is a mistake, please run the command again.',
					'If this error persists, please come back another time and try to use this tool.',
				]);
			}

			if (BracketedRepo === 401 || Ninjaninja140Repo === 401) {
				output.log(`${chalk.bold(chalk.red('ERR:'))} Your Authorisation key is invalid or incorrect.`);
				return output.log([
					'If you believe this is a mistake, please run the command again.',
					'If this error persists, please come back another time and try to use this tool.',
				]);
			}

			if (!Repository) {
				output.log(`${chalk.bold(chalk.red('ERR!'))} The template requested was not found.`);
				return output.log([
					'If you think that this error was a mistake, try running the command again!',
					"Alternatively, you can check the Repositories tab of ninjaninja140's profile or the Bracketed Organisation to validate the template you want to use exists.",
					'If this error continues to persist, open an issue on the TemplateCLI Repository here: https://github.com/bracketed/templatecli/issues',
				]);
			}

			const DirectoryCheckBuffer = output.buffer('Checking for free directory...');
			DirectoryCheckBuffer.start();

			if (fs.existsSync(targetPath) && templateDirectory !== '.') {
				DirectoryCheckBuffer.fail(
					`${chalk.bold(chalk.red('ERR!'))} Directory already exists. Choose a different name or path.`
				);
				return output.log([
					'If you think that this error was a mistake, try running the command again!',
					'If this error continues to persist, open an issue on the TemplateCLI Repository here: https://github.com/bracketed/templatecli/issues',
				]);
			} else {
				DirectoryCheckBuffer.succeed('Directory check passed!');
			}

			output.log(`Cloning ${Repository} to ${targetPath}...`);
			const GitCloneBuffer = output.buffer('Downloading Template...');
			GitCloneBuffer.start();

			const repo = await download
				.download(Repository, targetPath, { type: 'github' })
				.then(() => true)
				.catch(() => false);

			if (!repo) {
				GitCloneBuffer.fail(
					`${chalk.bold(chalk.red('ERR!'))} There was an error while downloading the Template.`
				);
				return output.log([
					'If you think that this error was a mistake, try running the command again!',
					'If this error continues to persist, open an issue on the TemplateCLI Repository here: https://github.com/bracketed/templatecli/issues',
				]);
			}

			GitCloneBuffer.succeed('Template downloaded successfully!');
			output.log(`Your new template has been successfully downloaded into the directory "${targetPath}"!`);

			const packageBuffer = output.buffer('Updating package.json with newer details...');
			packageBuffer.start();
			const packageJsonPath = path.join(targetPath, 'package.json');
			if (fs.existsSync(packageJsonPath)) {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
				packageJson.name = templatePackageName.toLowerCase();

				fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

				packageBuffer.succeed('Updated details in package.json!');
				output.log(
					'The package.json file of your project was updated to use the name that you supplied in the create command.'
				);
			} else {
				packageBuffer.fail('Could not update the details in package.json.');
				output.log(
					'The package.json file of your new project could not be found, the name was not modified to suit your new project.'
				);
			}

			output.log();
			output.log('Your next steps:');
			output.log([
				'Your new Template Project has been downloaded, so what next?',
				`To begin using this template, run cd ${targetPath} to enter the directory!`,
				'Run yarn install or npm install to install all the dependencies you need to start developing!',
				'And from there, the reigns are yours, do what you want!',
			]);
			output.log();
			output.log('Happy coding!');
		});

	program.parse(process.argv);
}

export { run };
