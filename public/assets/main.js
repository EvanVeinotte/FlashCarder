let tagnames = ["shart"];
let cardDic = {shart: "nothing;nothin;nope"}
let curCardIndex = 0;
let listofcards = [];

function shuffle(unshuffled){
    let shuffled = unshuffled
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    return shuffled;
}

function loadNewCat(newcat){
    listofcards = cardDic[newcat];
    listofcards = shuffle(listofcards);
    curCardIndex = 0;

    updateCardDisplay();
}

function loadTagNames(tagnames){

    let dropdown = document.getElementById("tag-drop-down");

    while(dropdown.firstChild){
        dropdown.removeChild(dropdown.firstChild);
    }

    for(let i=0; i<tagnames.length; i++){
        let newoption = document.createElement("option");
        let newtext = document.createTextNode(tagnames[i]);
        newoption.appendChild(newtext);
        newoption.value = tagnames[i];
        dropdown.appendChild(newoption);
    }
}

function getTags() {
    fetch('./gettags/')
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }

                response.json().then(function(data) {
                    console.log(data);
                    tagnames = data;
                    loadTagNames(tagnames);
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
}

function getCards() {
    fetch('./getcards/')
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }

                response.json().then(function(data) {
                    console.log(data);
                    cardDic = data;

                    loadNewCat('all')
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
}

function updateCardDisplay(){

    hideAnswer();

    document.getElementById('side1').innerHTML = listofcards[curCardIndex].split(';')[0];
    document.getElementById('side2-text-part').innerHTML = listofcards[curCardIndex].split(';')[1];

    document.getElementById('index-display').innerHTML = (curCardIndex + 1).toString() + "/" + listofcards.length.toString();
}

function nextClick(){
    if(curCardIndex < listofcards.length - 1){
        curCardIndex++;
    }
    updateCardDisplay();
}

function prevClick(){
    if(curCardIndex > 0){
        curCardIndex--;
    }
    updateCardDisplay();
}

function showAnswer(){
    document.querySelector("#hide-button").classList.add("hide");
}

function hideAnswer(){
    document.querySelector("#hide-button").classList.remove("hide");
}

function newTagSelected(){
    let tagname = document.querySelector("#tag-drop-down").value;
    loadNewCat(tagname);
}

function addNewCard(){
    let side1txt = document.querySelector("#add-side1").value;
    let side2txt = document.querySelector("#add-side2").value;
    let tagtxt = document.querySelector("#add-tag").value;

    document.querySelector("#add-side1").value = "";
    document.querySelector("#add-side2").value = "";
    document.querySelector("#add-tag").value = "";

    let finalstring = side1txt + ";" + side2txt + ";" + tagtxt

    fetch('./addnewcard/' + finalstring)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }

                response.json().then(function(data) {
                    console.log(data);

                    getTags();
                    getCards();
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });

}


document.querySelector("#next-card").addEventListener("click", nextClick);
document.querySelector("#prev-card").addEventListener("click", prevClick);
document.querySelector("#hide-button").addEventListener("click", showAnswer);
document.querySelector("#tag-drop-down").addEventListener("change", newTagSelected);

document.querySelector("#add-button").addEventListener("click", addNewCard);



getTags();
getCards();