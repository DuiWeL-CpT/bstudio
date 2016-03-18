# bstudio - CLI for Bootstrap Studio

`bstudio` is a node.js command line application which presents an interface to
[Bootstrap Studio](https://bootstrapstudio.io/) through the command line. It's
purpose is to automate various tasks like automatically generating Bootstrap
Studio components (.bscomp files) from scripts.

You need to have Bootstrap Studio running on the same computer in order to use
this utility. The communication happens through a UNIX domain socket (under 
Linux and OS X) or through a named pipe (under Windows).

## Installation

The script is available on npm. To install it:

```sh
npm install -g bstudio
```

This will create a global `bstudio` command which you can call from the
terminal.

`bstudio` doesn't export any library functions currently, so there is no 
point in `require()`-ing it in node.js scripts.

## Usage

The utility is structured around passing commands to Bootstrap Studio. To run
it, call `bstudio` from your terminal while passing one of the available 
commands:

```sh
bstudio <command> [options]
```

The only command implemented right now is `create-component`, for 
programatically generating **.bscomp** files. More will be added in the future 
according to user feedback.

## Examples

### Generating .bscomp files

Generating **.bscomp** files is done with the `create-component` command:

```sh
bstudio create-component -i definition.json

# Alternatively, omit the -i flag and pass the json through stdin:
# cat definition.json | bstudio create-component
```

The resulting **.bscomp** file will be placed in the current working directory.

**definition.json** is a specially structured JSON file that, as a 
minimum, has the following structure:

```json
{
  "name": "My Sweet Component",
  "html": "<p>The HTML of your component.</p>"
}
```

If you wish to add CSS, JS, fonts or images to your component, you can add
these to the JSON:

```json
{
  "name": "My Sweet Component",
  "html": "<p class=\"custom\">The HTML of your component.</p>",
  "js": [ "alert(1);" ],
  "css": [ ".custom { font-size:20px;color:red; }" ],
  "fonts": { 
    "Open Sans": "https://fonts.googleapis.com/css?family=Open+Sans:400,700"
  },
  "images": [ "/path/to/image.png" ]
}
```

You can add more values to the arrays if you wish your component to contain 
multiple files of that type. The **images** array should contain paths to 
images on your computer. If you are on Windows, this path should look like
`C:\\Users\\xxxx\\picture.jpg`.

## Reporting bugs and issues

To report bugs or ask for help, use our [forum](https://bootstrapstudio.io/forums/).

## License

Released under the MIT license. 

Zine EOOD (c) 2016