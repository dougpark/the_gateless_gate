// this runs when page is finished loading
$(document).ready(function () {

    // set text
    $("#main").html("Hello World");

    // button click
    $("#btn1").click(function () {
        changeBackgroundColor();
    });
})

function loadFile() {

    console.log('load file here');
}