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

/*-------These Function are used to build buttons on the screen--------*/
function ButtonBuilder(obj,parentKey) {
	var childKey = Object.keys(obj[parentKey]);
	if (!obj.price) {
		for (var i=0;i<childKey.length;i++) {
			createButton(childKey[i],parentKey);
			ButtonBuilder(obj[parentKey],[childKey[i]]);
		};
	}else{};
};

function createButton(id,parentDiv) {
	var newButton = document.createElement("div");
	if (parentDiv==='buttonBuilder') {
		parentDiv='terminal';
		newButton.setAttribute('class','button');
		newButton.setAttribute('id',id);
		document.getElementById(parentDiv).appendChild(newButton);
		$('#'+id).html(id.toUpperCase());
		$('#'+id).click(function () { 
			$('.subbutton').toggle();
			});
		}
	else{createSubButton(id,parentDiv)};

};
function createSubButton(id,parentDiv){
	var newButton = document.createElement("ul");
	newButton.setAttribute('class','subbutton');
	newButton.setAttribute('id',id);
	document.getElementById(parentDiv).appendChild(newButton);
	$('#'+id).html(id.toUpperCase());
}
function menuItem(){};

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
				var bb = Object.keys(JSONdata)[0];
				ButtonBuilder(JSONdata,'buttonBuilder');
			};
		});
	
});