// Word Cloud prototype implementation using <canvas>
// Jan Forst, 2012-04-10
var DATA = [['vandalism', 100],
                    ['petty theft', 83],
                    ['robbery', 82],
                    ['rape', 80],
                    ['arson', 80],
                    ['battery', 79],
                    ['murder', 79],
                    ['possession', 79],
                    ['marijuana', 76],
                    ['DUI', 64],
                    ['view', 52],
                    ['Christmas', 16]];

var OFFSET = 8;
//var wordCloudArray = [];

//var randColor = '+Math.floor((Math.random() * 255)+0)+'; // Generate RaNdOm ColOR JON

function getFont(style, size, name) {
    return (style + ' ' + size + 'px ' + name);
}

// text - is the charge_description
function measureText(text, font, size, context) {
    //console.log("Inside WC measureText()");
    //console.log("$$$$ text = " + text);
    //console.log("^^^^ size = " + size);
    context.font = font;
    var metrics = context.measureText(text);
    return {
        width: metrics.width + 2 * OFFSET,
        //height: Math.round(size * 1.5)
        height: Math.round( size )
    };
}

function putText(text, font, x, y, context) {
    context.font = font;
    context.textBaseline = 'top';
    context.fillStyle = 'rgba('+Math.floor((Math.random() * 255)+0)+','+Math.floor((Math.random() * 255)+0)+','+Math.floor((Math.random() * 255)+0)+',0.5';
    context.fillText(text, x, y);
}

function testCollision(pixels) {
    var i;

    for (i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] > 128) {
            return true;
        }
    }

    return false;
}

function getCloud(data, style, name, testid, cloudid) {
    var canvasTest = document.getElementById(testid);
    var contextTest = canvasTest.getContext("2d");
    var canvasCloud = document.getElementById(cloudid);
    var contextCloud = canvasCloud.getContext("2d");

    var w = 1000;
    var h = 300;

    var i;

    for (i = 0; i < data.length; i++) {
        var m = data[i];
        var text = m[0];

        //text.rotate(Math.PI*2/(i*6));

        var size = m[1] / 2;

        size = Math.max(Math.round(size * 0.85), 10);

        var col = true;
        var max = 10;
        var font = getFont(style, size, name);
        var measure = measureText(text, font, size, contextTest);

        //console.log("SIZE = " + size);

        while (col && (max-- > 0)) {


            var x = Math.round(Math.random() * (w - measure.width - OFFSET)) + 2 * OFFSET;
            var y = Math.round(Math.random() * (h - measure.height));

            var bx = x - OFFSET;
            bx = (bx < 0) ? 0 : bx;
            var by = y;
            var bw = measure.width;
            var bh = measure.height;

            contextCloud.drawImage(contextTest.canvas, bx, by, bw, bh, bx, by, bw, bh);
            putText(text, font, x, y, contextTest);

            var img = contextTest.getImageData(bx, by, bw, bh);
            col = testCollision(img.data);

            if (col) {
                contextTest.clearRect(bx, by, bw, bh);
                contextTest.drawImage(contextCloud.canvas, bx, by, bw, bh, bx, by, bw, bh);
                //size = Math.max(Math.round(size * 0.85), 10);
                //size = Math.max( size );

                //console.log("NEW SIZE = " + size);

                font = getFont(style, size, name);

                measure = measureText(text, font, size, contextTest);
            }

            contextCloud.clearRect(bx, by, bw, bh);
        }
    }
}

$(document).ready(function() {   
    $('#wordCloud').submit(function(evt) {
        console.log("Word Cloud button clicked");
        //var value = $(evt.target).find('.target').val();

        //if(!isNaN(parseFloat(value)) && isFinite(value)) {
        //    console.log("Just clicked zipcode button " + value);
            //DelphiDemo.wordCloud(value);
       // }
        //DelphiDemo.setWordCloud();
        wordCloudArray = DelphiDemo.getWordCloud();


        //console.log("wordCloudArray");
        //console.log(wordCloudArray);


        //console.log("DATA shit");
        //console.log("DATA[0][0] " + DATA[0][0]);
        //console.log("wordCloudArray[0][0] " + wordCloudArray[0][0]);
       

        for(var i=0; i<wordCloudArray.length; i++){
            //console.log(DATA[i]);
            console.log(wordCloudArray[i]);
        }

        getCloud(wordCloudArray, 'bold italic', 'Amaranth', 'test', 'cloud');

        evt.preventDefault();
    });
});