const fs = require('fs');
const yaml = require('js-yaml');

const LOGLEVEL = {
	INFO:1,
	DEBUG:2,
	NONE:3
};

class Jot {
	constructor(file) {
		this.content = {};
		this.jotFile = file;
	}

	log(){
		if(arguments.length < 1) return;

		let args = Array.from(arguments);
		let level = LOGLEVEL.DEBUG;
		if(args.length > 1){
			let last = args[args.length -1];

			if(typeof last == 'object' && last.level){
				level = last.level;
				args.pop();
			}
		}

		if(level === LOGLEVEL.INFO || (level === LOGLEVEL.DEBUG && process.env.DEBUG == 'true')){
			// eslint-disable-next-line no-console
			console.log(...args);
		}
	}

	saveJots(tags, jot){
		if(!jot || jot.trim() == ''){
			this.log('[saveJots] Empty jot. Skipping save');
			return;
		}
		tags.forEach( (tag) => {
			if(!this.content[tag]){
				this.content[tag] = [];
			}
			this.content[tag].push(jot);
		});

		this.log('[saveJots] content to save:\n' , this.content);

		let yamlString = yaml.safeDump(this.content);
		this.log(yamlString);
		fs.writeFileSync(this.jotFile,yamlString);
	}

	loadJots() {
		this.log('[loadJots] loading jots');
		try {
			var doc = yaml.safeLoad(fs.readFileSync(this.jotFile, 'utf8'));
			
			this.log('[loadJots] loaded data:', doc);
			
			if(!doc){ 
				this.log('[loadJots] Empty doc loaded. Setting defult...');
				doc = {};
			}

			this.content = doc;
			return this.content;
		} 
		catch (e) {
			this.log('[loadJots] There was a problem reading the file. It seems to be corrupted in some way. Run "jotr --list --debug" to display the error message', {level:LOGLEVEL.INFO});
			this.log('[loadJots] Error message:', e);
			process.exit(1);
		}
	}

	getRaw(){
		return fs.readFileSync( this.jotFile, 'utf8');
	}

	saveRaw(raw){
		fs.writeFileSync(this.jotFile,raw);
	}

	getJots(tags){
		this.log('[getJots] Function called with tag:',tags);
		if(!tags || tags.length == 0){
			this.log('[getJots] No tags supplied to getJots, returning all jots.');

			let buffer = yaml.safeDump(this.content);
			this.log('[getJots] Yaml dump: %s Type: %s', buffer, typeof buffer);

			return buffer;
		}

		let buffer = {};
		for( let tag in Object.keys(tags)){
			this.log('[getJots] Checking for tag %s in this.content', tag);
			if(this.content[tag]){
				this.log('[getJots] Found tag "%s" with content: ', this.content[tag]);
				buffer[tag] = this.content[tag];
			}
		}
		let output = yaml.safeDump(buffer);
		this.log('[getJots] Outputting',output);
		return output;
	}

	exportJotsToFile(file){
		var ext = file.split('.').pop();
		this.log('[exportJotsToFile] Exporting....');
		this.log('[exportJotsToFile] Extension:', ext);
		let output = '';
		if(ext == 'json'){
			output = JSON.stringify(this.content);
		}
		else if(ext == 'yml'){
			output = yaml.safeDump(this.content);
		}
		else {
			this.log('Unknown extension. jotr currently only supports ".json" and ".yml" files.', {level:LOGLEVEL.INFO});
			process.exit(1);
		}

		try {
			fs.writeFileSync(file, output);
		}
		catch(e){
			this.log('An error occurred writing to the given file. Please check permissions. Run the command again with "--debug" to see the full error message.', {level:LOGLEVEL.INFO});
			this.log('[exportJotsToFile]',e,{level:LOGLEVEL.DEBUG});
		}
	}

	grepJots(term){
		term = term.toLowerCase().trim();
		let entries = Object.entries(this.content);
		this.log('[grepJots] Entries:',entries);

		let buffer = entries.reduce( (collector, entry) => { 
			let [key, value] = entry; 

			if(value.toLowerCase().indexOf(term) >= 0) {

				if(!collector[key]){
					collector[key] = [];
				}

				collector[key].push(value);
				return collector; 
			}
		},{});
		this.log('[grepJots] Grepped jots:',buffer);
		
		let output = yaml.safeDump(buffer);
		this.log('[grepJots] YAML output:',output);

		return output;
	}
}

module.exports = Jot;