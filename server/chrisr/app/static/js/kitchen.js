//toggle function for display of tables

//TURNED OFF FOR TESTING
/*
function toggleDisplay(isDisplayed) {
    if (isDisplayed == 'All') {
        document.getElementById("All").style.display = 'block';
        document.getElementById("Hot").style.display = 'none';
        document.getElementById("Cold").style.display = 'none';
        document.getElementById("vp").innerHTML = "rPOS Kitchen Screen: All";
        
    } else if (isDisplayed == 'Hot') {
        document.getElementById("Hot").style.display = 'block';
        document.getElementById("All").style.display = 'none';
        document.getElementById("Cold").style.display = 'none';
        document.getElementById("vp").innerHTML = "rPOS Kitchen Screen: Hot";

    } else if (isDisplayed == 'Cold') {
        document.getElementById("Cold").style.display = 'block';
        document.getElementById("All").style.display = 'none';
        document.getElementById("Hot").style.display = 'none';
        document.getElementById("vp").innerHTML = "rPOS Kitchen Screen: Cold";

    };	
};
*/


//runs at document ready on page load
$( document ).ready(function() {
    //display all on page load
    toggleDisplay('All');
});

//event listener for click of button with 'myButton' class
$('.myButton').click(function() {
    //delete the clicked item from orderData array
    //get index of item in array
    var index = orderData.indexOf(this.id)
    //remove item from array
    orderData.splice(index, 1);
    //remove the row
    document.getElementById(this.id).parentElement.parentElement.remove();
});



