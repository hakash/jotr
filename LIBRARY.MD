# Using jotr in your own project

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

## Writing



>### **saveRaw( \<content\>, [file] )**



>### **saveJots( \<tags\>, \<jot\> )**



>### **exportJotsToFile( \<file\> )**



## A note on debugging