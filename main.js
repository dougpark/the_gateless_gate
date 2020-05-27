// this runs when page is finished loading
$(document).ready(function () {

    // set text
    //$("#main").html("Hello World");

    // button click
    // $("#btn1").click(function () {
    //     changeBackgroundColor();
    // });
})


function loadFile() {

    $.ajax({
        url: "./the_gateless_gate.txt",
        method: "GET",
        success: function (response) {

            processText(response);
            console.log(GateList);

        }
    });
}

function processText(str) {
    var header = {
        'header': []
    };
    GateList.push(header);

    // put each line into an array
    var input = str.split("\n");

    // parse each line of input file
    input.forEach(parse);

}


var GateList = [];
var KoanCount = 0;

// detected on previous loops so have to keep alive
var comment = 0;
var bodyStart = 0;
var body = 0;

function parse(value, index, array) {

    // detected each loop so start fresh
    var skip = 0;
    var title = 0;
    var poem = 0;

    // title 
    var patt = new RegExp("[0-9]+\\.");
    var result = patt.exec(value);
    if (result != null) {

        // reset trackers
        title = 1;
        body = 0;
        bodyStart = 1; // body starts on next loop
        poem = 0;

        KoanCount += 1;

        var koan = {
            'koan': KoanCount,
            'title': "",
            'body': [],
            'comment': [],
            'poem': [],
        };

        koan.title = value;
        GateList.push(koan);
    }

    //body
    // starts after title is found

    // comment
    var patt2 = new RegExp("comment:");
    var result2 = patt2.exec(value);
    if (result2 != null) {
        comment = 1;
        if (body == 1) {
            bodyStart = 0;
            body = 0;
        }
    }

    //poem
    var patt3 = new RegExp("^ ");
    var result3 = patt3.exec(value);
    if (result3 != null) {
        poem = 1;
        comment = 0;
    }


    // carriage-return - check for 1 or more spaces before \r
    var patt02 = new RegExp('^[ ]{0,}\r');
    var result02 = patt02.exec(value);
    if (result02 != null) {
        skip = 1;
    }


    if (skip == 0) {
        if (body == 1) {
            $("#main").append('<p class="body-1">' + 'body-> ' + value + '</p>');
            GateList[GateList.length - 1].body.push(value);
        } else
        if (poem == 1) {
            $("#main").append('<p class="poem-1">' + 'poem-> ' + value + '</p>');
            GateList[GateList.length - 1].poem.push(value);
        } else

        if (comment == 1) {
            $("#main").append('<p class="comment-1">' + 'comment-> ' + value + '</p>');
            GateList[GateList.length - 1].comment.push(value);
        } else

        if (title == 1) {
            $("#main").append('<p class="title-1">' + 'title-> ' + value + '</p>');
        } else {
            $("#main").append('<p class="unknown">' + 'header-> ' + value + '</p>');

            GateList[GateList.length - 1].header.push(value);
        }

        // bodyStart is set in Title, so start body next round
        if (bodyStart == 1) {
            body = 1;
        }

    }





}