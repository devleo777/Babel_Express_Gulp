import { forms } from "./forms.js";

const validation = {};

validation.regex = {
    empty: /\w/,
    email: /^\S+@\S+\.\S+$/
};

validation.required = (elements) => {
    
    for (let i=0; i<elements.length; i++)
    {
        if (elements[i].classList.contains("required")) 
        {
            if (!validation.regex.empty.test(elements[i].value))
            {
                if (validation.siblings(elements[i])[0])
                {
                    let errors = validation.siblings(elements[i])[0];
                    errors.classList.add('invalid-feedback');
                }
                elements[i].classList.add('is-invalid');
            }
            else
            {
                if (validation.siblings(elements[i])[0])
                {
                    let errors = validation.siblings(elements[i])[0];
                    errors.classList.remove('invalid-feedback');
                }
                elements[i].classList.remove('is-invalid');
            }
        }
        if (elements[i].classList.contains("email")) 
        {
            if (!validation.regex.email.test(elements[i].value))
            {
                if (validation.siblings(elements[i])[0])
                {
                    let errors = validation.siblings(elements[i])[0];
                    errors.classList.add('invalid-feedback');
                }
                elements[i].classList.add('is-invalid');
            }
            else
            {
                if (validation.siblings(elements[i])[0])
                {
                    let errors = validation.siblings(elements[i])[0];
                    errors.classList.remove('invalid-feedback');
                }
                elements[i].classList.remove('is-invalid');
            }
        }
    }

};

validation.siblings = function (e) 
{
    let siblings = []; 
    if(!e.parentNode) 
    {
        return siblings;
    }
    let sibling  = e.parentNode.firstChild;
    while (sibling) 
    {
        if (sibling.nodeType === 1 && sibling !== e) 
        {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};

validation.flag = (elements) => {

    var flag = true;

    for (let i=0; i<elements.length; i++)
    {
        if (elements[i].classList.contains("required")) 
        {
            if (!validation.regex.empty.test(elements[i].value))
            {
                flag = false;
            }
        }
        if (elements[i].classList.contains("email")) 
        {
            if (!validation.regex.email.test(elements[i].value))
            {
                flag = false;
            }
        }
    }

    return flag;

};

validation.init = () => {

    const _forms = document.getElementsByTagName('form');
    
    for (let form of _forms)
    {
        form.addEventListener('click', (event) => {

            const elements = form.getElementsByClassName('required');

            validation.required(elements);
              
            if (validation.flag(elements))
            {
                if (typeof forms[form.id] === 'function') forms[form.id]({ form: form });
            }

        });
    }

};

export { validation }