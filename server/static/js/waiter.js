/*
	DYNAMICALLY CREATE CLICK EVENTS LISTENERS
	https://toddmotto.com/attaching-event-handlers-to-dynamically-created-javascript-elements/

	POPULATE BUTTONS FROM JSON RECEIVED FROM SERVER
	-resources-
	http://stackoverflow.com/questions/21747878/how-to-populate-a-dropdown-list-with-json-data-dynamically-section-wise-into-th
   http://www.encodedna.com/2013/07/dynamically-add-remove-textbox-control-using-jquery.htm	
	*/

window.mySocket;//setup global var for the websocket
var orderData = {'orderData' : {}};
var orderTotal = 0.00;      
var ElementId_Spacer = "-";   //space char in element name attr to denote location in buttonBuilder json
var PageIsReady = false;//used to test when all html is built

/*-------These Function are used to build buttons on the screen--------
ButtonBuilder():
	IN: obj - a json
		parentKey - a key for the obj
		id - location of element in json, id = [key][key]etc..., used as html id for element created
	PURPOSE: iterate a json object, recursively iterate sub branches
			and pass data to HTMLgenerator() to create html elements from the json
		  PageIsReady >True when finished, click handlers are then assigned to generated content.
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
			//if id has 'spacer' GLOBAL VAR as first character, skip over it so ID starts with a letter
			if (jsonID.charAt(0)==ElementId_Spacer) {jsonID = jsonID.substring(1);};
			//Actual Items pass extra argument price to HTMLgenerator
			if (obj[parentKey][childKey[i]].price){
				HTMLgenerator(jsonID,id,obj[parentKey][childKey[i]].price)}
			//recursion, continue to work through a branch of JSON			
			else {
			HTMLgenerator(jsonID,id);
			ButtonBuilder(obj[parentKey],[childKey[i]],jsonID);};
		};
	}else{return;};
	PageIsReady -= 1;
	//All finished, PageIsReady GLOBAL Var is True
	if(PageIsReady===1){PageIsReady===true;assign_ClickHandlers();}
	
};
/*
HTMLgenerator():
	IN: id - name of an item in the format of location of in json, 
				Example: id = root(ElementId_Spacer)parent(ElementId_Spacer)child(ElementId_Spacer)item
				(ElementId_Spacer) is a GLOBAL VAR
		parentDiv - the div ID where the new div being created should be nested
		price - if price, means input is an actual item, pass through HTMLgenerator() and go to createItem()
	PURPOSE: create HTML div elements.  element id's correspond to json. the div nesting structore mirrors that
				of the JSON used to build.  so json branches are under parent branch div's. actual items pass through this function
	OUT: nothing			
*/
function HTMLgenerator(id,parentDiv,price) {
	var price = price || false;//menu buttons have no price, only items do
	var id = id;
	var parentDiv = parentDiv;
	
	if (parentDiv==="") {parentDiv='terminal';};//the root element of JSON is added to the terminal
	
	if (price) {createItem(id,parentDiv,price)}//items go to different builder function
	else {
		//isolate just the name of the item
		var nm = id.substring(id.lastIndexOf(ElementId_Spacer)+1);//create var for elements name attribute
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
	IN: id - name of an item in the format of location of in json, 
				Example: id = root(ElementId_Spacer)parent(ElementId_Spacer)child(ElementId_Spacer)item
				(ElementId_Spacer) is a GLOBAL VAR
		parentDiv - the div ID where the new element being created should be nested
		price - price of the item
	PURPOSE: create HTML element for a menu item nested under parent category 
	OUT: nothing
*/
function createItem(id,parentDiv,price){
	var id =id;
	var parentDiv = parentDiv;
	var price = price;
	var nm = id.substring(id.lastIndexOf(ElementId_Spacer)+1);//create var for elements name attribute
	var newItem = document.createElement("p");
	newItem.setAttribute('class','item stockYES');
	newItem.setAttribute('id',id);
	newItem.setAttribute('value',price);
	newItem.setAttribute('name',nm);
	document.getElementById(parentDiv).appendChild(newItem);
	document.getElementById(id).innerHTML = nm.toUpperCase();
};
/*
addItemToOrder(Name,count,price,mod):
	IN: id - element ID of menu item
		count - used to create unique element ID when there is a duplicate order. example, two burgers.
		price - price of the item
		mod - if the menu item is a modifier, example 'extra cheese', pass through and go to modifyItemInOrder()
	PURPOSE: add the clicked menu item to the orderArea div. 
	OUT: nothing
*/
function addItemToOrder(id,count,price,mod){
	var modify = mod || false;
	var Name = id.substring(id.lastIndexOf(ElementId_Spacer)+1);//create var for elements name attribute
	if (!modify) {
		orderTotal += parseFloat(price);
		var itemName = Name+'-'+count;
		var newItem = document.createElement("ul");
		newItem.setAttribute('id',itemName);
		newItem.setAttribute('value',price);
		newItem.setAttribute('name',id);
		document.getElementById('orderArea').appendChild(newItem);
		$('#'+itemName).html(Name.toUpperCase() +'  $'+price);
		$('#orderTotal').html('Total:  $'+orderTotal.toFixed(2));//force two decimal spots	
	}else {modifyItemInOrder(Name,count,price,id);};
};

/*
modifyItemInOrder(Name,count,price,id):
	IN: Name - the item name, example 'cheese'
		count - used to create unique element ID when there is a duplicate.
		price - price of the item
		id - element ID of menu item. the id is also equal to the items location in JSON
				Example: id = root(ElementId_Spacer)parent(ElementId_Spacer)child(ElementId_Spacer)item
				(ElementId_Spacer) is a GLOBAL VAR
	PURPOSE: add the clicked menu item modifier to the orderArea div. 
	OUT: nothing
*/
function modifyItemInOrder(Name,count,price,id) {
	if ($('#orderArea').children().length ===0){return;}//Doesn't allow modifier added unless a menu item already exists
																		//for example cant add 'extra cheese' to nothing.
	else if ($("ul.editItem").length>0) {
		var itemToModify = $(".editItem");//condition used if someone is editing a menu item that was already added
	}else {
		var itemToModify = $('#orderArea').children().last();};//modify the last item that was added
		
	var itemName = Name+'-'+count;//creates unique
	var newItem = document.createElement("li");
	var price = parseFloat(price);
	orderTotal += price;
	newItem.setAttribute('name',id);
	newItem.setAttribute('id',itemName);
	newItem.setAttribute('value',price);
	itemToModify.append(newItem);
	$('#'+itemName).html(Name.toUpperCase() +'  $'+price);
	$('#orderTotal').html('Total:  $'+orderTotal.toFixed(2));
}	
	
/*
display_CategoryView(parentDiv):
	IN: parentDiv - the element that was clicked
	PURPOSE: Display content to user. Take the nested content
		 of the 'terminal' element clicked and display the content in 
		 'categoryView' which is the middle column in view.  
		 If there is content in 'categoryView' div already remove
		it and return to it's correct parent in 'terminal'.  
	OUT: nothing
*/
function display_CategoryView(parentDiv) {
	var previousSelection = $('.ActiveCategory');
	var view = $('#categoryView');

	if (previousSelection.length>0) {
		view.find('*').css('display','none');
		view.children().not('#itemView').appendTo($('#'+previousSelection[0].id));//dont remove the #itemView element when returning data to parent
	};
	
	parentDiv.children().prependTo(view);

   if(view.children().css('display') ==='none'){
			view.children().toggle();};
			
	previousSelection.removeClass("ActiveCategory");
	parentDiv.addClass("ActiveCategory");
};

/*
display_ItemView(parentDiv):
	IN: parentDiv - the element that was clicked
	PURPOSE: Display content to user. Take the nested content
		 of the a category in the 'categoryView' element and display its content in 
		 underneath in the 'itemView' element.  
		 If there is content in 'item' div already remove
		it and return to it's correct parent.  
	OUT: nothing
*/
function display_ItemView(parentDiv) {
	var previousSelection = $(".ActiveItem");
	var view = $('#itemView');

	if (view.children().length>0) {
		view.children().find('*').css('display','none');
		view.children().appendTo(previousSelection);
		view.empty();
	}
	view.empty();
	previousSelection.removeClass("ActiveItem");
	parentDiv.addClass("ActiveItem");
	
	//make 'mods' below all of the items
	parentDiv.children().not("[name='mods']").prependTo(view);
	parentDiv.children("[name='mods']").appendTo(view);

	parentDiv.siblings().children().not('#itemView').css('display','none');
	view.css('display','block');
	view.children().toggle();

	
};
/*
display_ItemModifiers(mods):
	IN: mods - the element that was clicked
	PURPOSE: Display content to user. modifiers are a special kind 'subbutton'
				simply toggle hide/show don't move content around because the
				modifier button is already in the right view location if it's visible to user
	OUT: nothing
*/
function display_ItemModifiers(mods) {
	mods.children().css('width','50%');
	mods.children().toggle();	
};

/*
ItemDepthInTree(itemNameString):
	IN: itemNameString - a string that represents the location of the clicked element in DOM and JSON
		Example: id = root(ElementId_Spacer)parent(ElementId_Spacer)child(ElementId_Spacer)item
				(ElementId_Spacer) is a GLOBAL VAR
	PURPOSE: Determine where the clicked element and it's associated category
	OUT: an array of all occurrence of 'ElementId_Spacer'.  if empty, didn't occur.  
			each occurrence represents a down the DOM nested structure and JSON
*/
function ItemDepthInTree(itemNameString) {
    var indexes = [], i;
    for(i = 0; i < itemNameString.length; i++)
        if (itemNameString[i] === ElementId_Spacer)
            indexes.push(i);
    return indexes;
}

/*
assign_ClickHandlers():

IMPORTANT CONTROL FUNCTION
all click assignments are assigned and defined here.  Because content is dynamically created
this function is called when all the HTML elements have been built.  Otherwise clicks can't bind because
elements don't exist yet.

GLOBALS USED:
	orderData
	orderTotal

FUNCTIONS USED:
	addItemToOrder()
	display_ItemView()
	display_ItemModifiers()
	display_CategoryView()
	ItemDepthInTree()
*/

function assign_ClickHandlers() {
	
	/*---- ITEMS Class Click Event-----*/
			$('.item').click (function (event) { 
				var mods;//boolean if 'item' is a modifier or item
				if($(this).parent().attr('name') === 'mods'){
					mods = 'mods';
					}else {mods = false;};
				var nm = $(this).attr('id');
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
				
	/*---- orderArea Class Click Event-----*/	
			$(".orderArea").click (function (event) {

				var currentItem = $(".editItem");
				var Clicked = $(event.target);
				
				//area not item was clicked
				if ( Clicked.parent().context.id === "orderArea"){return;}
				
				//turn 'editItem' off, same item was clicked
				else if(Clicked.context.id === currentItem.attr('id')){
					$("#remove").css('visibility','hidden');
					$("#modify").css('visibility','hidden');
					$(".editItem").removeClass("editItem");
					return;}
					
				//turn on 'editItem'
				else{
					$("#remove").css('visibility','visible');
					$("#modify").css('visibility','visible');
					$(".editItem").removeClass("editItem");
					event.target.setAttribute('class','editItem');};
				
				event.stopPropagation();
				});
				
	/*---- remove button Click Event-----*/		
			$("#remove").click (function (event) {
				var currentItem = $(".editItem");
				orderTotal -= parseFloat(currentItem.attr("value"));
				while(currentItem.children().length>0){
					orderTotal -= parseFloat(currentItem.children().first().attr("value"));
					currentItem.children().first().remove();
				};
				
				$('#orderTotal').html('Total:  $'+orderTotal.toFixed(2));
				currentItem.remove();
				$(this).css('visibility','hidden');
				$("#modify").css('visibility','hidden');
			});
			
	/*---- modify button Click Event-----*/		
	// FIX! this is basically hard coded
			$("#modify").click (function (event) {
				var currentItem = $(".editItem");
				var loc = currentItem.attr("name");
				var depth = ItemDepthInTree(loc);
				var parentCategory = loc.substring(0,depth[0]);
				$('#'+ parentCategory).trigger("click");
				var subCategory = loc.substring(0,depth[1]);
				$('#'+subCategory).trigger("click");
				var mods = subCategory + ElementId_Spacer + 'mods';
				$('#'+mods).trigger("click");
				
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

			/* ALL JSON data coming from server will have one parent key in the tree.  
			This is used to route the JSON to appropriate place through series of IF's*/
			
			if (Object.keys(JSONdata)[0] === 'buttonBuilder'){
				ButtonBuilder(JSONdata,'buttonBuilder');
			};
			
		});
	
	//make OrderArea size match screen
	$('#orderArea').css('height',screen.height-(screen.height/2));

});