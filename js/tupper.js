$(document).ready(function () {

    // configure the drawing grid
    function config() {
        return {
            "rows": 17,
            "cols": 107,
            "size": 6,
            "separation": 2,
            "fcolor": "#000000",
            "bcolor": "#ffffff"
        };
    }

    // grid configuration bind
    var gridConf = config();

    // top canvas references
    var canvasRef = $("#canvas")[0];
    var canvas2Dctx = canvasRef.getContext('2d');

    // bottom canvas references
    var rCanvasRef = $("#renderCanvas")[0];
    var rCanvas2Dctx = rCanvasRef.getContext('2d');

    // create the grids
    var grid = new Array(gridConf.cols * gridConf.rows);
    var rgrid = new Array(gridConf.cols * gridConf.rows);

    // offset required in the y-axis to draw the formula in the plane
    var tupperSelf =
        bigInt("9609393799189588849716729621278527547150043396601293066515055" +
            "1927170280239526642468964284217435071812126715378277062335599" +
            "3237280874144307891325963941337723487857735749823926629715517" +
            "1737169951652328905382216124032388558661840132355851360488286" +
            "9333790249145422928866708109618449609170518345406782773155170" +
            "5405381627380967602565625016981482083418783163849115590225610" +
            "0036523513703438744618483787372381982248498634650331594100549" +
            "7470059313833922649724946175154572836670236974546101465599793" +
            "3798537483143786841806593422227898388722980000748404719");

    // get the offset inside the canvas
    function getOffset(el) {
        var xoff = 0;
        var yoff = 0;

        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            xoff += el.offsetLeft - el.scrollLeft;
            yoff += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        return {
            top: yoff,
            left: xoff
        };
    }

    // get actual mouse position in the page
    function getMousePosition(canvas, evt) {
        //var rect = canvas.getBoundingClientRect();
        var offset = getOffset(canvas);
        return {
            x: evt.pageX - offset.left,
            y: evt.pageY - offset.top
        };
    }

    // this translates the block given to the actual pixel coordinates that
    // the left bottom edge of block to be drawn has
    function getCoordinateByNumber(num) {
        return (gridConf.separation + num * (gridConf.separation + gridConf.size));
    }

    // this maps the pixel coordinates of the block rectangle given to the
    // discrete block in the grid.
    function getNumByCoordinate(cord) {
        return Math.floor((cord - gridConf.separation) / (gridConf.size + gridConf.separation));
    }

    // this toggles black/white in the grid
    function toggleColor(mousePos) {
        var xnum = getNumByCoordinate(mousePos.x);
        var ynum = getNumByCoordinate(mousePos.y);
        var yc, xc;

        //console.log("x: " + xnum + " y: " + ynum);

        //.valueOf()
        if (grid[(ynum * gridConf.cols) + xnum] == "White") {
            canvas2Dctx.beginPath();
            canvas2Dctx.fillStyle = gridConf.fcolor;
            xc = getCoordinateByNumber(xnum);
            yc = getCoordinateByNumber(ynum);
            canvas2Dctx.rect(xc, yc, gridConf.size, gridConf.size);
            grid[(ynum * gridConf.cols) + xnum] = "Black";
            canvas2Dctx.fill();
        } else if (grid[(ynum * gridConf.cols) + xnum] == "Black") {//.valueOf()
            canvas2Dctx.beginPath();
            canvas2Dctx.fillStyle = gridConf.bcolor;
            xc = getCoordinateByNumber(xnum);
            yc = getCoordinateByNumber(ynum);
            canvas2Dctx.rect(xc, yc, gridConf.size, gridConf.size);
            grid[(ynum * gridConf.cols) + xnum] = "White";
            canvas2Dctx.fill();
        }
    }

    // start up function that initializes the two grids
    function loadup() {
        var i, j;
        var x = gridConf.separation;
        var y = gridConf.separation;

        canvasRef.width = getCoordinateByNumber(gridConf.cols);
        canvasRef.height = getCoordinateByNumber(gridConf.rows);
        canvasRef.style.backgroundColor = "#d3d3d3";

        rCanvasRef.width = getCoordinateByNumber(gridConf.cols);
        rCanvasRef.height = getCoordinateByNumber(gridConf.rows);
        rCanvasRef.style.backgroundColor = "#d3d3d3";

        canvas2Dctx.fillStyle = gridConf.bcolor;
        rCanvas2Dctx.fillStyle = gridConf.bcolor;
        canvas2Dctx.beginPath();
        rCanvas2Dctx.beginPath();

        for (i = 0; i < gridConf.rows; i++) {
            for (j = 0; j < gridConf.cols; j++) {
                x = getCoordinateByNumber(j);
                y = getCoordinateByNumber(i);
                canvas2Dctx.rect(x, y, gridConf.size, gridConf.size);
                rCanvas2Dctx.rect(x, y, gridConf.size, gridConf.size);
                grid[(i * gridConf.cols) + j] = "White";
                rgrid[(i * gridConf.cols) + j] = "While";
            }
        }
        canvas2Dctx.fill();
        rCanvas2Dctx.fill();

        $("#tupperNumber").text(0);
    }

    // clear top grid (basically redraw a new one and reset the top grid array)
    function cleanTop() {
        var i, j;
        var x = gridConf.separation;
        var y = gridConf.separation;

        canvasRef.width = getCoordinateByNumber(gridConf.cols);
        canvasRef.height = getCoordinateByNumber(gridConf.rows);
        canvasRef.style.backgroundColor = "#d3d3d3";

        canvas2Dctx.fillStyle = gridConf.bcolor;
        canvas2Dctx.beginPath();

        for (i = 0; i < gridConf.rows; i++) {
            for (j = 0; j < gridConf.cols; j++) {
                x = getCoordinateByNumber(j);
                y = getCoordinateByNumber(i);
                canvas2Dctx.rect(x, y, gridConf.size, gridConf.size);
                grid[(i * gridConf.cols) + j] = "White";
            }
        }
        canvas2Dctx.fill();
        // reset the number
        $("#tupperNumber").text(0);
    }


    // clear the bottom grid, in the same philosophy as the top one.
    function cleanBottom() {
        var i, j;
        var x = gridConf.separation;
        var y = gridConf.separation;

        rCanvasRef.width = getCoordinateByNumber(gridConf.cols);
        rCanvasRef.height = getCoordinateByNumber(gridConf.rows);
        rCanvasRef.style.backgroundColor = "#d3d3d3";

        rCanvas2Dctx.fillStyle = gridConf.bcolor;
        rCanvas2Dctx.beginPath();

        for (i = 0; i < gridConf.rows; i++) {
            for (j = 0; j < gridConf.cols; j++) {
                x = getCoordinateByNumber(j);
                y = getCoordinateByNumber(i);
                rCanvas2Dctx.rect(x, y, gridConf.size, gridConf.size);
                rgrid[(i * gridConf.cols) + j] = "White";
            }
        }
        rCanvas2Dctx.fill();
    }

    // render the top  grid (when drawing the actual formula)
    function renderTopGrid() {

        var i, j;
        var x = gridConf.separation;
        var y = gridConf.separation;
        var prev = null;

        canvasRef.width = getCoordinateByNumber(gridConf.cols);
        canvasRef.height = getCoordinateByNumber(gridConf.rows);
        canvasRef.style.backgroundColor = "#d3d3d3";

        canvas2Dctx.fillStyle = gridConf.bcolor;
        canvas2Dctx.beginPath();

        for (i = 0; i < gridConf.rows; i++) {
            for (j = 0; j < gridConf.cols; j++) {
                x = getCoordinateByNumber(gridConf.cols - j - 1);
                y = getCoordinateByNumber(i);

                // copy bottom to top as well
                grid[(i * gridConf.cols) + gridConf.cols - j - 1] = rgrid[(i * gridConf.cols) + j];
                if (rgrid[(i * gridConf.cols) + j] == "White") {
                    if (prev == null || prev == "Black") {
                        canvas2Dctx.fill();
                        canvas2Dctx.beginPath();
                        canvas2Dctx.fillStyle = gridConf.bcolor;
                        prev = "White";
                    }
                } else {
                    if (prev == null || prev == "White") {
                        canvas2Dctx.fill();
                        canvas2Dctx.beginPath();
                        canvas2Dctx.fillStyle = gridConf.fcolor;
                        prev = "Black";
                    }
                }
                canvas2Dctx.rect(x, y, gridConf.size, gridConf.size);
            }
        }
        canvas2Dctx.fill();
        //console.log("Rendered bottom grid");
    }


    // render the bottom grid after the formula evaluation
    function renderBottomGrid() {

        var i, j;
        var x = gridConf.separation;
        var y = gridConf.separation;
        var prev = null;

        rCanvasRef.width = getCoordinateByNumber(gridConf.cols);
        rCanvasRef.height = getCoordinateByNumber(gridConf.rows);
        rCanvasRef.style.backgroundColor = "#d3d3d3";

        rCanvas2Dctx.fillStyle = gridConf.bcolor;
        rCanvas2Dctx.beginPath();

        for (i = 0; i < gridConf.rows; i++) {
            for (j = 0; j < gridConf.cols; j++) {
                x = getCoordinateByNumber(gridConf.cols - j - 1);
                y = getCoordinateByNumber(i);

                if (rgrid[(i * gridConf.cols) + j] == "White") {
                    if (prev == null || prev == "Black") {
                        rCanvas2Dctx.fill();
                        rCanvas2Dctx.beginPath();
                        rCanvas2Dctx.fillStyle = gridConf.bcolor;
                        prev = "White";
                    }
                } else {
                    if (prev == null || prev == "White") {
                        rCanvas2Dctx.fill();
                        rCanvas2Dctx.beginPath();
                        rCanvas2Dctx.fillStyle = gridConf.fcolor;
                        prev = "Black";
                    }
                }
                rCanvas2Dctx.rect(x, y, gridConf.size, gridConf.size);
            }
        }
        rCanvas2Dctx.fill();
        //console.log("Rendered bottom grid");
    }

    // convert the grid into a binary representation that can be
    // used in the formula to draw it. Basically
    function convertGridToBinaryString() {
        var i, j;
        var binStr = "";
        var wcnt = 0;
        var bcnt = 0;

        for (i = 0; i < gridConf.cols; i++) {
            for (j = gridConf.rows - 1; j >= 0; j--) {
                if (grid[(j * gridConf.cols) + i] == "White") {
                    binStr += "0";
                    wcnt++;
                } else {
                    binStr += "1";
                    bcnt++;
                }
            }
        }
        return (binStr);
    }

    // plain conversion of the binary string to its decimal equivalent
    function convertBinStrToDec(binStr) {
        var i, j = 0;
        var exponent = bigInt(2);
        var res = bigInt.zero;
        //console.log(binStr.toString());
        for (i = binStr.length - 1; i >= 0; i--) {
            if (binStr.charAt(i) == "1") {
                res = res.add(exponent.pow(j));
            }
            j = j + 1;
        }
        // finally show the result
        //console.log("Pow result: " + res.toString());
        // k = k * 17
        res = res.multiply(17);
        return (res);
    }

    // make the string glorious! (basically append a space in triplet)
    function beautifyText(str) {
        var slen = str.length;
        var beautifulString = "";
        var i = 0;
        if (slen > 0) {
            for (i = 0; i < slen; i++) {
                beautifulString = beautifulString + str.charAt(i);
                if ((i + 1) % 3 == 0) {
                    beautifulString = beautifulString + " ";
                }
            }
        }
        return (beautifulString);
    }

    // evaluate the formula and procude the bottom grid which reflects the
    // number given in bigDec
    function evaluateFormula(bigDec) {
        var i;
        var j;
        var v17 = bigInt(17);
        var xmul17 = bigInt.zero;
        var ydiv17 = bigInt.zero;
        var ymod17 = bigInt.zero;
        var shiftExp = bigInt.zero;
        var curk = bigInt.zero;
        var shouldDraw = false;

        // set the k value
        $("#tupperNumber").text(beautifyText(bigDec.toString()));
        for (i = 0; i < gridConf.rows; i++) {
            curk = bigDec.add(i);
            //console.log("Evaluating k: " + curk.toString());

            for (j = 0; j < gridConf.cols; j++) {
                // y / 17
                ydiv17 = curk.divide(v17);
                // 17 * x
                xmul17 = v17.multiply(j);
                // y mod 17
                ymod17 = curk.mod(v17);
                // (17*x) + (y mod 17)
                shiftExp = xmul17.add(ymod17);

                //
                if (shiftExp.greater(0) == true) {
                    shouldDraw = ydiv17.shiftRight(shiftExp.add(-1)).mod(4).greater(1);
                }
                else {
                    shouldDraw = ydiv17.mod(2).greater(0);
                }

                // mark black if we draw the block or white if we don't
                if (shouldDraw == true) {
                    rgrid[((i) * gridConf.cols) + j] = "Black";
                }
                else {
                    rgrid[((i) * gridConf.cols) + j] = "White";
                }
            }
        }

    }

    loadup();

    /**
     *
     * -- Button click event handlers
     *
     */

    // mouse click event handler
    function onMouseClick(evt) {
        var mousePos = getMousePosition(canvasRef, evt);
        toggleColor(mousePos);
    }

    // bind the mousedown event of the canvas
    $(canvasRef).mousedown(onMouseClick);


    // draw what is shown in the top grid to the bottom
    $("#drawTop").mousedown(function (evt) {
        if (evt.which == 1) {
            evaluateFormula(convertBinStrToDec(convertGridToBinaryString()));
            renderBottomGrid();
        }
    });

    // draw the pattern formula
    $("#drawPattern").mousedown(function (evt) {
        if (evt.which == 1) {
            evaluateFormula(tupperSelf);
            renderTopGrid();
            renderBottomGrid();
        }
    });

    // clear the top grid
    $("#clearTop").mousedown(function (evt) {
        if (evt.which == 1) {
            cleanTop();
        }
    });

    // clear the bottom grid
    $("#clearBottom").mousedown(function (evt) {
        if (evt.which == 1) {
            cleanBottom();
        }
    });

    // clear both grids
    $("#clearBoth").mousedown(function (evt) {
        if (evt.which == 1) {
            loadup();
        }
    });

});