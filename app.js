//budget controller
var budgetController = (function(){
  
    var Expence = function(id , description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    Expence.prototype.calcpercentage = function(totalIncome){
        if(data.totals.inc> 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage = -1;
        }
    };
        Expence.prototype.getPercentages = function(){
            return this.percentage;
        };
    var Income = function(id , description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal= function(type) {

        var sum =0 
        data.allItems[type].forEach(function(cur){

            sum += cur.value;
        });
        data.totals[type]= sum;
    };

    var data = {
        allItems: {
            exp:[],
            inc:[]
        },
        totals: {
            exp:0,
            inc:0
        },
         budget: 0,
         percentage: -1
       

    };
        return {
            addItem:function(type,des,val){
                var newItem,ID;

                //[1 2 3 4 5] ID=6;
                //[1 2 4 6 8] ID=9;
                //ID = last  ID +1
                
                //create new ID
                if(data.allItems[type].length > 0){
                    ID= data.allItems[type][data.allItems[type].length -1].id + 1;
                }else {
                    ID = 0;
                }
                
                //create new item based on 'inc' or 'exp'
                if(type === 'exp'){
                    newItem = new Expence(ID,des,val);
                }else if(type === 'inc'){
                    newItem = new Income(ID,des,val);
                }

                //push it into a data structure
                data.allItems[type].push(newItem);

                //return the new element
                return newItem;
            },

                deleteItem:function(type,id){
                    var ids,index;


                    //id =3
                    //data.allItems[type][id];
                    //[1 2 4 6 8]
                    //index = 3

                    ids = data.allItems[type].map(function(current){
                        return current.id;
                    });
                    console.log('ids', ids, 'id',id)
                    index = ids.indexOf(id);

                    if(index!==-1){
                        data.allItems[type].splice(index, 1);
                        console.log('afterdelete');
                        console.log('data', data.allItems[type])
                    }
                },



                calculateBudget: function() {

                    //calculate total income and expences
                    calculateTotal('exp');
                    calculateTotal('inc');

                    //calculate the budget:income - expences
                    data.budget=data.totals.inc - data.totals.exp;

                    //calculate the percentage of income that we spent
                    if(data.totals.inc > 0 ){
                        data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
                    }
                    else{
                        percentage = -1;
                    }
                    
                    

                },

                calculatePercentages: function(){
                    
                    data.allItems.exp.forEach(function(cur){
                    cur.calcpercentage(data.totals.inc);
                    });
                },

                getPercentages: function(){
                    var allPerc = data.allItems.exp.map(function(cur){
                        return cur.getPercentages();
                    });
                    return allPerc;
                },

                getBudget: function(){
                    return{
                        budget: data.budget,
                        totalInc:data.totals.inc,
                        totalExp: data.totals.exp,
                        percentage:data.percentage
                    };
                        
                },



            testing: function() {
                console.log(data);
            }   
        };
})();

 // UIcontroller
var UIController = (function(){
        var DOMstrings = {

            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue:'.add__value',
            inputBtn:'.add__btn',
            incomeContainor: '.income__list',
            expensesContainor: '.expenses__list',
            budgetLabel:'.budget__value',
            incomeLabel:'.budget__income--value',
            expensesLabel:'.budget__expenses--value',
            percentageLabel:'.budget__expenses--percentage',
            container:'.container',
            expencesPerLabel: '.item__percentage',
            dateLabel: '.budget__title--month'
        };

        var formetNumber = function(num, type){
                    
            var numSplit, int,dec;
            /*
                + or - before number
                desimal number sign
                comma operating the thousands
            */
           num = Math.abs(num);
           num = num.toFixed(2);

           numSplit = num.split('.');
        
            int = numSplit[0];
            if(int.length> 3){
               int = int.substr(0, int.length-3) +',' + int.substr(int.length- 3,3);
            }
            dec = numSplit[1];
            

            return (type ==='exp' ?  '-':  '+') + ' ' +int + '.' +dec;
        };

        var nodeListForeach = function(list,callback){
            for(var i=0; i<list.length;i++){
                callback(list[i],i);
            }
        };

    return{
        getInput:function (){

            return{
                 type: document.querySelector(DOMstrings.inputType).value,
                 description:document.querySelector(DOMstrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
          },
            addListItem: function(obj,type){
                var html,newHtml,element;
            //create html text with placeholder text
             if(type==='inc'){

                element = DOMstrings.incomeContainor;

               html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div></div></div>';
            }else if(type==='exp'){
                element=DOMstrings.expensesContainor;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } 
          
             //Replace the placeholder text with some actual data 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formetNumber(obj.value,type));

            //Insert the Html into the Dom
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
            },
            deleteListItem:function(selectorID){
                var el= document.getElementById(selectorID)
                 el.parentNode.removeChild(el);
            },

            clearFields: function(){

                var fields,fieldArr;

                fields=document.querySelectorAll(DOMstrings.inputDescription + ', '+ DOMstrings.inputValue);
                fieldArr=Array.prototype.slice.call(fields);

                fieldArr.forEach(function(current, index,array){

                    current.value="";

                });

                fieldArr[0].focus();
            },
            displayBudget:function(obj){
                var type;
                obj.budget > 0 ? type = 'inc' : type = 'exp'; 

                    document.querySelector(DOMstrings.budgetLabel).textContent = formetNumber(obj.budget,type);
                    document.querySelector(DOMstrings.incomeLabel).textContent = formetNumber(obj.totalInc,'inc');
                    document.querySelector(DOMstrings.expensesLabel).textContent = formetNumber(obj.totalExp,'exp');
                    
            
                    if(obj.percentage > 0){
                        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                    }else{
                        document.querySelector(DOMstrings.percentageLabel).textContent = '----';
                    }

                },

                displayPercentages: function(percentages){
                    var fields = document.querySelectorAll(DOMstrings.expencesPerLabel);
                
                    
                    
                    nodeListForeach(fields,function(current,index){
                        if(percentages[index] > 0){
                            current.textContent = percentages[index] + '%';
                        }else{
                            current.textContent = '---';
                        }
                        ;
                    });
                },

             displayMonth: function(){
                var now,year,months,month; 
                
                 now = new Date();
                 //var christmas = new Date(2016,11,25); 

                 months = ['january','february','march','april','may','june','july','august','septmber','october','november','december'];
                
                 month = now.getMonth();
                 year = now.getFullYear();
                 document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' +  year;
                
                },

                changeType:function(){

                    var fields = document.querySelectorAll(
                        DOMstrings.inputType + ',' + 
                        DOMstrings.inputDescription + ',' +
                        DOMstrings.inputValue);    
       
                        nodeListForeach(fields, function(cur){
                        cur.classList.toggle('red-focus');
                    });
                    document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
                },

            getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();

    //global app controller
var controller = (function(budgetctrl,UIctrl){

        var setupEventListeners = function(){

            var DOM =UIctrl.getDOMstrings();

            document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        
      

            document.addEventListener('keypress',function(event){
                if(event.keyCode === 13){
                  ctrlAddItem();
                }
    
            });

            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
            document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changeType);
        };



            var updateBugdet = function(){
                //1.calculate the budget
                budgetctrl.calculateBudget();
                //2 Return he budget
                var budget = budgetctrl.getBudget();

                //3.Display the budget on the UI
                UIctrl.displayBudget(budget);
            }
            var updatePercentage = function(){
               
                //1.calculae percentages
                budgetctrl.calculatePercentages();
                
                //2.read percentages fro budget controller
                var percentages = budgetctrl.getPercentages();
                
                //3.update the UI with new percentages
                UIctrl.displayPercentages(percentages);
            }   

        var DOM = UIctrl.getDOMstrings();

    var ctrlAddItem = function(){
          
        var input, newItem;

                 //1.get the field input data
             input = UIctrl.getInput();

             if(input.description !=="" && !isNaN(input.value) && input.value >0 ){
                   
                //2.add item to budget controller
         newItem = budgetctrl.addItem(input.type,input.description,input.value);
          
                //3.add the item to UI
            UIctrl.addListItem(newItem, input.type);


                //4.clear to fields
         UIctrl.clearFields();  


                //5.calculate the budget
         updateBugdet();

               // 6.calculate and update the percentage
                updatePercentage();
        }

    };
        var ctrlDeleteItem = function(event){
                var itemID,type,ID;
                itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
                if(itemID){

                    //inc-1
                    splitID=itemID.split('-');
                    type = splitID[0];
                    ID = parseInt(splitID[1]);

                    //1.Delete item from data structure 
                    budgetctrl.deleteItem(type,ID);

                    //2.delete item from the UI 
                    UIctrl.deleteListItem(itemID);     


                    //3.update and show the new budget 
                    updateBugdet();

                     // 6.calculate and update the percentage
                     updatePercentage();
                }
            };

        return{
            init: function(){

                console.log('Application has started');
                UIctrl.displayMonth();
                UIctrl.displayBudget({
                    budget: 0,
                    totalInc:0,
                    totalExp: 0,
                    percentage:-1
                });
                setupEventListeners();
            }
        };    

    })(budgetController,UIController);


//Init Controller
controller.init();