window.mySocket;//setup global var for the websocket
window.TheOrder;//setup global var for the order
window.AllItems;//setup global var for all items that can be ordered


                  
/*used to count items in a list*/
function CountMyItems(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    };
    return size;
};

/*This Function is used to build buttons on the screen*/
function ButtonBuilder() {
	/*
	POPULATE BUTTONS FROM JSON RECEIVED FROM SERVER
	-resources-
	http://stackoverflow.com/questions/21747878/how-to-populate-a-dropdown-list-with-json-data-dynamically-section-wise-into-th
   http://www.encodedna.com/2013/07/dynamically-add-remove-textbox-control-using-jquery.htm	
	*/
	mySocket.send(JSON.stringify({'buttonBuilder':1}));
	var AllMyItems = mySocket.on('message', function(msg) {JSON.parse(msg);});
	console.log(AllMyItems);
	
	
	var totalButtons = CountMyItems(AllMyItems);
	console.log("total buttons: " + totalButtons);
	
	var myItem = Object.keys(AllMyItems);
	console.log("total keys: " + myItem);
	
	for (i=0; i<totalButtons;i++) {
		var newButton = document.createElement("div");
		newButton.setAttribute('class','button');
		newButton.setAttribute('id',myItem[i]);
		document.getElementById('terminal').appendChild(newButton);
		$('#'+myItem[i]).append("<p>" + myItem[i]+"</p>");
		$('#'+myItem[i]).append("<p>$ " + AllMyItems[myItem[i]]+"</p>");
		
	};
};


$(document).ready(function(){
	mySocket = io.connect();//create new websocket, 
	
	/* ON LOAD build the buttons on the page*/
	//ButtonBuilder();
	mySocket.send(JSON.stringify({'buttonBuilder':1}));
	
	
	/* EXAMPLE function to send data on click*/
	$(".button").click(function(event){
		mySocket.send(JSON.stringify(orderData));
	});
	
	/* FUNCTION TO READ INBOUND DATA*/
	mySocket.on('message', function(msg) {
			var readJSON = JSON.parse(msg);
			console.log(readJSON);
			console.log(Object.keys(readJSON));});
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
