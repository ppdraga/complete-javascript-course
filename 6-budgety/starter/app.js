var budgetCocmtroller = (function() {

    var x = 23;

    var add = function (a) {
        return x + a
    }

    return {
        publicTest: function(b) {
            console.log(add(b));
        }
    }

})();

var UIController = (function() {
    // code
})();

var controller = (function(budgetCtrl, UICtrl) {


})(budgetCocmtroller, UIController);
