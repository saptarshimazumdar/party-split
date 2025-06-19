const FORM_GROUP_NAMES = 'form-group-names';
const FORM_GROUP_NAMES_PERSONS = 'persons';
const FORM_GROUP_NAMES_DISPLAY = 'added-names';
const NAME_CONTAINER = 'names-container';
const EXPENSES_CONTAINER = 'expenses-container';
const PAID_BY= 'paid-by';


const formGroupName = document.getElementById(FORM_GROUP_NAMES);
formGroupName.addEventListener('submit', function(event$) {
    event$.preventDefault();
    const stakeholders = event$.target.elements[FORM_GROUP_NAMES_PERSONS].value?.split(',')
        .filter(name => !!name).map(name => name.trim());
    
    var existingObject = localStorage.getItem('split');
    if (existingObject) {
        existingObject = JSON.parse(existingObject);
    } else {
        existingObject = {};
    }
    
    if(stakeholders && stakeholders.length) {
        localStorage.setItem('split', JSON.stringify(stakeholders.reduce((acc, name) => {
            acc[name] = { name, items: [] };
            return acc;
        }, existingObject)));
    } else {
        alert('Please enter at least one stakeholder name.');
    }
    event$.target.elements[FORM_GROUP_NAMES_PERSONS].value = '';
    setStakeholders();
})

const getAvailableStakeholders = () => {
    const existingObject = localStorage.getItem('split');
    if (existingObject) {
        return Object.values(JSON.parse(existingObject)).map(item => item.name);
    }
    return [];
}

const setStakeholders = () => {
    document.getElementById(FORM_GROUP_NAMES_DISPLAY)
        .getElementsByTagName('tbody')[0].innerHTML = getAvailableStakeholders()
        .map(name => `
            <tr>
                <td>${name}</td>
                <td class="column-action" onclick="removeStakeholders('${name}')">&#x2717;</td>
            </tr>
        `).join('\n');
}

const setPaidBy = () => {
    document.getElementById(PAID_BY)
        .innerHTML = getAvailableStakeholders()
        .map(name => `
            <option value="${name}">${name}</option>
        `).join('\n');
}

const setDividedAmong = () => {
    const availableStakeholders = getAvailableStakeholders();
    document.getElementById('divided-among')
        .innerHTML = availableStakeholders
        .map(name => `
            <span class="stakeholder">
                <input type="checkbox" id="${name}-payee-id" name="${name.toLowerCase()}-payee" value="${name}">
                <label for="${name.toLowerCase()}-payee-id">${name}</label>
            </span>
        `).join('\n');
}

const removeStakeholders = (name) => {
    const existingObject = localStorage.getItem('split');
    if (existingObject) {
        const splitData = JSON.parse(existingObject);
        delete splitData[name];
        localStorage.setItem('split', JSON.stringify(splitData));
        setStakeholders();
    } else {
        alert('No stakeholders found to remove.');
    }
}

const addExpenses = () => {
    document.getElementById(NAME_CONTAINER).classList.add('hide');
    document.getElementById(EXPENSES_CONTAINER).classList.remove('hide');
    setTimeout(() => {
        document.getElementById(NAME_CONTAINER).style.display = 'none';
        document.getElementById(EXPENSES_CONTAINER).style.display = 'inherit';
    }, 25);
}

const toggleDividedAmong = (event$) => {
    document.getElementById('divided-among').classList.toggle('remove-from-screen', !!Number(event$.value));
}

const editNames = () => {
    document.getElementById(NAME_CONTAINER).classList.remove('hide');
    document.getElementById(EXPENSES_CONTAINER).classList.add('hide');
    setTimeout(() => {
        document.getElementById(NAME_CONTAINER).style.display = 'inherit';
        document.getElementById(EXPENSES_CONTAINER).style.display = 'none';
    }, 25);
}

setStakeholders();
setPaidBy();
setDividedAmong();