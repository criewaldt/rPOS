/*
	DYNAMICALLY CREATE CLICK EVENTS LISTENERS
	https://toddmotto.com/attaching-event-handlers-to-dynamically-created-javascript-elements/

	POPULATE BUTTONS FROM JSON RECEIVED FROM SERVER
	-resources-
	http://stackoverflow.com/questions/21747878/how-to-populate-a-dropdown-list-with-json-data-dynamically-section-wise-into-th
   http://www.encodedna.com/2013/07/dynamically-add-remove-textbox-control-using-jquery.htm	
	*/

window.mySocket;//setup global var for the websocket
var bbJSON;
var orderData = {'orderData' : {}};
var orderTotal = 0.00;      
var ElementId_Spacer = "-";   //space char in element name attr to denote location in buttonBuilder json
var PageIsReady = false;//used to test when all html is built

/*-------These Function are used to build buttons on the screen--------
ButtonBuilder():
	IN: obj - json data
		parentKey - root key for the obj
		id - location of element in main buttonBuilder json, used as html id for element created
	PURPOSE: iterate a branch of json, recursively iterate sub branches
	OUT: pass data to HTMLgenerator() to create html view from the json
		  PageIsReady >True when finished, click handlers are then assigned for generated content.
*/

function ButtonBuilder(obj,parentKey,id) {
	
	if (!PageIsReady) {PageIsReady = 2;}
	else {PageIsReady += 1;};

	var parentKey = parentKey;
	var id = id || "";
	var childKey = Object.keys(obj[parentKey]);
	
	//to break the recursive calling of this function when obj finally becomes an actual property
	//since properties of an object: price, modification, etc are NOT Object.
	if (obj instanceof Object) {
		for (var i=0;i<childKey.length;i++) {
			var jsonID = id+ElementId_Spacer+[childKey[i]];
			//if id has '.' as first character, skip over it so a letter is first
			if (jsonID.charAt(0)==ElementId_Spacer) {jsonID = jsonID.substring(1);};
			//Actual Items
			if (obj[parentKey][childKey[i]].price){
				HTMLgenerator(jsonID,id,obj[parentKey][childKey[i]].price)}
			//subButtons			
			else {
			HTMLgenerator(jsonID,id);
			ButtonBuilder(obj[parentKey],[childKey[i]],jsonID);};
		};
	}else{return;};
	PageIsReady -= 1;
	if(PageIsReady===1){PageIsReady===true;assign_ClickHandlers();}
	
};
/*
HTMLgenerator():
	IN: id - name of an item in the format of location of in main json, example- root.parent.child.item
		parentDiv - what div the new div created for ID should be nested under
		price - if price, means input is an actual item send to createItem()
	PURPOSE: create HTML div for id, nest under parent category. actual items pass through this function
				this is used for menu and submenu drop downs and organizing the html view
	OUT: nothing, however html div is created in view
*/
function HTMLgenerator(id,parentDiv,price) {
	var price = price || false;//menu buttons have no price, only items do
	if (parentDiv==="") {parentDiv='terminal';};
	if (price) {createItem(id,parentDiv,price)}
	else {
		//isolate just the name of the item
		var nm = id.substring(id.lastIndexOf(ElementId_Spacer)+1);
		var newDiv = document.createElement("div");
		document.getElementById(parentDiv).appendChild(newDiv);
		newDiv.setAttribute('id',id);
		newDiv.setAttribute('name',nm);
		document.getElementById(id).innerHTML = nm.toUpperCase();
			if (parentDiv==='terminal') {newDiv.setAttribute('class','button'); }
			else {newDiv.setAttribute('class','subbutton'); }
		}
};

/*
createItem(id,parentDiv,price):
	IN: id - name of an item in the format of location of in main json, example- root.parent.child.item
		parentDiv - what div the new element created for ID should be nested under
		price - price of the item
	PURPOSE: create HTML button nested under parent category for a specific menu item, when item is clicked 
			it is added to the order.
	OUT: nothing, however html element with class item is created in view for the item
*/
function createItem(id,parentDiv,price){
	var nm = id.substring(id.lastIndexOf(ElementId_Spacer)+1);
	var newItem = document.createElement("p");
	newItem.setAttribute('class','item');
	newItem.setAttribute('id',id);
	newItem.setAttribute('value',price);
	newItem.setAttribute('name',nm);
	document.getElementById(parentDiv).appendChild(newItem);
	document.getElementById(id).innerHTML = nm.toUpperCase();
};
/*
addItemToOrder(Name,count,price):
	IN: Name - name of menu item
		count - used for tracking multiples of same item, example - burger: 2
		price - price of the item
	PURPOSE: add the clicked menu item to the order.  create an html element for the item
				under orderArea.
	OUT: nothing, however html item element is created in view
*/
function addItemToOrder(Name,count,price,mod){
	var modify = mod || false;
	if (!modify) {
	orderTotal += parseFloat(price);
	var itemName = Name+'-'+count
	var newItem = document.createElement("ul");
	newItem.setAttribute('id',itemName);
	document.getElementById('orderArea').appendChild(newItem);
	$('#'+itemName).html(Name.toUpperCase() +'  $'+price);
	$('#orderTotal').html('Total:  $'+orderTotal.toFixed(2));//force two decimal spots	
	}else {modifyItemInOrder(Name,count,price);};
};

function modifyItemInOrder(Name,count,price) {
	var itemToModify = $('#orderArea').children().last();
	var itemName = Name+'-'+count
	var newItem = document.createElement("li");
	var price = parseFloat(price);
	orderTotal += price;
	
	newItem.setAttribute('id',itemName);
	itemToModify.append(newItem);
	$('#'+itemName).html(Name.toUpperCase() +'  $'+price);
	$('#orderTotal').html('Total:  $'+orderTotal.toFixed(2));
}	
	
	
/*
display_CategoryView(parentDiv):
	IN: parentDiv - the element that was clicked $(this)
	PURPOSE: If there is content in 'categoryView' div, remove
		it and return to it's correct parent.  Then take the nested content
		 of the 'terminal' element clicked.
		which is some category of items.  Display the content in 
		 'categoryView' which is the far middle column in view
	OUT: nothing, however html is shuffled and displayed
*/
function display_CategoryView(parentDiv) {
	var previousSelection = $('.ActiveCategory');
	var view = $('#categoryView');

	if (previousSelection.length>0) {
		view.find('*').css('display','none');
		view.children().not('#itemView').appendTo($('#'+previousSelection[0].id));
	};
	
	//clone(true) takes all attached handlers too, see docs
	parentDiv.children().clone(true).prependTo(view);
	parentDiv.children().remove();

   if(view.children().css('display') ==='none'){
			view.children().toggle();};
			
	previousSelection.removeClass("ActiveCategory");//remove 'active' class on previous parent	
	parentDiv.addClass("ActiveCategory");
};

function display_ItemModifiers(mods) {
	mods.children().css('width','50%');
	mods.children().toggle();	
};

function display_ItemView(parentDiv) {
	var previousSelection = $(".ActiveItem");
	var view = $('#itemView');
	console.log(view.children().length);
	if (view.children().length>0) {
		view.children().find('*').css('display','none');
		view.children().appendTo(previousSelection);
		view.empty();
	}
	view.empty();
	previousSelection.removeClass("ActiveItem");
	parentDiv.children().not("[name='mods']").prependTo(view);
	parentDiv.children("[name='mods']").appendTo(view);

	parentDiv.siblings().children().not('#itemView').css('display','none');
	view.css('display','block');
	view.children().toggle();

	parentDiv.addClass("ActiveItem");
};

function assign_ClickHandlers() {
	
		 /*---- ITEMS Class Click Event-----*/
			$('.item').click (function (event) { 
			var mods = false;
			if($(this).parent().attr('name') === 'mods'){
				mods = 'mods';
				};

				var nm = $(this).attr('name');
				var price = $(this).attr('value');
					if (!orderData["orderData"][nm]) {
							orderData["orderData"][nm] = 1;}
					else {orderData["orderData"][nm] += 1;}
					
				addItemToOrder(nm,orderData["orderData"][nm],price,mods);
				event.stopPropagation();
				});
			
			/*---- SUBBUTTON Class Click Event-----*/	
			$('.subbutton').not("[name='mods']").click (function (event) { 
					display_ItemView($(this));				
				event.stopPropagation();
				});
				
			/*--special-- SUBBUTTON Class Name='mods' Click Event-----*/	
			$("[name='mods']").click (function (event) { 
					display_ItemModifiers($(this));				
				event.stopPropagation();
				});
			
			/*---- BUTTON Class Click Event-----*/	
			$('.button').click (function () {
					display_CategoryView($(this));
				});
};

$(document).ready(function(){
	mySocket = io.connect();//create new websocket, 
	
	/* ON LOAD sending a json with key term 'buttonBuilder'
	which will cause server to respond with a master json used to
	build the buttons on the page*/
	mySocket.send(JSON.stringify({'buttonBuilder':1}));
	
	document.getElementById('sendOrder').onclick = function (){
		alert();
		mySocket.send(JSON.stringify(orderData));
		$('#orderArea').empty();
	};

	/* FUNCTION TO READ INBOUND DATA*/
	mySocket.on('message', function(msg) {
			var JSONdata = JSON.parse(msg);
			console.log(JSONdata);
			/* ALL JSON data coming from server will have one parent key in the tree.  
			This is used to route the JSON to appropriate place through series of IF's*/
			
			if (Object.keys(JSONdata)[0] === 'buttonBuilder'){
				bbJSON = JSONdata;
				ButtonBuilder(JSONdata,'buttonBuilder');
			};
			
		});
	
	//make OrderArea size match screen
	$('#orderArea').css('height',screen.height-(screen.height/2));
	console.log(screen.height);

});