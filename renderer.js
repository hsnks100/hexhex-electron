// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

window.setInterval( scroll, 100 );

var lineHeight = 20;
var lines = 35;
var windowSize = lineHeight * lines;

function setHeight(h) {

}
// 24줄 표시됨.
function scroll() {
    if (files.length > 0) {
        if (files[0].binaryData.length > 0) {
            // console.log("top: ", top);
            // console.log("clientHeight: ", t.clientHeight);
        }
    }



}
function HexFile()
{
	
}

HexFile.prototype.div = null;
HexFile.prototype.hexdump = null;
HexFile.prototype.hexoffset = null;
HexFile.prototype.hexscroll = null;
HexFile.prototype.isactive = true; 
HexFile.prototype.position = 0;
HexFile.prototype.binaryData = null;

var files = [];

function addFile(binary, path) {
    for(var i=0; i<files.length; i++) {
        files[i].isactive = false;
        files[i].div.style.display = 'none';
    }
    var f = new HexFile();
    f.binaryData = binary;
    f.isactive = true;
    files.push(f);

    var ul = document.getElementById("ul_files"); 
    var li = document.createElement('li');
        var alink = document.createElement('a'); 
        alink.href = "#";
        var alinkText = document.createTextNode(path);
        alink.appendChild(alinkText);

    li.appendChild(alink);
    ul.appendChild(li); 
    alink.addEventListener('click', function(e) {
        for(var i=0; i<files.length; i++) {
            files[i].isactive = false;
            files[i].div.style.display = 'none';
        }
        f.isactive = true;
        f.div.style.display = '';
    });
    // var textnode = document.createTextNode(path);
    // li.appendChild(textnode);


    var el = document.getElementById("root"); 
    var node = document.createElement("div");
    var hexscroll = document.createElement("div");
    hexscroll.classList.add('hexscroll');
    hexscroll.appendChild(document.createElement('div'));
    var hexoffset = document.createElement("div");
    hexoffset.classList.add('hexoffset');
    var hexdump = document.createElement("div");
    hexdump.classList.add('hexdump');

    node.className += " hex";
    node.innerHTML += '<div class="hexscale" ><span></span>00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f    </div>';
    node.appendChild(hexscroll);
    node.appendChild(hexoffset);
    node.appendChild(hexdump);
    el.appendChild(node); 

    f.div = node;
    f.hexscroll = hexscroll;
    f.hexoffset = hexoffset;
    f.hexdump = hexdump;

    window.setInterval(() => {
        // var t = f.hexoffset;
        f.div.style.height = (windowSize + 20) + "px";
        f.hexscroll.style.height = windowSize + "px";
        // t.style.height = "200px";
        // console.log("scrollposition: ", f.hexscroll.scrollTop);
        var begin = Math.floor(f.hexscroll.scrollTop / lineHeight);
        resetOffset(f.hexoffset, begin, begin + lines);
        resetHexdump(f, begin, begin + lines); 
        resetScroll(f);
    }, 100);
}



function resetScroll(f) {
    var el = f.hexscroll;
    var div = el.querySelectorAll("div");
    var tt = (f.binaryData.length / (16*lines) * windowSize).toString(10);
    div[0].style.height = tt + "px";
}
function resetOffset(cell, begin, end) {
    while ( cell.hasChildNodes() ) { cell.removeChild( cell.firstChild ); }
    // 
    for(var i=begin; i<end; i++) {
        var node = document.createElement("div");
        var span = document.createElement("span");
        var offset = i * 16;
        var textnode = document.createTextNode(offset.toString(16)); 
        node.appendChild(textnode);
        cell.appendChild(node);
        // document.getElementById("hexoffset").appendChild(node);
    }
}

function resetHexdump(f, begin, end) {
    var cell = f.hexdump;
    while ( cell.hasChildNodes() ) { cell.removeChild( cell.firstChild ); }
    // begin * 16;
    var str = "";
    var split = 0;
    var last = Math.min(end * 16, f.binaryData.length);
    for(var i=begin*16; i<last; i++) {
        split++;
        var s = f.binaryData[i].toString(16);
        
        str += "00".substr(0, 2 - s.length) + s + " "; // binaryData[i].toString(16) + " ";
        str = str.toUpperCase();
        if (split % 16 == 0) {
            var textnode = document.createTextNode(str);
            var br = document.createElement("br");
            cell.appendChild(textnode);
            cell.appendChild(br);
            str = "";
        }
    }
    if(str != "") {
        var textnode = document.createTextNode(str);
        var br = document.createElement("br");
        cell.appendChild(textnode);
        cell.appendChild(br);
    }

}
document.querySelector('#new_file').addEventListener('click', () => {
    console.log(remote);
    remote.dialog.showOpenDialog().then(result => {
        console.log(result.canceled)
        console.log("path:" ,result.filePaths)
        var  readFile = function(filepath) {
            window.fs.readFile(filepath, (err, data) => {
                if(err){
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                } 
                // handle the file content 
                console.log('hex: ', typeof(data)); // .toString('hex'));
                console.log(data); // .toString('hex'));
                addFile(data, filepath);
                // resetOffset(0, lines);
                // resetHexdump(0, lines);
                // resetScroll(); 
                // event.sender.send('fileData', data);
            });
        }
        readFile(result.filePaths[0]);

    }).catch(err => {
        console.log(err)
    });

})
