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



        }
    });
}

function processText(str) {
    var header = {
        'header': []
    };
    koanList.push(header);

    // put each line into an array
    var input = str.split("\n");

    // parse each line of input filej - pass 1
    input.forEach(parse);

    // final cleanup phase - pass 2
    koanList.forEach(parse2);

    koanList.forEach(disp);


    console.log(koanList);

}

function disp(row, index, array) {

    if (row.title) {
        $("#main").append('<h2 class="title-1 text-uppercase">' + row.title + '</h2>');
    }
    if (row.body) {
        $("#main").append('<h6 class="body-1 text-justify">' + row.body + '</h6>');
    }
    if (row.comment) {
        $("#main").append('<h6 class="comment-1 text-justify">' + row.comment + '</h6>');
    }
    if (row.verse) {
        $("#main").append('<h6 class="verse-1 text-justify">' + row.verse + '</h6>');
    }

}

function parse2(row, index, array) {

    if (row.comment) {
        let com = row.comment;
        let index = com.length - 1;
        let last = com[index];
        com.splice(index, 1); // remove from com array

        row.verse.unshift(last); // add to beginning of verse array

    }


}

var koanList = [];
var koanCount = 0;

// detected on previous loops so have to keep alive
var comment = 0;
var bodyStart = 0;
var body = 0;

function parse(row, index, array) {

    // detected each loop so start fresh
    var skip = 0;
    var title = 0;
    var verse = 0;

    // title 
    var patt = new RegExp("[0-9]+\\.");
    var result = patt.exec(row);
    if (result != null) {

        // reset trackers
        title = 1;
        body = 0;
        bodyStart = 1; // body starts on next loop
        verse = 0;

        koanCount += 1;

        var koan = {
            'koan': koanCount,
            'title': "",
            'body': [],
            'comment': [],
            'verse': [],
        };

        koan.title = row;
        koanList.push(koan);
    }

    //body
    // starts after title is found

    // comment
    var patt2 = new RegExp("comment:");
    var result2 = patt2.exec(row);
    if (result2 != null) {
        comment = 1;
        if (body == 1) {
            bodyStart = 0;
            body = 0;
        }
    }

    //verse
    var patt3 = new RegExp("^ ");
    var result3 = patt3.exec(row);
    if (result3 != null) {
        verse = 1;
        comment = 0;
    }


    // carriage-return - check for 1 or more spaces before \r
    var patt02 = new RegExp('^[ ]{0,}\r');
    var result02 = patt02.exec(row);
    if (result02 != null) {
        skip = 1;
    }

    // remove end \r here


    if (skip == 0) {
        if (body == 1) {
            //$("#main").append('<p class="body-1">' + 'body-> ' + row + '</p>');
            koanList[koanList.length - 1].body.push(row);
        } else
        if (verse == 1) {
            //$("#main").append('<p class="verse-1">' + 'verse-> ' + row + '</p>');
            koanList[koanList.length - 1].verse.push(row);
        } else

        if (comment == 1) {
            //$("#main").append('<p class="comment-1">' + 'comment-> ' + row + '</p>');
            koanList[koanList.length - 1].comment.push(row);
        } else

        if (title == 1) {
            //$("#main").append('<p class="title-1">' + 'title-> ' + row + '</p>');
        } else {
            //$("#main").append('<p class="unknown">' + 'header-> ' + row + '</p>');

            koanList[koanList.length - 1].header.push(row);
        }

        // bodyStart is set in Title, so start body next round
        if (bodyStart == 1) {
            body = 1;
        }

    }





}