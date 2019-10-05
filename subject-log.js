// author: 1076
// license: MIT
// source: https://github.com/the1076/subject-log
export default class SubjectLog
{
    static get logStates()
    {
        if(window.__subjectLogStates__ == null)
        {
            window.__subjectLogStates__ = { silent: false };
        }
        return window.__subjectLogStates__;
    }

    static get logPrefix() { return window.__subjectLogPrefix__ || ''; }
    static set logPrefix(value) { window.__subjectLogPrefix__ = value; }

    static createSubjects(logSubjects, prefix)
    {
        let subjects = _sanitizeLogSubjects(logSubjects);

        if(prefix != null) { SubjectLog.logPrefix = prefix; }
        
        for(let i = 0; i < subjects.length; i++)
        {
            let subject = subjects[i];
            Object.defineProperty(console.log, subject, 
            {
                get()
                {
                    // #business-logic
                    // if you want to change how the subject log evaluates whether to log or not, just edit this function.
                    // it MUST return a function, so I just return a function that does nothing, if the subject isn't to be logged.
                    if(SubjectLog.logStates.silent == true) { return function(){}; }

                    let prefix = SubjectLog.logPrefix.replace(/%subject/g, subject);
                    if(SubjectLog.logStates.all === true)
                    {
                        return Function.prototype.bind.call(console.log, console, prefix);
                    }

                    let gate = SubjectLog.logStates[subject.toLowerCase()];
                    if(gate == null)
                    {
                        console.warn(`Unknown log subject provided: ${subject}`);
                        return function(){};
                    }

                    if(gate == false)
                    {
                        return function(){};
                    }

                    return Function.prototype.bind.call(console.log, console, prefix);
                }
            });
            SubjectLog.logStates[subject] = (subject !== 'all') ? true : false;
        }
    }

    static setSubjectState(name, state)
    {
        SubjectLog.logStates[name] = (state === true) ? true : false;
    }
}

function _sanitizeLogSubjects(logSubjects)
{
    if(logSubjects == null)
    {
        return [];
    }

    if(!Array.isArray(logSubjects))
    {
        if(Object.prototype.toString.call(logSubjects) !== "[object String]")
        {
            logSubjects = [logSubjects];
        }
        else
        {
            throw new Error('The logSubjects must be an array of strings.');
        }
    }

    logSubjects.map((value) =>
    {
        if(Object.prototype.toString.call(value) !== "[object String]")
        {
            throw new Error('All log subjects must be of the type "string".');
        }
        return value.toLowerCase();
    });

    if(logSubjects.indexOf('all') == -1)
    {
        logSubjects.unshift('all');
    }

    return logSubjects;
}