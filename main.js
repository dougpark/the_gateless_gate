// this runs when page is finished loading
$(document).ready(function () {

    // set text
    $("#main").html("Hello World");

    // button click
    $("#btn1").click(function () {
        changeBackgroundColor();
    });
})

function changeBackgroundColor() {

    if ($('#main').hasClass('bg-success')) {
        $('#main').removeClass('bg-success');
        $('#main').addClass('bg-primary');
    } else {
        $('#main').removeClass('bg-primary');
        $('#main').addClass('bg-success');
    }
}