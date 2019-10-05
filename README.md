# Subject Log
A vanilla es6 micro-library for console logging with arbitrary subjects.
## Stats
 - ~100 lines of code
 - ~3Kb verbose
 - ~1.3Kb minified
## Usage
### Importing the library
SubjectLog is a standard ES6 module so it can be imported like any other module:
```javascript
import SubjectLog from 'path/to/subject-log.js';
```
### Basic library usage
`SubjectLog` is a static library with two static methods and two static properties. All access to `SubjectLog` is done through those static methods or via the `console` object, itself.
### Defining the subjects
"Subjects" are a simple string identifiers that describe what your logs are referencing.
These subjects allows devs to turn certain logs on and off, by the subject. So, instead of pulling logs out of your project, you simply tell the subject that it shouldn't be logged, and SubjectLog prevents the log command automatically.

To add subjects, simply call `createSubjects` and pass in an array of strings that will act as your subjects. These can be broken down by page, functionality, log level, or any other way you would like to break up your logging.
```javascript
SubjectLog.createSubjects(['api', 'home', 'payment processing', 'todo']);
```
### Logging to a Subject
Once you have established subjects, you log to those subjects by accessing the `console` object's `log` method.
```javascript
SubjectLog.createSubjects(['api', 'home', 'payment processing', 'todo']);

console.log['api']("My log message"); // output: " My log message"
console.log['home']("My log message"); // output: " My log message"
console.log['payment processing']("My log message"); // output: " My log message"
console.log['todo']("My log message"); // output: " My log message"
```
### Setting the subject state
After your subjects have been defined, you can control whether or not each subject's log messages will be written to the console via the subject state. By default, all of your subject states are set to `true`. This means that any messages for that subject will be written to the console. If you want to prevent those messages from being written to the console, you will need to set the subject state to `false`.
You can achieve this either by using the `setSubjectState` helper method, or by directly accessing the `logStates` property of the `SubjectLog` library.
```javascript
SubjectLog.setSubjectState('api', true); // this will make the 'api' subject's logs be written to the console.
SubjectLog.setSubjectState('api', false); // this will prevent the 'api' subject's logs from being written to the console.

SubjectLog.logStates['home'] = true; // this will make the 'home' subject's logs be written to the console.
SubjectLog.logStates['home'] = false; // this will prevent the 'home' subject's logs from being written to the console.
```
### Global Subjects
In order to facilitate quickly showing or removing all logging throughout a project, the SubjectLog introduces two global subjects called `all` and `silent`. These two states serve as quick overrides to the subject logging.
##### `all`
The `all` state overrides any other subject and will tell every subject to log when called. This means that if you set the `home` subject state to `false`, but have the `all` state set to true, the `home` logs will still be written to the console.
#### `silent`
The `silent` state overrides every other subject state **including `all`**. When the `silent` subject state is set to `true`, no subjects will be logged to the console, at all. This state is intended to be used while code is running in production, to prevent any extraneous logs from getting written to the console, without having to set all of your subject states to `false`.
### Default Logging
One thing that is important to note is that the `SubjectLog` library **does not** override the `console.log` method. This means that `console.log` can be used like you've always used it.
It *also* means that if you set your `silent` state to `true`, it won't have any effect on the `console.log` method. As stated, the `SubjectLog` library does not, in any way, interfere with the `console.log` method.
### Prefixing the subject logs
If you would like to add a prefix to any logs that use your subjects, just include it as the second parameter for `createSubjects`.
For static strings, SubjectLog will just prepend the prefix string. But if you want it to prefix it with the subject name, just use the `%subject` keyword.
```javascript
SubjectLog.createSubjects(['api', 'home', 'payment processing', 'todo'], 'foo:');
console.log['api']('This is an API log.'); // output: "foo: This is an API log."

SubjectLog.createSubjects(['api', 'home', 'payment processing', 'todo'], 'Log for %subject:');
console.log['api']('Hello World.'); // output: "Log for api: Hello World."
console.log['home']('Hello World.'); // output: "Log for home: Hello World."
```
## FAQ
### Why are subjects better than log levels? 
There's absolutely NOTHING wrong with log levels. In fact, a really nice upgrade for this library would be to include functionality for warn and info logging.
That said, I've found good reasons to use subjects when working with teams. Using the subject states, I can prevent myself from seeing other devs' logs while we're both working on the project. By setting up local environment variables, you can make sure that the console only reflects the logging that any one dev is interested in, cutting out all other noise that is only useful to other team members.

`SubjectLog` is absolutely NOT a replacement for log levels (though, you can set your subjects to be log levels, for easy on/off support for those). Subjects and levels work together to make development more focused.
### Why is this better than a simple wrapper function? 
The issue with calling `console.log` from anywhere else in an application is that the DevTools will only point you to the exact line that `console.log` was called from. This means that if you write a wrapper function for `console.log`, you lose the functionality of being able to just click on your log message and be taken to the site of the log in your source code.

With `SubjectLog`, you retain that functionality. All subject logs will link you to the place in your source code where the log was called from. You also avoid any training that comes with using wrapper functions (i.e. you don't have to tell the new team member "we don't use console.log, we use log.info" or whatever), because `console.log` still works.
### Couldn't you use something like `console.trace` to get back to the source stack?
You can! If that works for you then, by all means, use that instead! Save the 3Kb hit on your users!
My *personal* problem with `console.trace` is that it doesn't have a way to allow you to force it to log in a 'collapsed' way. So, in using for an entire project, the console is just inundated with these huge blocks of stack traces. It doesn't really help me do what I'm trying to do. But, like I said, if it works for you, it's absolutely a perfectly fine method!
### Okay, but you can wrap a `console.trace` call in a `console.groupCollapsed` call, and that will solve the problem.
Using `console.groupCollapsed` is...
It definitely works. If that functionality fits, again, by all means use it. What I don't like about that is that the top-level logging that happens in a `groupCollapsed` call doesn't parse the additional variables. Consider this:
```javascript
let myObject = {name: 'Alice'};
console.log('%s: %o', 'This will output an inspectable object', myObject); // In the console, you'll see the log message, and the object can be inspected.

console.groupCollapsed('%s: %o', 'This will output a simple string', myObject); // In the console, you'll see this: %s: %o.
console.trace('%s: %o', 'This will output a simple string', myObject) // HERE is where you'll be able to see your parsed object, with a big ol' stack trace. But that means you have to open the collapsed group, which kind of defeats the purpose?
console.groupEnd();
```
Given that, I didn't find it to be a suitable solution for my needs.
## Compatability
Tested and working in modern versions of the following browsers:
- Chrome
- Firefox
- Edge
## Demo
A live demo can be viewed on [Codepen](https://codepen.io/the1076/pen/VwwwedV) and a single-page version of the demo is included in this repo as "test.html".