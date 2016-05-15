//so I can use .last() method to return last element in javascript array
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

//init angular app
app = angular.module('rPOSkitchen', [])
  .controller('rPOSkitchenController', function() {
    var rPOS = this;
    
    var rightnow = new Date();
    
    //test order to start
    rPOS.orderList = [{name:'item1',
                      section:'cold',
                      time: 'Thu Jan 01 1970 00:44:39 +0000'},
                      {name:'item2',
                      section:'hot',
                      time: rightnow},
                      {name:'item3',
                      section:'hot',
                      time: rightnow}];
    
    rPOS.orderView = rPOS.orderList;
    rPOS.view = 'all';
    
    rPOS.deleteItem = function(item){
        //Find and remove item from array
        var i = rPOS.orderList.indexOf(item);
        if(i != -1) {
            rPOS.orderList.splice(i, 1);
        };
        var i = rPOS.orderView.indexOf(item);
        if(i != -1) {
            rPOS.orderView.splice(i, 1);
        };
    };
    
    
    rPOS.addSampleItem = function(){
        var rightnow = new Date();
      rPOS.orderList.push({name:'item1',
                      section:'cold',
                      time:rightnow},
                      {name:'item2',
                      section:'hot',
                      time:rightnow});
      rPOS.currentView(rPOS.view);
    };
    
    rPOS.currentView = function(section){
        rPOS.orderView = [];
        rPOS.view = section;
        
        if (rPOS.view == 'all') {
            rPOS.orderView = rPOS.orderList;
            
        } else {
            var arrayLength = rPOS.orderList.length;
            for (var i = 0; i < arrayLength; i++) {
                if (rPOS.orderList[i].section == section) {
                    //code
                    rPOS.orderView.push(rPOS.orderList[i])
                };
            };
            
        };
        
        
    };
    
    

  //end of angular controller
  });

// to play nice with jinja2 template
app.config(['$interpolateProvider', function($interpolateProvider) {
     $interpolateProvider.startSymbol('{[{');
     $interpolateProvider.endSymbol('}]}');
   }]);

