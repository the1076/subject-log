//Imports
import SubjectLog from './subject-log.js';


let $toLog = document.querySelector('input.to-log');
let $type = document.querySelector('select.type');
let $log = document.querySelector('button.log');
let $listening = document.querySelector('ul.listening');
let $output = document.querySelector('textarea.output');

//Startup
document.addEventListener('DOMContentLoaded', Document_OnContentLoaded);
function Document_OnContentLoaded()
{
    document.removeEventListener('DOMContentLoaded', Document_OnContentLoaded);

    let subjects = ['records', 'reports', 'accounting', 'human resources'];
    SubjectLog.createSubjects(subjects);

    let inner = '';
    let checkboxes = '';
    for(let i = 0; i < subjects.length; i++)
    {
        let subject = subjects[i];
        if(subject != 'all')
        {
            inner += `<option value="${subject}">${subject.charAt(0).toUpperCase() + subject.slice(1)}</option>`;
        }
        checkboxes += `<li><label><input type="checkbox" name="subjects" value="${subject}" />${subject.charAt(0).toUpperCase() + subject.slice(1)}</label></li>`;
    }
    inner = `<option value="none">None</option>${inner}`;
    $type.innerHTML = inner;

    $listening.innerHTML = checkboxes;

    $log.addEventListener('click', log_onClick);

    [].map.call($listening.querySelectorAll('input[type="checkbox"]'), ($checkbox) =>
    {
        $checkbox.checked = SubjectLog.logStates[$checkbox.value];
        $checkbox.addEventListener('change', logState_onChange);
    });
}

function log_onClick(event)
{
    if($type.value == 'none')
    {
        console.log($toLog.value);
        return;
    }

    console.log[$type.value]($toLog.value);
}

function logState_onChange(event)
{
    let subject = event.currentTarget.value;
    // either method works. setSubjectLogging is just a helper function.
    // SubjectLog.logStates[subject] = event.currentTarget.checked;
    SubjectLog.setSubjectLogging(subject, event.currentTarget.checked);
}
