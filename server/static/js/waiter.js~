window.mySocket;//setup global var for the websocket
window.TheOrder;//setup global var for the order
window.AllItems;//setup global var for all items that can be ordered


function ButtonBuilder() {
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
		  	console.log('true');
		  }else console.log('false');
	});
	
	
});
