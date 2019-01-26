# Using jotr in your own project

**[HOME](README.MD)**

If you want to use the core of jotr in your own project, you can. There's really nothing much to it, but nothing warms our hearts more than if you find some value in it.

To include it in your project, you need to require the `Jot.js` file, not the `index.js` file, as the latter one deals with the cli directly, and is not made to be used externally, as of now at least.

This will give you access to the reading and writing of jots to and from a file of your choosing.

## Contruction

The constructor takes exactly one parameter, the file to work with.

```javascript
const Jot = require('jotr/Jot');
let jot = new Jot('path/to/my/file.yml');
```

Under the covers, this uses `fs.readFileSync()` and `fs.writeFileSync()` to do the work. It reads the entire file, converts from YAML to a JavaScript object on read, and back on write.

## Reading

The Jot-class provides several methods for getting data from the file and from the stored instance.

>### **getRaw()** : _String_

This method just reads the YAML-file anr returns the content as a string. The file it reads is the one suplied when the instance was created.

>### **loadJots()** : _Object_

This method wraps the `getRaw()` method, and parses the YAML, storing it in the instance. It also returns the content stored. If the YAML-file is empty, an empty object is stored and returned.

>### **getJots( [tags] )** : _String_

This method converts the internal JavaScript object representation of the jots' data structure, into a YAML-formatted string and returns it.

If you supply one or more tags, the output is filtered, returning only the jots sorted under those tags.

The method input can be either an array of one or more strings, or a single string. Each string is treated as a single tag.

>### **grepJots( \<term\> )** : _String_

This method takes the loaded jots, searches them for the supplied term, and returns the result, in YAML-formatted text. It does not search the tags for the term.

>### **getTags()** : _Array_

This method simply returns the `Object.keys()` array of the data object holding the loaded jots.

## Writing

As with reading, writing also comes in different flavours.

>### **saveRaw( \<content\>, [file] )**

This method saves `content` in the given `file`, or in the file given when the instance was created, if `file` is not supplied. This overwrites anything already present in the file.

>### **saveJots( \<tags\>, \<jot\> )**

This method adds the given jot to the given tags before saving the data to the YAML-file.

>### **exportJotsToFile( \<file\> )**

This method lets you export the data to a file of your choosing. It supports both JSON and YAML, and determins the format based on the file extension given.

## A note on debugging

The object `Jot` also contains a method for logging to stdout, called log. This uses an environment variable to determine if it is in debug-mode, as well as an optional options object defining a log level for the given log message.

```javascript
const Jot = require('jotr/Jot');
let jot = new Jot('myData.yml');
...
// Defaults to LOGLEVEL.DEBUG
jot.log('A debug only log message');
...
jot.log('An informational message the user needs to see', {level:jot.LOGLEVEL.INFO});
```

Apart from the optional last parameter, the method just pipes the arguments through to `console.log`.

>**_Note:_** If you have an object as the last parameter which you want to log, and that object contains the key `level`, you need to explicitly set the debug level with.

```javascript
...
let character = {
    hitpoints: 50,
    level:20,
    name:'Jotr, the barbarian'
};

jot.log('Some message', character, {level: jot.LOGLEVEL.DEBUG});
...
```
