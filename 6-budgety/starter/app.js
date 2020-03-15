
// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    };

    return {
        addItem: function(type, des, val) {
            var newItem, allItems, ID;
            allItems = data.allItems[type];
            if (allItems.length > 0) {
                ID = allItems[allItems.length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },
        deleteItem: function(type, id) {
            var IDs, index;
            var IDs = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = IDs.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function() {
            // calc totals inc exp
            calculateTotal('inc');
            calculateTotal('exp');

            // calc budget inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            // calc % of spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return {
                    id: cur.id,
                    value: cur.getPercentage()
                }
            });
            return allPerc;
        },
        testing: function() {
            console.log(data);
        },
    };
})();

// UI CONTROLLER
var UIController = (function() {
    // code
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    };

    var formatNumber = function(type, num) {
        // 1234.567 -> + 1,234.57
        var int, dec, numSplit, numWithComma, strLen, sign;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        var strLen = int.length;
        numWithComma = '';
        // 12345678 12,345,678
        while (strLen > 3) {
            numWithComma += ',' + int.substr(int.length - 3, int.length);
            int = int.substr(0, int.length - 3);
            strLen -= 3;
        }
        numWithComma = int + numWithComma;
        dec = numSplit[1];
        type == 'exp' ? sign = '-' : sign = '+'; 
        
        return sign + ' ' + numWithComma + '.' + dec;
    };

    return {
        getinput: function() {
            return {
                type : document.querySelector(DOMStrings.inputType).value,
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        addListItem: function(obj, type) {
            // Create HTML string with placeholder text
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html =
                '<div class="item clearfix" id="inc-%id%">' +
                '<div class="item__description">%description%</div>' +
                '<div class="right clearfix">' +
                    '<div class="item__value">%value%</div>' +
                    '<div class="item__delete">' +
                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                '</div>' +
                '</div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html =
                '<div class="item clearfix" id="exp-%id%">' +
                '<div class="item__description">%description%</div>' +
                '<div class="right clearfix">' +
                    '<div class="item__value">%value%</div>' +
                    '<div class="item__percentage">21%</div>' +
                        '<div class="item__delete">' +
                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }
            // Replace placeholder text with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(type, obj.value));
            // Inser HTML to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function(selectorID) {
            var itemDOM = document.getElementById(selectorID);
            itemDOM.parentNode.removeChild(itemDOM);
        },
        clearFields: function() {
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            //document.querySelectorAll('.add__description, .add__value')
            fields.forEach(function(current, index, array) {
                current.value = "";
            });
            fields[0].focus();
        },
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(type, obj.budget);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber('inc', obj.totalInc);
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber('exp', obj.totalExp);
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }
        },
        displayPercentages: function(persentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            // document.querySelectorAll('.item__percentage')[1].parentNode.parentNode.id;
            fields.forEach(function(cur) {
                var id, value;
                id = cur.parentNode.parentNode.id.split('-')[1];
                for(var i = 0; i < persentages.length; i++) {
                    if (persentages[i].id == id) {
                        value = persentages[i].value;
                        break;
                    }
                }
                if (value > 0) {
                    cur.textContent = value + '%';
                } else {
                    cur.textContent = '--';
                }
            });
        },
        
        getDOMStrings: function() {
            return DOMStrings;
        }
    };
})();

// APP MAIN CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            };
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    

    var ctrlAddItem = function() {
        console.log('add item');
        // получить данные о доходах-расходах из dom
        var input, newItem;
        input = UICtrl.getinput();
        console.log(input);

        //input control
        if (input.description.trim() === '' || isNaN(input.value) || input.value <= 0) {
            return
        }

        //add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        console.log(newItem);

        //add item to UI
        UIController.addListItem(newItem, input.type);

        //claer input fields
        UIController.clearFields();

        // calculate and update budget
        updateBudget();
        updatePercentages();

    };

    var updateBudget = function() {
        //calc the budget
        budgetCtrl.calculateBudget();
        
        // return the budget
        var budget = budgetCtrl.getBudget();
        console.log(budget);
        // display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // del item from data
            budgetCtrl.deleteItem(type, ID);

            // del item from UI
            UICtrl.deleteListItem(itemID);

            // update and show new budget
            updateBudget();
            updatePercentages();
        }

    };
    
    var updatePercentages = function() {
        // calc percentages
        budgetCtrl.calculatePercentages();

        // get persentages from budgetController
        var persentages = budgetCtrl.getPercentages();
        console.log(persentages);

        // update UI with new percentages
        UICtrl.displayPercentages(persentages);
    };

    return {
        init: function() {
            console.log('init');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });
            setupEventListeners();
        }
    }
    

})(budgetController, UIController);


controller.init();
