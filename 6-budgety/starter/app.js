
// BUDGET CONTROLLER
var budgetCocmtroller = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
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
    };
    return {
        getinput: function() {
            return {
                type : document.querySelector(DOMStrings.inputType).value,
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : document.querySelector(DOMStrings.inputValue).value
            };
        },
        addListItem: function(obj, type) {
            // Create HTML string with placeholder text
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html =
                '<div class="item clearfix" id="income-%id%">' +
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
                '<div class="item clearfix" id="expense-%id%">' +
                '<div class="item__description">%description%</div>' +
                '<div class="right clearfix">' +
                    '<div class="item__value">- %value%</div>' +
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
            newHtml = newHtml.replace('%value%', obj.value);
            // Inser HTML to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    };

    var ctrlAddItem = function() {
        console.log('add item');
        // получить данные о доходах-расходах из dom
        var input, newItem;
        input = UICtrl.getinput();
        console.log(input);

        //add item to budget controller
        newItem = budgetCocmtroller.addItem(input.type, input.description, input.value);
        console.log(newItem);

        //add item to UI
        UIController.addListItem(newItem, input.type);
        //calc the budget

        // display the budget on the UI
    }

    return {
        init: function() {
            console.log('init');
            setupEventListeners();
        }
    }
    

})(budgetCocmtroller, UIController);


controller.init();
