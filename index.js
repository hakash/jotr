#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Helper functions
 */


/**
 * Initial setup
 */
const fs = require('fs');
const editor = require('tiny-cli-editor');
const Jot = require('./Jot.js');

let jotrPath = process.env.JOTR_HOME = require('os').homedir() + '/.jotr/';
let filename = process.env.JOTR_DATA_FILE = 'jots.yml';

/**
 * Try to initialize home path and filename if not exists
 */
if(!fs.existsSync(jotrPath)){
	try {
		fs.mkdirSync(jotrPath);
	}
	catch(e){
		console.log('Could not create Jotr data directory.');
		console.log(e);
	}
}

if(!fs.existsSync(jotrPath + filename)){
	try {
		fs.writeFileSync(jotrPath + filename, '');
	}
	catch(e){
		console.log(`Could not initialize storage file ${jotrPath + filename}`);
		console.log(e);
		process.exit(1);
	}
}

// Load the long help text
var usage = fs.readFileSync(__dirname + '/usage.txt','utf8');

// Load the module
const yargs = require('yargs');

// Configure the module
yargs.usage(usage)
	.version()
	.epilog('')
	.help('h')
	.alias('h','help')
	.alias('v','version')
	.fail( (msg) => {
		console.log(msg);
		process.exit(1);
	})
	.wrap(yargs.terminalWidth());

// Add examples
yargs.example('$0 javascript','Jot down a jot with the tag \'javascript\'.')
	.example('$0 javascript arrays', 'Add a jot with the tags \'javascript\' and \'arrays\' ')
	.example('$0 javascript -c "A useful jot"', 'Add a short jot without using the built-in editor.');

// Add option for adding a jot on the command-line, no editor, "git commit -m '...'" style.
yargs.option('c',{
	alias: 'content',
	describe: 'Skip the built-in terminal and write a one line jot. Must be the last argument.',
	type:'array',
	group: 'Editing:'
});

// Add option for editing the raw YAML-file in the editor
yargs.option('edit',{
	describe:'Open the backing YAML-file in the built-in editor',
	boolean: true,
	group: 'Editing:'
});

// Add option for searching the jots for jots with a specific term
yargs.option('g', {
	alias: 'grep',
	describe: 'Simple search through the data. The term is matched against the content of the jots, not the tags.',
	nargs:1,
	requiresArg: true,
	fail: 'Invalid number of arguments supplied to "jotr --grep". Please include a term to search for, or use "jotr --list" to output all data.',
	group: 'Show data:'
});

// Add the option for outputting the recorded jots, filtered by optional tags
yargs.option('l',{
	alias:'list',
	describe:'Dump jots to the terminal. Use optional tags to filter list.',
	type: 'array',
	group: 'Show data:'
});

// Add the option for outputting the tags in use
yargs.option('t',{
	alias:'tags',
	describe:'Dump tags to the terminal.',
	type: 'boolean',
	group: 'Show data:'
});

// Add the option for enabling debug output as jotr runs
yargs.option('debug',{
	describe: 'Enable debug output',
	boolean:true
});

// Add the flags for doing a full purge of the data-file
yargs.option('purge',{
	describe:'Empty the backing YAML-file. WARNING! If you have\nnot exported a backup, or manually backed up the\nfile, all data is lost!',
	boolean: true,
	group: 'Dangerzone:'
});

// Configure which flags conflics
yargs.conflicts({
	'c':		['g','l','export','edit','purge', 't'],
	'g':		['l','export','edit','purge', 't'],
	'l':		['export','edit','purge', 't'],
	'export':	['edit','purge', 't'],
	'edit':	 	['purge', 't'],
	'purge': 	['t'],
});

// Done setting up
let args = yargs.argv;

process.env.DEBUG = args.debug;

/**
 * Set up the Jot object
 */
let jot = new Jot(jotrPath + filename);
jot.loadJots();

let tags = [];

// No categories given, use Random as default category
if(args._.length == 0) {

	tags.push('Random');
}
else 
{
	tags = [...args._];
}

if(args.content){
	jot.saveJots(tags, args.content.join(' '));
}
else if(typeof args.list == 'object'){
	let output = jot.getJots(args.list);

	if(output == '' && args.list.length == 0){
		console.log('No jots yet! Try using \'jotr -c My first jot!\' to add that jot with the \'Random\' tag.');
		return;
	}

	if(output == '' && args.list.length > 0){
		console.log('No jots whith the given tag(s) yet!');
		console.log('Try using \'jotr %s -c A tagged jot!\' to add that jot with the tag(s): %s', args.list.join(' '), args.list.join(' '));
		return;
	}

	console.log('Your jots %s:', args.list.length > 0 ? 'tagged with ' + args.list.join(', ') : 'so far');
	console.log(output);
}
else if(args.grep){
	let output = jot.grepJots(args.grep);
	console.log('Your jots matching', args.grep);
	console.log(output);
}
else if(args.tags){
	let output = jot.getTags().join('\n');
	console.log(output);
}
else if(args.edit){
	editor(jot.getRaw())
		.on('submit',(content) => jot.saveRaw(content) )
		.on('abort', () => process.exit(1));
}
else if(args.purge){
	const rl = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.question('Are you sure you want to purge all data? (y/N)', res => {
		if(!res) res = 'n';

		if(res == 'yes' || res == 'y'){
			jot.saveRaw('');
		}
		rl.close();
	});
}
else if(args.export){
	jot.exportJotsToFile(args.export);
}
else {
	editor('')
		.on('submit',(content) => jot.saveJots(tags, content) )
		.on('abort', () => process.exit(1));
}
