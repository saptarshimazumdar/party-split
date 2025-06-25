const FORM_GROUP_NAMES = 'form-group-names';
const FORM_GROUP_NAMES_PERSONS = 'persons';
const FORM_GROUP_NAMES_DISPLAY = 'added-names';
const NAME_CONTAINER = 'names-container';
const EXPENSES_CONTAINER = 'expenses-container';
const PAID_BY = 'paid-by';
const EXPENSE_FORM = 'form-group-expenses';
const EXPENSE_LIST_TABLE_BODY = 'expense-list-table-body';


const formGroupName = document.getElementById(FORM_GROUP_NAMES);
const expenseFormGroup = document.getElementById(EXPENSE_FORM);
const expenseListTableBody = document.getElementById(EXPENSE_LIST_TABLE_BODY);
const nameContainer = document.getElementById(NAME_CONTAINER);
const expenseContainer = document.getElementById(EXPENSES_CONTAINER);
const dividedAmong = document.getElementById('divided-among');
const paidBy = document.getElementById(PAID_BY);


formGroupName.addEventListener('submit', function (event$) {
    event$.preventDefault();
    const stakeholders = event$.target.elements[FORM_GROUP_NAMES_PERSONS].value?.split(',')
        .filter(name => !!name).map(name => name.trim());

    var existingObject = localStorage.getItem('split');
    if (existingObject) {
        existingObject = JSON.parse(existingObject);
    } else {
        existingObject = {};
    }

    if (stakeholders && stakeholders.length) {
        localStorage.setItem('split', JSON.stringify(stakeholders.reduce((acc, name) => {
            acc[name] = { name, spend: [], expense: [] };
            return acc;
        }, existingObject)));
    } else {
        alert('Please enter at least one stakeholder name.');
    }
    event$.target.elements[FORM_GROUP_NAMES_PERSONS].value = '';
    setStakeholders();
});

expenseFormGroup.addEventListener('submit', function (event$) {
    event$.preventDefault();
    const response = [...event$.target.elements].reduce((acc, el) => {
        if (el.type === 'checkbox') {
            if (el.checked) {
                acc.individual.push(el.value);
            }
        } else if (el.name === 'contribution') {
            acc['equal'] = Boolean(Number(el.value));
        } else {
            acc[el.name] = el.value;
        }
        return acc;
    }, ({
        individual: []
    }))
    processExpense(response);
    closeExpenseForm();
});

expenseFormGroup.addEventListener('reset', function () {
    closeExpenseForm();
});


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
    paidBy.innerHTML = getAvailableStakeholders().map(name => `
            <option value="${name}">${name}</option>
        `).join('\n');
}

const setDividedAmong = () => {
    dividedAmong.innerHTML = getAvailableStakeholders().map(name => `
            <span class="stakeholder">
                <input type="checkbox" id="${name.toLowerCase()}-payee-id" name="${name.toLowerCase()}-payee" value="${name}">
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
    nameContainer.classList.add('hide');
    expenseContainer.classList.remove('hide');
    setTimeout(() => {
        nameContainer.style.display = 'none';
        expenseContainer.style.display = 'inherit';
    }, 25);
    fillExpenseTable();
}

const toggleDividedAmong = (event$) => {
    dividedAmong.classList.toggle('remove-from-screen', !!Number(event$.value));
}

const editNames = () => {
    nameContainer.classList.remove('hide');
    expenseContainer.classList.add('hide');
    setTimeout(() => {
        nameContainer.style.display = 'inherit';
        expenseContainer.style.display = 'none';
    }, 25);
}

const closeExpenseForm = () => {
    expenseFormGroup.reset();
    closeModal();
}

const processExpense = (response) => {
    const existingObject = localStorage.getItem('split');
    if (existingObject) {
        const splitData = JSON.parse(existingObject);
        const { payer, item, price, individual, equal } = response;
        const everyone = equal ? Object.keys(splitData) : individual;
        const amount = divideMoney(price, everyone.length);
        splitData[payer].spend.push({
            id: uuid.v4(),
            item,
            price: Number(price)
        });
        everyone.forEach(name => {
            splitData[name].expense.push({
                id: uuid.v4(),
                item,
                price: Number(amount)
            });
        });

        localStorage.setItem('split', JSON.stringify(splitData));
        populateExpense(response, everyone);
    } else {
        alert('No stakeholders found to process the expense.');
    }
    fillExpenseTable();
}

const populateExpense = (response, everyone) => {
    var existingObject = localStorage.getItem('expenses') || `[]`;
    const { payer, item, price, equal } = response;
    existingObject = JSON.parse(existingObject);
    existingObject.unshift({
        id: uuid.v4(),
        payer,
        item,
        price: Number(price),
        individual: everyone,
        equal: Boolean(Number(equal)),
        lastChanges: new Date().getTime()
    });
    localStorage.setItem('expenses', JSON.stringify(existingObject));
}

const fillExpenseTable = () => {
    const existingObject = localStorage.getItem('expenses');
    var template = `
            <tr>
                <div class="no-expenses">No expenses recorded yet.</div>
            </tr>
        `;
    if (existingObject) {
        const expenses = JSON.parse(existingObject);
        if (expenses.length >= 0) {
            template = expenses.map(expense => `
                <div class="expense-list-table-item">
                    <div class="line">
                        <span class="expense-list-table-item-name">
                            <strong>${expense.item}</strong>
                        </span>
                        <span class="expense-list-table-item-amount">
                            <small>&#8377;${expense.price}</small>
                        </span>
                    </div>
                    <div class="line">
                        <span class="expense-list-table-item-paid-by">
                            <small>${expense.payer}</small>
                        </span>
                    </div>
                </div>
            `).join('\n');
        }
    }

    expenseListTableBody.innerHTML = template;
}

setStakeholders();
setPaidBy();
setDividedAmong();