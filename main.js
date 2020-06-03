// this runs when page is finished loading
$(document).ready(function () {

    // left = 37
    // up = 38
    // right = 39
    // down = 40
    $(document).keydown(function (e) {
        let up = [0, 37, 38, 65, 87];
        let down = [0, 32, 39, 40, 68, 83];
        let r = [0, 82];
        console.log(e.keyCode);
        if (up.indexOf(e.keyCode) > 0) {
            scrollDir(-1);
        } else if (down.indexOf(e.keyCode) > 0) {
            scrollDir();
        } else if (r.indexOf(e.keyCode) > 0) {
            scrollToId(true);
        }

    });

})

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function inViewport(element) {
    if (typeof jQuery === "function" && element instanceof jQuery) {
        element = element[0];
    }
    var elementBounds = element.getBoundingClientRect();
    return (
        elementBounds.top >= 0 &&
        elementBounds.left >= 0 &&
        elementBounds.bottom <= $(window).height() &&
        elementBounds.right <= $(window).width()
    );
}

function idInCurrentView() {
    for (id = 1; id <= 49; id++) {
        if (inViewport($('#koan-' + id))) {
            break;
        }
    }
    return id;
}

function scrollDir(direction = 1) {

    let currId = idInCurrentView();

    if (direction > 0) {
        if (currId < 49) {
            scrollToId(currId + 1);
        }
    } else {
        if (currId > 1) {
            scrollToId(currId - 1);
        }
    }

}

function scrollToId(id) {
    if (!Number.isInteger(id)) {
        id = randomIntFromInterval(1, 49);
    }

    $('#koan-' + id).scrollTo();

}

$.fn.scrollTo = function (speed) {
    if (typeof (speed) === 'undefined')
        speed = 500;

    $('html, body').animate({
        scrollTop: parseInt($(this).offset().top - 100)
    }, speed);
};

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


    //console.log(koanList);

}

function disp(row, index, array) {

    if (row.header) {
        let text = row.header;
        text.forEach(function (row) {
            $("#about-header").append('<h6 class="comment-1 text-justify">' + row + '</h6>');
        });
    }

    if (row.title) {

        let title = row.title;

        var patt = new RegExp("[0-9]+\\.");
        var result = patt.exec(title);
        if (result != null) {
            title = title.replace(result, "");
            var patt = new RegExp("[0-9]{1,}");
            var result = patt.exec(result);



            $("#main").append('<article id="koan-' + result + '"> ');

            $("#main").append('<h2 class="title-1 text-center text-uppercase">&#9866; ' + result + ' &#9866;</h2>');
        }

        $("#main").append('<h2 class="title-1 text-center text-uppercase">' + title + '</h2><br>');
    }

    if (row.body) {
        let text = row.body;
        let drop = "drop-cap";
        text.forEach(function (row) {
            $("#main").append('<h6 class="body-1 text-justify ' + drop + '">' + row + '</h6>');
            drop = "";
        })

    }
    if (row.comment) {
        $("#main").append('<hr style="width:50%;text-align:center;"></hr>');

        let text = row.comment;
        text.forEach(function (row) {
            $("#main").append('<h6 class="comment-1 text-justify">' + row + '</h6>');
        })

    }
    if (row.verse) {
        let line = '<blockquote><h6 class="verse-1 text-justify">';
        let text = row.verse;
        let count = 0;
        text.forEach(function (row) {
            if (count > 0) {
                line += '&nbsp;'
            }
            line += row + '</br>';
            count++;
        })
        line += '</h6 > </blockquote><br></div>';

        $("#main").append(line);


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

    var patt02a = new RegExp('^[ ]{0,}\n');
    var result02a = patt02a.exec(row);
    if (result02a != null) {
        skip = 1;
    }
    if (row.length < 10) {
        skip = 1;
    }

    // remove end \r here
    var patt03 = new RegExp('\r');
    row = row.replace(patt03, '');
    var patt03a = new RegExp('\n');
    row = row.replace(patt03a, '');



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

            if (row) {
                koanList[koanList.length - 1].header.push(row);
            }
        }

        // bodyStart is set in Title, so start body next round
        if (bodyStart == 1) {
            body = 1;
        }

    }





}