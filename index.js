//side1;side2;tag

const express = require('express');
const fs = require('fs');

let [loadedCards,tagnames] = loadCards('cards.txt');

const app = express();
const port = 3000;

app.use(express.static('public/assets'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/gettags/', (req, res) =>{
    res.send(tagnames)
});

app.get('/getcards/', (req, res) =>{
    res.send(loadedCards)
});

app.get('/addnewcard/:newcard', (req, res) =>{

    addNewCard( req.params.newcard );

    res.send({ok: 'true'})
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

function grabRandomCard(wordlist){
    let newcard = wordlist[Math.floor(Math.random() * wordlist.length)];
    return newcard;
}

function grabCollection(collection_name){
    return loadedCards[collection_name];
}

function addNewCard(cardstring, filename='cards.txt'){
    var stream = fs.createWriteStream(filename, {flags:'a'});
    stream.write("\n" + cardstring)
    stream.end(() => {[loadedCards, tagnames] = loadCards('cards.txt');});
    console.log("added new card: " + cardstring);

    
}

function loadCards(filename){
    let filecontent;

    let categories = {};

    filecontent = fs.readFileSync(filename, 'utf-8');

    let mainlist = filecontent.split('\n');

    categories['all'] = mainlist;

    let recognizedtags = ['all'];

    for(let i=0; i<mainlist.length; i++){
        let tag = mainlist[i].split(';')[2];
        if(recognizedtags.includes(tag)){
            categories[tag].push(mainlist[i]);
        }
        else{
            recognizedtags.push(tag);
            categories[tag] = [mainlist[i]];
        }
    }

    return [categories, recognizedtags];
}