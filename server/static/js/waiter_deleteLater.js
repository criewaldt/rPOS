	/*
	DYNAMICALLY CREATE CLICK EVENTS LISTENERS
	https://toddmotto.com/attaching-event-handlers-to-dynamically-created-javascript-elements/

	POPULATE BUTTONS FROM JSON RECEIVED FROM SERVER
	-resources-
	http://stackoverflow.com/questions/21747878/how-to-populate-a-dropdown-list-with-json-data-dynamically-section-wise-into-th
   http://www.encodedna.com/2013/07/dynamically-add-remove-textbox-control-using-jquery.htm	
	
	LOGIC FOR NESTED:
	http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
		
	*/

window.mySocket;//setup global var for the websocket
window.TheOrder;//setup global var for the order
var AllMyItems;//setup global var for all items that can be ordered

var orderData = {'orderData' : {'burger':{'mods':['cheese', 'bacon']}}};
 
                  
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
	console.log(targetButton);	
	console.log('button builder started');
	
	var parentKEY = Object.keys(JSONdata);
	console.log(parentKEY[0]);
	AllMyItems = JSONdata[parentKEY];//global var assignment
	console.log(AllMyItems);
	/*Parent key should ALWAYS be 'buttonBuilder' on inbound setup JSON from server*/
	if (parentKEY[0] ==="buttonBuilder" ){

	var totalButtons = CountMyItems(AllMyItems);
	console.log("total buttons: " + totalButtons);
	
	var ItemCatagories = Object.keys(AllMyItems);
	console.log("keys: " + ItemCatagories);


	for (i=0; i<totalButtons;i++) {
		createButtonDiv(ItemCatagories[i]);
		if (ItemCatagories[i][0]) {
			};
	
		};	
	};
};


function createButtonDiv(itemList) {
		console.log(AllMyItems[itemList]);
		var Buttons = CountMyItems(itemList);
		console.log(Buttons);
		var Items = Object.keys(itemList);
		console.log(Items);
		var parentKEY = Items[0];
		console.log(parentKEY);
		for (i=0; i<Buttons;i++) {
			var newButton = document.createElement("div");
			newButton.setAttribute('class',' button ');
			newButton.setAttribute('class',parentKEY);
			newButton.setAttribute('id',Items[i]);
			//newButton.onclick = clickDynamic;
			document.getElementById(Buttons.context.id).appendChild(newButton);
			$('#'+Items[i]).html(Items[i].toUpperCase());
		};
		
};

function clickDynamic() {
	console.log($(this));
	console.log($(this).context.id);
	console.log(AllMyItems[$(this).context.id]);

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

	for (key in AllMyItems) {
		console.log(AllMyItems[key]);

	};
			
	});
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
  });
	
	
});*/
