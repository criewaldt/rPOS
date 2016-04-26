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
var orderTotal = 0;         

/*-------These Function are used to build buttons on the screen--------*/
function ButtonBuilder(obj,parentKey) {
	//get the keys of the parentKey branch
	var childKey = Object.keys(obj[parentKey]);
	//properties of the object: price, modification, etc are NOT objects
	if (obj instanceof Object) {
		for (var i=0;i<childKey.length;i++) {
			//price property means it can be added to the order
			if (obj[parentKey][childKey[i]].price){
				HTMLgenerator(childKey[i],parentKey,obj[parentKey][childKey[i]].price)}
			else {
			//create more subbuttons for the current branch
			HTMLgenerator(childKey[i],parentKey);
			ButtonBuilder(obj[parentKey],[childKey[i]]);};
		};
	}else{};
};

function HTMLgenerator(id,parentDiv,price) {
	var price = price || false;
	var newDiv = document.createElement("div");
	
	if (price) {
			createItem(id,parentDiv,price)}
	else if (parentDiv==='buttonBuilder') {
			parentDiv='terminal';
			newDiv.setAttribute('class','button');
			newDiv.setAttribute('id',id);
			document.getElementById(parentDiv).appendChild(newDiv);
			//must add click functions here else since elements are dynamically created they wont bind
			$('#'+id).click (function () { 
				if($(this).children().css('display') ==='none')
					{$(this).children().toggle();}
				else{$(this).find('*').css('display','none')}});}
	else {parentDiv=parentDiv[0];
			newDiv.setAttribute('class','subbutton');
			newDiv.setAttribute('id',id);
			document.getElementById(parentDiv).appendChild(newDiv);
			$('#'+id).click (function () { 
			$(this).siblings().find('*').css('display','none');
			$(this).children().toggle();
			return false;});}
	
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
	//account for duplicate items ordered, html.id cant be the same, add counter
			if (!orderData["orderData"][id]) {
				orderData["orderData"][id] = 1;}
			else {orderData["orderData"][id] += 1;}
			addItemToOrder(id,orderData["orderData"][id],price);
			return false;});
}
function addItemToOrder(Name,count,price){
	orderTotal += price;
	var itemName = Name+'-'+count || Name;//legacy, don't really need ||
	var newItem = document.createElement("li");
	newItem.setAttribute('id',itemName);
	document.getElementById('orderArea').appendChild(newItem);
	$('#'+itemName).html(Name.toUpperCase() +'  $'+price);

};

$(document).ready(function(){
	mySocket = io.connect();//create new websocket, 
	
	/* ON LOAD build the buttons on the page*/
	mySocket.send(JSON.stringify({'buttonBuilder':1}));

	
	document.getElementById('sendOrder').onclick = function (){
		console.log('click');
		//mySocket.send(JSON.stringify(orderData));
		mySocket.send(JSON.stringify(orderData));
	};

	/* EXAMPLE function to send data on click*/
	/*
	$("#sendOrder").click(function(event){
		mySocket.send(JSON.stringify(orderData));
	});*/
	
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