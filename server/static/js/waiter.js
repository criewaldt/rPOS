
window.mySocket;//setup global var for the websocket
var SCREEN_WIDTH_MEDIA_QUERY;  //used to check what bootstrap col-* class is being used to switch to responsive
var ORDER_DATA = {'ORDER_DATA' : {}};
var ORDER_TOTAL = 0.00;      
var ELMNT_ID_SPACE_CHAR = "-";   //space char in element name attr to denote location in buttonBuilder json
var PAGE_IS_READY = false;//used to test when all html is built
var WAIT_FOR_USER = false;//used to prevent new input if waiting for a selection from user

/*-------These Function are used to build buttons on the screen--------
ButtonBuilder():
	IN: obj - a json
		parentKey - a key for the obj
		id - location of element in json, id = [key][key]etc..., used as html id for element created
	PURPOSE: iterate a json object, recursively iterate sub branches
			and pass data to HTMLgenerator() to create html elements from the json
		  PAGE_IS_READY >True when finished, click handlers are then assigned to generated content.
	OTHER FUNCTIONS USED:
			HTMLgenerator()
*/

function ButtonBuilder(obj,parentKey,id) {
	//PAGE_IS_READY will be 1 when the whole JSON is traversed
	if (!PAGE_IS_READY) {PAGE_IS_READY = 2;}
	else {PAGE_IS_READY += 1;};	
	
	var id = id || "";
	var childKey = Object.keys(obj[parentKey]);
	var CustomStyle = false;
	for (var x =0; x<childKey.length;x++) {
		if (childKey[x]  === 'CustomStyle'){
		childKey.splice(x,1);//remove CustomStyle
		};
	};
	
	
	//to break the recursive calling of this function when obj finally becomes an actual property
	//since properties of an object: price, modification, etc are NOT Object.
	if (obj instanceof Object) {
		for (var i=0;i<childKey.length;i++) {
			
			//check if the obj has custom style prop
			if (obj[parentKey][childKey[i]].CustomStyle) {
			CustomStyle = obj[parentKey][childKey[i]].CustomStyle;}
			
			var jsonID = id+ELMNT_ID_SPACE_CHAR+[childKey[i]];
			//if id has 'spacer' GLOBAL VAR as first character, skip over it so ID starts with a letter
			if (jsonID.charAt(0)==ELMNT_ID_SPACE_CHAR) {jsonID = jsonID.substring(1);};				
				
			//Actual Items pass to createItem()
			if (obj[parentKey][childKey[i]].price){
				createItem(jsonID,id,CustomStyle,obj[parentKey][childKey[i]].price);
				//check if the item has item specific mods, ie' large/small, mild/medium/hot/
				//need to make buttons for the mods
				if (obj[parentKey][childKey[i]].mods) {
				ButtonBuilder(obj[parentKey][childKey[i]],["mods"],jsonID);
				};
			}
			else {	
			//recursion, continue to work through a branch of JSON			
			HTMLgenerator(jsonID,id,CustomStyle);
			ButtonBuilder(obj[parentKey],[childKey[i]],jsonID);
			};
		}
	}else{return;};
	PAGE_IS_READY -= 1;

	//All finished, set PAGE_IS_READY GLOBAL Var is True
	if(PAGE_IS_READY===1){PAGE_IS_READY===true;assign_ClickHandlers();}
	
};
/*
HTMLgenerator():
	IN: id - name of an item in the format of location of in json, 
				Example: id = root(ELMNT_ID_SPACE_CHAR)parent(ELMNT_ID_SPACE_CHAR)child(ELMNT_ID_SPACE_CHAR)item
				(ELMNT_ID_SPACE_CHAR) is a GLOBAL VAR
		parentDiv - the div ID where the new div being created should be nested
		price - if price, means input is an actual item, pass through HTMLgenerator() and go to createItem()
	PURPOSE: create HTML div elements.  element id's correspond to json. the div nesting structore mirrors that
				of the JSON used to build.  so json branches are under parent branch div's. actual items pass through this function
	OTHER FUNCTIONS USED:
			createItem()
			HTMLelement()
	OUT: nothing			
*/
function HTMLgenerator(id,parentDiv,CustomStyle) {

	
	if (parentDiv==="") {parentDiv='terminal';};//the root element of JSON is added to the terminal

	
		//isolate just the name of the item
		var nm = id.substring(id.lastIndexOf(ELMNT_ID_SPACE_CHAR)+1);//string split ID for elements name attribute
		
		if (parentDiv==='terminal') {
			var newDiv = HTMLelement("div",{ID:id,NAME:nm,CLASS:'button',innerHTML:nm,CustomStyle});
		}else {
			var newDiv = HTMLelement("div",{ID:id,NAME:nm,CLASS:'subbutton',innerHTML:nm,CustomStyle});
		}
		
		document.getElementById(parentDiv).appendChild(newDiv);
		
	
};
/*
HTMLelement(a)
	IN: a - variable argument. it is in the form
				('elementType,{elementProperties}) where {elementProperties} is an object with variable
				number of properties to be set for the new element.  Sometimes custom properties for style are sent.
				for example change background color, text size or inner html. these come in as the property : stylProps.
				they overwrite defaults.
	PURPOSE: used to create HTML elements
	FUNCTIONS USED:
		none
	OUT: returns an HTML Element 

*/
function HTMLelement(a) {

	//use splice to get the first argument, that is the 'type' of element to create
	var elementProperties = Array.prototype.splice.call(arguments,1);
	var Element = document.createElement(a);
	console.log(elementProperties[0]);
	//check if 'custom' style properties were sent
	if(elementProperties[0].CustomStyle){
		//overwrite the defaults from HTMLgenerator() and createItem() with CustomStyle
	$.extend(elementProperties[0],elementProperties[0].CustomStyle);
	};
		//add properties 
		if (elementProperties[0].CLASS) {
			Element.setAttribute('class',elementProperties[0].CLASS);
		};
		if (elementProperties[0].ID) {
			Element.setAttribute('id',elementProperties[0].ID);
		};
		if (elementProperties[0].NAME) {
			Element.setAttribute('name',elementProperties[0].NAME);
		};
		if (elementProperties[0].VALUE) {
			Element.setAttribute('value',elementProperties[0].VALUE);
		};
		if (elementProperties[0].innerHTML) {
				Element.innerHTML = elementProperties[0].innerHTML;
		};
		if (elementProperties[0].BACKGROUND_COLOR) {
				Element.style.backgroundColor = elementProperties[0].BACKGROUND_COLOR;
		};
		if (elementProperties[0].COLOR) {
				Element.style.color = elementProperties[0].COLOR;
		};
		if (elementProperties[0].FONT_SIZE) {
				Element.style.fontSize = elementProperties[0].FONT_SIZE;
		};
	return Element;
};


/*
createItem(id,parentDiv,price):
	IN: id - name of an item in the format of location of in json, 
				Example: id = root(ELMNT_ID_SPACE_CHAR)parent(ELMNT_ID_SPACE_CHAR)child(ELMNT_ID_SPACE_CHAR)item
				(ELMNT_ID_SPACE_CHAR) is a GLOBAL VAR
		parentDiv - the div ID where the new element being created should be nested
		price - price of the item
	PURPOSE: create HTML element for a menu item nested under parent category 
	OTHER FUNCTIONS USED:
			none
	OUT: nothing
*/
function createItem(id,parentDiv,CustomStyle,price){

	var nm = id.substring(id.lastIndexOf(ELMNT_ID_SPACE_CHAR)+1);//create var for elements name attribute
	var newItem = HTMLelement("p",{CLASS:'item stockYES',ID:id,VALUE:price,NAME:nm,innerHTML:nm,CustomStyle});
	document.getElementById(parentDiv).appendChild(newItem);
};
/*
addItemToOrder(Name,count,price,mod):
	IN: id - element ID of menu item
		count - used to create unique element ID when there is a duplicate order. example, two burgers.
		price - price of the item
		mod - if the menu item is a modifier, example 'extra cheese', pass through and go to modifyItemInOrder()
	PURPOSE: add the clicked menu item to the orderArea div. 
	OTHER FUNCTIONS USED:
			updateOrderTotal()
			modifyItemInOrder()
			HTMLelement()
	OUT: nothing
*/
function addItemToOrder(id,count,price,mod){
	var modify = mod || false;
	var Name = id.substring(id.lastIndexOf(ELMNT_ID_SPACE_CHAR)+1);//create var for elements name attribute
	if (!modify) {
	//	ORDER_TOTAL += parseFloat(price);
		var itemName = Name+'-'+count;
		var newItem = HTMLelement("ul",{ID:itemName,VALUE:price,NAME:id});
		document.getElementById('orderArea').appendChild(newItem);
		$('#'+itemName).html(Name.toUpperCase() +'  $'+price);
		updateOrderTotal();

	}else {modifyItemInOrder(Name,count,price,id);};
};

/*
modifyItemInOrder(Name,count,price,id):
	IN: Name - the item name, example 'cheese'
		count - used to create unique element ID when there is a duplicate.
		price - price of the item
		id - element ID of menu item. the id is also equal to the items location in JSON
				Example: id = root(ELMNT_ID_SPACE_CHAR)parent(ELMNT_ID_SPACE_CHAR)child(ELMNT_ID_SPACE_CHAR)item
				(ELMNT_ID_SPACE_CHAR) is a GLOBAL VAR
	PURPOSE: add the clicked menu item modifier to the orderArea div. 
	OTHER FUNCTIONS USED:
			updateOrderTotal()
			HTMLelement()
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
	var newItem = HTMLelement("li",{NAME:id,ID:itemName,VALUE:price});

	itemToModify.append(newItem);
	$('#'+itemName).html(Name.toUpperCase() +'  $'+price);
	updateOrderTotal();
}	
	
/*
display_CategoryView(parentDiv):
	IN: parentDiv - the element that was clicked
	PURPOSE: Display content to user. Take the nested content
		 of the 'terminal' element clicked and display the content in 
		 'categoryView' which is the middle column in view.  
		 If there is content in 'categoryView' div already remove
		it and return to it's correct parent in 'terminal'. 
	OTHER FUNCTIONS USED:
			none
	OUT: nothing
*/
function display_CategoryView(parentDiv) {
	var smallDsply;

	if (SCREEN_WIDTH_MEDIA_QUERY>=screen.width) { smallDsply = true;}
	else {smallDsply = false;};
	
	smallDsply=false;//hard OVERIDE
	
	var previousSelection = $('.ActiveCategory');
	console.log(previousSelection);
	console.log(parentDiv.hasClass('ActiveCategory'));
	if(smallDsply && parentDiv.hasClass('ActiveCategory')){parentDiv.children().toggle();};
	var view = $('#categoryView');

	if (previousSelection.length>0 && !smallDsply) {
		view.find('*').css('display','none');
		view.children().not('#itemView').appendTo($('#'+previousSelection[0].id));//dont remove the #itemView element when returning data to parent
	}else {previousSelection.find('*').css('display','none');}
	
	//make 'mods' below all of the items
	if(!smallDsply){ parentDiv.children().not("[name='mods']").prependTo(view);
	parentDiv.children("[name='mods']").appendTo(view);}
	else {parentDiv.children("[name='mods']").appendTo(parentDiv);};

   if(view.children().css('display') ==='none'){
			view.children().toggle();}
	else {parentDiv.children().toggle();};
			
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
	OTHER FUNCTIONS USED:
			none
			
	OUT: nothing
*/
function display_ItemView(parentDiv) {

	var previousSelection = $(".ActiveItem");

	var view = $('#itemView');
   
   //put the elements being viewed back to their parent
	if (view.children().length>0 ) {
		view.children().appendTo(previousSelection);
		view.empty();}

	previousSelection.removeClass("ActiveItem");
	parentDiv.addClass("ActiveItem");
	
	//toggle the button if it's the same one pressed
	if(previousSelection.attr('id') === parentDiv.attr('id')){
		previousSelection.children().toggle();
		parentDiv.removeClass("ActiveItem");		
		return;};

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
	OTHER FUNCTIONS USED:
			none
			
	OUT: nothing
*/
function display_ItemModifiers(mods) {
	mods.children().css('width','100%');
	mods.children().toggle();	
};

/*
ItemDepthInTree(itemNameString):
	IN: itemNameString - a string that represents the location of the clicked element in DOM and JSON
		Example: id = root(ELMNT_ID_SPACE_CHAR)parent(ELMNT_ID_SPACE_CHAR)child(ELMNT_ID_SPACE_CHAR)item
				(ELMNT_ID_SPACE_CHAR) is a GLOBAL VAR
	PURPOSE: Determine where the clicked element and it's associated category
	OTHER FUNCTIONS USED:
			none
			
	OUT: an array of all occurrence of 'ELMNT_ID_SPACE_CHAR'.  if empty, didn't occur.  
			each occurrence represents a down the DOM nested structure and JSON
*/
function ItemDepthInTree(itemNameString) {
    var indexes = [], i;
    for(i = 0; i < itemNameString.length; i++)
        if (itemNameString[i] === ELMNT_ID_SPACE_CHAR)
            indexes.push(i);
    return indexes;
};

/*
updateOrderTotal():
	IN: nothing
	PURPOSE:  get the 'value' attribute of all items in the 'orderArea'  add them up
				and assign result to the global ORDER_TOTAL.
	OTHER FUNCTIONS USED:
			none
	OUT: set global ORDER_TOTAL
*/
function updateOrderTotal() {
var all_items_ordered= 	document.getElementById('orderArea').getElementsByTagName("*");
var i;
ORDER_TOTAL = 0;
for (i=0;i < all_items_ordered.length; i++) {
	ORDER_TOTAL += parseFloat(all_items_ordered[i].getAttribute('value'));
	};
$('#orderTotal').html('Total:  $'+ORDER_TOTAL.toFixed(2));//force 2 decimals
};

/*
create_orderData_json()

*****MAKE ME
this function needs to grab everything in orderArea and pack into a json
this will replace the direct adding to ORDER_TOTAL in updateOrderTotal

*/
function create_orderData_json(){
	var orderArea = $('#orderArea');
	console.log(orderArea.children().length);
   for (var i=0; i<orderArea.children().length; i++){
	console.log(orderArea.children().attr('name'));
	}
};



/*
checkBootstrap_col_class()
	IN: nothing
	PURPOSE: check what bootstrap grid class is being used on terminal.
				determine at what screen width bootstrap responsive view kicks in
				change how click handlers for category and item view work.
	OTHER FUNCTIONS USED:
			none
			
	OUT: set global SCREEN_WIDTH_MEDIA_QUERY
*/
function checkBootstrap_col_class() {
//BOOTSTRAP grid class widths
/*
.col-xs-*: none (auto)
.col-sm-*: 750px
.col-md-*: 970px
.col-lg-*: 1170px */

	var terminal_col_class = document.getElementById('terminal').getAttribute('class');
	terminal_col_class = terminal_col_class.substring(terminal_col_class.indexOf("col-")+4,terminal_col_class.indexOf("col-")+6);

	switch(terminal_col_class) {
		case 'xs':
					SCREEN_WIDTH_MEDIA_QUERY = 0;
					break;
		case 'sm':
					SCREEN_WIDTH_MEDIA_QUERY = 750;
					break;
		case 'md':
					SCREEN_WIDTH_MEDIA_QUERY = 970;
					break;
		case 'lg':
					SCREEN_WIDTH_MEDIA_QUERY = 1170;
					break;
		};
};


/*
assign_ClickHandlers():

IMPORTANT CONTROL FUNCTION
all click assignments are assigned and defined here.  Because content is dynamically created
this function is called when all the HTML elements have been built.  Otherwise clicks can't bind because
elements don't exist yet.

GLOBALS USED:
	ORDER_DATA
	ORDER_TOTAL

OTHER FUNCTIONS USED:
	addItemToOrder()
	display_ItemView()
	display_ItemModifiers()
	display_CategoryView()
	ItemDepthInTree()
	updateOrderTotal()
*/

function assign_ClickHandlers() {
	
	/*---- ITEMS with SPECIAL modifiers Click Event-----*/
		$('p.item > p.item').click (function (event) { 
				$(this).css('display','none');
				$(this).siblings().css('display','none');
				});
			
	/*---- ITEMS Class Click Event-----*/
		$('.item').click (function (event) { 
			//condition of items with special item specific modifiers
			if ($(this).children().length>0) {
					$(this).children().toggle();
					$(this).children().css('width','100%')};
					
				var count;
				var nm = $(this).attr('id');
				var price = $(this).attr('value');
				var mods;//boolean if 'item' is a modifier or item
				
				if($(this).parent().attr('name') === 'mods' || $(this).parent().is("p")){
					mods = 'mods';}
				else {mods = false;};
				
				//check if item was already ordered, if so add to count so the items ID will be unique	when placed in the orderArea view
				if (!ORDER_DATA["ORDER_DATA"][nm]) {
							ORDER_DATA["ORDER_DATA"][nm] = 1;}
				else {ORDER_DATA["ORDER_DATA"][nm] += 1;}
				count = ORDER_DATA["ORDER_DATA"][nm];
				
				addItemToOrder(nm,count,price,mods);
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

				var currentItem = $(".editItem");//nothing if no element with class editItem
				var Clicked = $(event.target);
				
				//orderArea not div, not an item was clicked
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
				console.log(currentItem);
				
				//if currentItem has child modifiers remove them
				while(currentItem.children().length>0){
					currentItem.children().first().remove();
				};
				currentItem.remove();
				$(this).css('visibility','hidden');
				$("#modify").css('visibility','hidden');
				updateOrderTotal();
			});
			
	/*---- modify button Click Event-----*/		
	// FIX! this is hard coded for a item that is in a tree parent>child>item
			$("#modify").click (function (event) {
				var currentItem = $(".editItem");
				var loc = currentItem.attr("name");
				var depth = ItemDepthInTree(loc);
				var parentCategory = loc.substring(0,depth[0]);
				$('#'+ parentCategory).trigger("click");
				var subCategory = loc.substring(0,depth[1]);
				$('#'+subCategory).trigger("click");
				var mods = subCategory + ELMNT_ID_SPACE_CHAR + 'mods';
				$('#'+mods).trigger("click");
				
			});
};

$(document).ready(function(){
	/*test HTMLelement()*/
	//$('#terminal').append(HTMLelement("div",{CLASS:"test",innerHTML:'test',ID:"xyz",BACKGROUND_COLOR:'red'}));
	
	//determine what size screen bootstrap will switch to responsive layout
	checkBootstrap_col_class();

	mySocket = io.connect();//create new websocket, 
	
	/* ON LOAD sending a json with key term 'buttonBuilder'
	which will cause server to respond with a master json used to
	build the buttons on the page*/
	mySocket.send(JSON.stringify({'buttonBuilder':1}));
	
	document.getElementById('sendOrder').onclick = function (){
		create_orderData_json();
		mySocket.send(JSON.stringify(ORDER_DATA));
		//$('#orderArea').empty();
	};

	/* FUNCTION TO READ INBOUND DATA*/
	mySocket.on('message', function(msg) {
			var JSONdata = JSON.parse(msg);

			/* ALL JSON data coming from server will have one parent key in the tree.  
			This is used to route the JSON to appropriate place through series of IF's*/
			
			if (Object.keys(JSONdata)[0] === 'buttonBuilder'){
				console.log(JSONdata);
				ButtonBuilder(JSONdata,'buttonBuilder');
			}
			if (Object.keys(JSONdata)[0] === 'confirmReceipt'){
				if (JSONdata.confirmReceipt.received ==='true') {
					console.log('Order was received');
				};
				
				
			};
			
		});
	
	//make OrderArea size match screen
	$('#orderArea').css('height',screen.height-(screen.height/2));

});