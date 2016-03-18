#!/usr/bin/env node

var fs = require('fs');
var net = require('net');
var os = require('os');
var path = require('path');

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('create-component', 'Create a Bootstrap Studio component (.bscomp)')
    .demand(1)
    .example('$0 create-component -i f.json', 'create a component out of the description in the json file')
    .alias('i', 'input')
    .nargs('i', 1)
    .describe('i', 'Provide a JSON definition file as input. If this option is missing, bstudio will read standard input and attempt to parse it as JSON.')
    .argv;


if(argv.input && fs.existsSync(argv.input)){	
	handle(fs.readFileSync(argv.input, 'utf-8'));
}
else {

	// No file was provided. Attempt to read JSON from stdin	
	// Read json from stdin

	var content = '';

	process.stdin.resume();
	process.stdin.on('data', function(buf) {
		content += buf.toString();
	});

	process.stdin.on('end', function() {
		handle(content);
	});

}


function handle(str){

	var definition = null;

	try {
		definition = JSON.parse(str);
	}
	catch(e){
		console.error(e);
		errorAndExit('The provided JSON definition is invalid.');
	}

	if(!definition.name){
		errorAndExit('Missing component name.');
	}

	if(!definition.html){
		errorAndExit('Missing component html.');
	}

	execute({
		type: "create-component",
		path: process.cwd(),
		definition: definition
	});
}

/*definition: {
	name: 'testcli',
	html: '<div class="someclass">this is a test!</div>',
	css: [
		'.someclass{ font-weight:bold; text-decoration:underline;}',
		'div.someclass{ font-size:36px;color:red;}',
	],
	js: ['alert(123);',  'function(){another_test();}'],
	fonts: {
		'Open Sans': 'https://fonts.googleapis.com/css?family=Open+Sans:400,700',
		'Paleo Diet': 'https://fonts.googleapis.com/css?family=Paleo:400,700'
	},
	images: ['/home/martin/Pictures/wsj-paywall.png']
}
*/

function execute(command) {

	var socket = process.platform === 'win32' ?
				 '\\\\.\\pipe\\bootstrapstudio-sock' : 
				 path.join(os.tmpdir(), 'bootstrapstudio.sock');

	var client = net.connect({ path: socket }, function () {

		client.write(JSON.stringify(command));
		client.end();

	}).on('error', function (err) {
		errorAndExit('Bootstrap Studio is not running. Please start it.');
	});
};

function errorAndExit(message){
	console.error(message);
	process.exit(1);	
}