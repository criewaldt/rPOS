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

/*Used to build buttons on the screen based on what the server sends
in response to ButtonBuilder request*/
function ButtonBuilder() {
	/*
	POPULATE DROP DOWN WITH JSON
	http://stackoverflow.com/questions/21747878/how-to-populate-a-dropdown-list-with-json-data-dynamically-section-wise-into-th
	
	*/
	mySocket.send('buttonBuilder');

	var totalButtons = CountMyItems(AllMyItems);
	var myItem = Object.keys(AllMyItems);
	for (i=0; i<totalButtons;i++) {
		var newButton = document.createElement("div");
		newButton.setAttribute('class','button');
		newButton.setAttribute('id',myItem[i]);
		document.getElementById('register').appendChild(newButton);
		$('#'+myItem[i]).append("<p>" + myItem[i]+"</p>");
		$('#'+myItem[i]).append("<p>$ " + AllMyItems[myItem[i]]+"</p>");
	};
};


$(document).ready(function(){
	mySocket = io.connect();//create new websocket, 

	/* FUNCTION TO SEND MESSAGE ON CLICK*/
	$(".button").click(function(event){
		mySocket.send('buttonBuilder');
	});
	
	/* FUNCTION TO READ INBOUND DATA */
	mySocket.on('message', function(msg) {
		  //console.log(msg['buttonBuilder']);	
		  if (msg['buttonBuilder']) {
		  	console.log(msg);
		  	console.log(CountMyItems(msg));
		  	console.log(CountMyItems(msg.buttonBuilder));
		  	var MyTest = msg.buttonBuilder.burgers;
		  	console.log(MyTest[0].BBQ);
		  	for (index in MyTest) {
		  		$('#testArea').append('<li><a href="#" item="'+MyTest[index].BBQ+'" price="'+MyTest[index].CHZ+'">TEST</a></li>');
		  		//$('#testArea').append("<p>" + MyTest[index].BBQ+"</p>");
		  	}
		  }else console.log('false');
	});
	
	 $('a').on('click', function(){
    $('#show').html(   'Item : ' + $(this).attr('item') + '| Price : ' +  $(this).attr('price')   );
  });
	
	
});
