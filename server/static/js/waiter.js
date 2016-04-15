/*
	DYNAMICALLY CREATE CLICK EVENTS LISTENERS
	https://toddmotto.com/attaching-event-handlers-to-dynamically-created-javascript-elements/

	POPULATE BUTTONS FROM JSON RECEIVED FROM SERVER
	-resources-
	http://stackoverflow.com/questions/21747878/how-to-populate-a-dropdown-list-with-json-data-dynamically-section-wise-into-th
   http://www.encodedna.com/2013/07/dynamically-add-remove-textbox-control-using-jquery.htm	
	*/

window.mySocket;//setup global var for the websocket
window.TheOrder;//setup global var for the order
var AllMyItems;//setup global var for all items that can be ordered

var orderData = {'orderData' : {'burger':{'mods':['cheese', 'bacon']}}};
var currentBranch;//used in button building
var parentDiv = 'terminal';//used in button building
                  
/*used to count items in a list*/
function CountMyItems(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    };
    return size;
};

/*This Function is used to build buttons on the screen*/
function ButtonBuilder(JSONdata,targetButton) {
	targetButton = targetButton || 0;//targetButton is set to 0 as default if no targetButton arg passed

	
	//determine parent KEY for this JSON
	var parentKEY = Object.keys(JSONdata);
	console.log(parentKEY[0]);

	/*Parent key should ALWAYS be 'buttonBuilder' on initial setup JSON from server*/
	if (parentKEY[0] ==='buttonBuilder' ){
		AllMyItems = JSONdata[parentKEY];//global var assignment
		var ButtonBuilderItems = AllMyItems;//local assignment, removes 'buttonBuilder'
		console.log(ButtonBuilderItems);//main Object to build buttons for
	}
	
	
	var totalButtons = CountMyItems(ButtonBuilderItems);
	
	var myItemKeys = Object.keys(ButtonBuilderItems);
	console.log("key names: " + myItemKeys);
	console.log("key count: " + myItemKeys.length);
	
		iterate(ButtonBuilderItems);
	
	
	
};
var list;
function iterate(obj, div) {
	console.log(obj);
	div = div || parentDiv;//if not passed use primary div
	list = obj;
	if (obj instanceof Object) {//check if object
		var objectKeys = Object.keys(obj);//get objects keys
		console.log("object keys:");
		console.log(objectKeys);
		
		for (i=0;i<objectKeys.length;i++) {//for each key make a button
			createButton(objectKeys[i],div);
			};
			
       for(i=0;i<objectKeys.length;i++){//now check if any of the objects have children
       		if(obj[objectKeys[i]] instanceof Object && !obj[objectKeys[i]].price){
            	console.log("making sub button for:");
            	console.log(objectKeys[i]);
               iterate(obj[objectKeys[i]],objectKeys[i]);
                      	/*
                      	console.log("parent object has subObject:");
                      	console.log(obj[objectKeys[i]]);
                      	list = obj[objectKeys[i]];
                          var keyTerms = Object.keys(list);
                          console.log(keyTerms);
                                    for(i=0;i<keyTerms.length;i++){
                                    				div = objectKeys[i];
                                                createButton(keyTerms[i],div);
                                                iterate(list);}
                                    */}else {continue};
            };
     };
};
		
function createButton(id,parentDiv) {
	console.log("building: ");
	console.log(id);
	console.log("under: "+parentDiv);
	var newButton = document.createElement("div");

	newButton.setAttribute('class','button');
	newButton.setAttribute('id',id);
	document.getElementById(parentDiv).appendChild(newButton);

	$('#'+id).html(id.toUpperCase());
};

function clickDynamic() {
	console.log("clickDynamic" +$(this));
	console.log($(this).context.id);
	var aKey = $(this).context.id;
	console.log(AllMyItems[aKey]);
	var subButtons = AllMyItems[$(this).context.id];
	var targetButton = $(this);
	console.log("subButton "+AllMyItems[$(this).context.id]);
	ButtonBuilder({'subButtonBuilder':subButtons},targetButton);
};


$(document).ready(function(){
	mySocket = io.connect();//create new websocket, 
	
	/* ON LOAD build the buttons on the page*/
	
	mySocket.send(JSON.stringify({'buttonBuilder':1}));
	

	/* EXAMPLE function to send data on click*/
	
	$(".button").click(function(event){
		mySocket.send(JSON.stringify(orderData));
	});
	
	/* FUNCTION TO READ INBOUND DATA*/
	mySocket.on('message', function(msg) {
			var JSONdata = JSON.parse(msg);
			console.log(JSONdata);
			/* ALL JSON data coming from server will have one parent key in the tree.  
			This is used to route the JSON to appropriate place through series of IF's*/
			
			if (Object.keys(JSONdata)[0] === 'buttonBuilder'){
				ButtonBuilder(JSONdata);
			};

			
	});
	


	
	
/*
		  if (msg['buttonBuilder']) {
		  	var MyTest = msg.buttonBuilder;

		  	console.log(Object.keys(MyTest));
		  	var myKeys = Object.keys(MyTest);
		  	console.log(myKeys[0]);
		  	for (i=0; i<myKeys.length; i++) {
		  		console.log(MyTest[myKeys[i]]);
		  	}

		  	for (index in MyTest) {
		  		$('#testArea').append('<li><a href="#" item="'+MyTest[index].BBQ+'" price="'+MyTest[index].CHZ+'">TEST</a></li>');
		  		//$('#testArea').append("<p>" + MyTest[index].BBQ+"</p>");
		  	}
		  }else console.log('false');
	});
	
	 $('a').on('click', function(){
    $('#show').html(   'Item : ' + $(this).attr('item') + '| Price : ' +  $(this).attr('price')   );
  });*/
	
	
});