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
var orderData = {'orderData' : {}};
var currentBranch;//used in button building
var parentDiv = 'terminal';//used in button building
                  

/*-------These Function are used to build buttons on the screen--------*/
function ButtonBuilder(obj,parentKey) {
	var childKey = Object.keys(obj[parentKey]);
	if (!obj.price) {
		for (var i=0;i<childKey.length;i++) {
			if (obj[parentKey][childKey[i]].price){
				HTMLgenerator(childKey[i],parentKey,obj[parentKey][childKey[i]].price)}
			else {
			HTMLgenerator(childKey[i],parentKey);
			ButtonBuilder(obj[parentKey],[childKey[i]]);};
		};
	}else{};
};

function HTMLgenerator(id,parentDiv,price) {
	console.log(parentDiv);
	var price = price || false;
	var newDiv = document.createElement("div");
	
	if (price) {
			createItem(id,parentDiv,price)}
	else if (parentDiv==='buttonBuilder') {
			parentDiv='terminal';
			newDiv.setAttribute('class','button');
			newDiv.setAttribute('id',id);
			document.getElementById(parentDiv).appendChild(newDiv);
			$('#'+id).click (function () { 
			$(this).children().toggle();});
			}
	else {parentDiv=parentDiv[0];
			newDiv.setAttribute('class','subbutton');
			newDiv.setAttribute('id',id);
			document.getElementById(parentDiv).appendChild(newDiv);
			$('#'+id).click (function () { 
			$(this).children().toggle();
			return false;});}
	
	console.log(parentDiv);
	
	$('#'+id).html(id.toUpperCase());
};

function createItem(id,parentDiv,price){
	var newItem = document.createElement("ul");
	newItem.setAttribute('class','item');
	newItem.setAttribute('id',id);
	newItem.setAttribute('value',price);
	document.getElementById(parentDiv).appendChild(newItem);
	$('#'+id).html(id.toUpperCase());
	$('#'+id).click (function () { 
			console.log($(this).attr("value"));
			if (!orderData["orderData"][id]) {
				orderData["orderData"][id] = 1;}
			else {orderData["orderData"][id] += 1;}
			console.log(orderData)
			addItemToOrder(id+orderData["orderData"][id]);
			return false;});
}
function addItemToOrder(itemName){
	console.log(itemName);
	var newItem = document.createElement("li");
	newItem.setAttribute('id',itemName);
	document.getElementById('orderArea').appendChild(newItem);
	$('#'+itemName).html(itemName.toUpperCase());
};

$(document).ready(function(){
	mySocket = io.connect();//create new websocket, 
	
	/* ON LOAD build the buttons on the page*/
	mySocket.send(JSON.stringify({'buttonBuilder':1}));
	

	/* EXAMPLE function to send data on click*/
	$("#sendTest").click(function(event){
		mySocket.send(JSON.stringify(orderData));
	});
	
	/* FUNCTION TO READ INBOUND DATA*/
	mySocket.on('message', function(msg) {
			var JSONdata = JSON.parse(msg);
			console.log(JSONdata);
			/* ALL JSON data coming from server will have one parent key in the tree.  
			This is used to route the JSON to appropriate place through series of IF's*/
			
			if (Object.keys(JSONdata)[0] === 'buttonBuilder'){
				ButtonBuilder(JSONdata,'buttonBuilder');
			};
		});


});