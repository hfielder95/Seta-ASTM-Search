var fdb = new ForerunnerDB();

var db = fdb.db("ASTM_D");

var itemCollection = db.collection("item");

var requestURL = "https://github.com/hfielder95/Seta-ASTM-Search/blob/master/ASTM-D.json";
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function(){
    var resultObj = request.response;
    itemCollection.insert(resultObj);
}


document.getElementById("testInput").addEventListener("input", function(evt){
    redrawResults();
});

document.getElementById("searchByNumb").addEventListener("click", function(){ 
    if (this.classList.contains("testButtonActive")){
        this.classList.remove("testButtonActive");
        document.getElementById("searchByName").classList.add("testButtonActive");
        document.getElementById("testInput").dataset.mode = "name";
        redrawResults();
    } else {
        document.getElementById("searchByName").classList.remove("testButtonActive");
        this.classList.add("testButtonActive");
        document.getElementById("testInput").dataset.mode = "numb";
        redrawResults();
    }   
});

document.getElementById("searchByName").addEventListener("click", function(){ 
    if (this.classList.contains("testButtonActive")){
        this.classList.remove("testButtonActive");
        document.getElementById("searchByNumb").classList.add("testButtonActive");
        document.getElementById("testInput").dataset.mode = "numb";
        redrawResults();
    } else {
        document.getElementById("searchByNumb").classList.remove("testButtonActive");
        this.classList.add("testButtonActive");
        document.getElementById("testInput").dataset.mode = "name";
        redrawResults();
    }   
});

document.getElementById("clearInput").addEventListener("click", function(){
    document.getElementById("testInput").value="";
    redrawResults();
});

document.getElementById("toggleDesc").addEventListener("click", function(){
    toggleDescs();
})

function redrawResults(){
    if (document.getElementById("testInput").value !== ""){
        var re = new RegExp(document.getElementById("testInput").value,"i");
        if (document.getElementById("testInput").dataset.mode == "numb"){
            buildResults(itemCollection.find({"D": re}));
        } else {
            buildResults(itemCollection.find({"NAME": re}));
        }
        
    } else {
        document.getElementById("tableOfResults").innerHTML = "";
    }
}

function toggleDescs(){
    var openResults = document.querySelectorAll(".listItem");
    var openResultsLength = openResults.length;

    if (document.querySelectorAll(".listItemSelected").length > 1){
        for (var y = 0; y < openResultsLength; y++){
            openResults[y].innerHTML = openResults[y].dataset.code;
            openResults[y].classList.remove("listItemSelected");
        }
    } else {

        for (var z = 0; z < openResultsLength; z++){
            if (!openResults[z].classList.contains("listItemSelected")){
                openResults[z].classList.add("listItemSelected");
            }
            openResults[z].innerHTML = openResults[z].dataset.code + "<br><br>" + openResults[z].dataset.desc.replace("?","");
        }
    }
}

function buildResults(results){

    var resList = document.getElementById("tableOfResults");
    resList.innerHTML = "";

    for (var i = 0; i< results.length; i++){
        
        console.log(results[i]);
        var node = document.createElement("LI");
        var textNode = document.createTextNode(results[i].D);
        node.appendChild(textNode);
        node.classList.add("listItem");
        node.dataset.code = results[i].D;
        node.dataset.desc = results[i].NAME;
        node.addEventListener("click", function(){

            if (!this.classList.contains("listItemSelected")){

                for (var n = 0; n < document.getElementsByClassName("listItemSelected").length; n++){
                    document.getElementsByClassName("listItemSelected")[n].innerHTML = document.getElementsByClassName("listItemSelected")[n].dataset.code;
                    document.getElementsByClassName("listItemSelected")[n].classList.remove("listItemSelected");
                }

                var testEl = this;
                testEl.classList.add("listItemSelected");
                setTimeout(function(){
                    testEl.innerHTML = testEl.dataset.code + "<br><br>" + testEl.dataset.desc.replace("?","") + "<br>";
                }, 5);
            
            } else {
                this.innerHTML = this.dataset.code;
                this.classList.remove("listItemSelected");
            }
            
        });
        resList.appendChild(node);
    }
}
