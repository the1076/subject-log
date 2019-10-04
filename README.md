# Subject Log
A vanilla es6 micro-library for console logging with arbitrary subjects.

## Stats
 - ~100 lines of code
 - xKb verbose
 - xKb minified

## Usage
### Importing the library
SubjectLog is a standard ES6 module so it can be imported like any other module:
```javascript
import SubjectLog from 'path/to/subject-log.js';
```
### Setting up the subjects
"Subjects" are a simple string identifiers that describe what your logs are referencing.
These subjects allows devs to turn certain logs on and off, by the subject. So, instead of pulling logs out of your project, you simply tell the subject that it shouldn't be logged, and SubjectLog prevents the log command automatically.

To add subjects, simply call `createSubjects` and pass in an array of strings that will act as your subjects. These can be broken down by page, functionality, log level, or any other way you would like to break up your logging.
```javascript
SubjectLog.createSubjects(['api', 'home', 'payment processing', 'todo']);
```