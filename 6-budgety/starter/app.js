
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
})();

// UI CONTROLLER
var UIController = (function() {
    // code
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    };
    return {
        getinput: function() {
            return {
                type : document.querySelector(DOMStrings.inputType).value,
                description : document.querySelector(DOMStrings.inputType).value,
                value : document.querySelector(DOMStrings.inputValue).value
            };
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
        var input = UICtrl.getinput();
        console.log(input);
        //add item to budget controller

        //add item to UI

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
