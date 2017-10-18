// app state
// ===================
// These variables represent the state of our application, they tell us at
// any given moment the state of our blackjack game. You might find it useful
// to use these to debug issues by console logging them in the functions below.
var deckID = "";
var dealerCards = [];
var playerCards = [];
var playerScore = 0;
var dealerScore = 0;
var roundLost = false;
var roundWon = false;
var roundTied = false;


// game play nodes:
// ===================
// These nodes will be used often to update the UI of the game.

// assign this variable to the DOM node which has id="dealer-number"
var dealerScoreNode = document.getElementById('dealer-number');

// select the DOM node which has id="player-number"
var playerScoreNode = document.getElementById('player-number');

// select the DOM node which has id="dealer-cards"
var dealerCardsNode = document.getElementById('dealer-cards');

// select the DOM node which has id="player-cards"
var playerCardsNode = document.getElementById('player-cards');

// selec the DOM node which has id="announcement"
var announcementNode = document.getElementById('announcement');

// selec the DOM node which has id=new-game"
var newDeckNode = document.getElementById('new-game');

// selec the DOM node which has id="next-hand"
var nextHandNode = document.getElementById('next-hand');

// selec the DOM node which has id=""hit-me""
var hitMeNode = document.getElementById('hit-me');

// selec the DOM node which has id="stay"
var stayNode = document.getElementById('stay');


// On click events
// ==================
// These events define the actions to occur when a button is clicked.
// These are provided for you and serve as examples for creating further
// possible actions of your own choosing.
newDeckNode.onclick = getNewDeck;
nextHandNode.onclick = newHand;
hitMeNode.onclick = () => hitMe('player');
stayNode.onclick = () => setTimeout(() => dealerPlays(), 600);
// ==================


// Game mechanics functions
// ========================


function getNewDeck() {
  /* This function needs to:
  1) Call the resetPlayingArea function
  2) Make a call to deckofcardsapi in order to retrieve a new deck_id
  3) Set the value of our state variable deckID to the retrieved deck_id
  4) Change the display property of style on the nextHandNode element in order
  to provide the player with the Next Hand button.
  5) Hide the hit-me and stay buttons by changing their style.display to "none"
  6) Catch any errors that may occur on the fetch and log them */
  resetPlayingArea();
  var id;
  try {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(response => response.json())
    .then(data => {
    id = data.deck_id;
    nextHandNode.setAttribute("style", "display: block;");
    hitMeNode.setAttribute("style", "display: none;");
    stayNode.setAttribute("style", "display: none;");
    console.log('asfaefaef', id)
        deckID = id        
})
  
  } catch (err) {
    console.log(err);
  }
}

function computeScore(cards) {
  // This function receives an array of cards and returns the total score.
  // ...
  // var score = 0;
  // cards.forEach(card => {
  //   console.log('cardvalue', card.value)
  //   var cardScore = 0;
  //   if(card.value === 'ACE') {cardScore = 1}
  //   else if(card.value === 'KING') {cardScore = 10}
  //   else if(card.value === 'QUEEN') {cardScore = 10}
  //   else if(card.value === 'JACK') {cardScore = 10}
  //   else {cardScore = card.value}
  //   console.log('>>>>',cardScore)
  //   score = score + cardScore
  // })
  // return score

  // var arrayOne = [];
  // arrayOne.push(cards.forEach(function(a, index){
  //   if (a.value === "ACE") {return 1;}
  //   else if(a.value === "KING") {return 10;}
  //   else if(a.value === "QUEEN") {return 10;}
  //   else if(a.value === "JACK") {return 10;}
  //   else {return a.value;}
  // }))
  // console.log(arrayOne);
  // return arrayOne.reduce(function(s, e){
  //   s + e;
  // })

  // return cards.reduce((s,e) => {
  //   var a = typeof e.value
  //   if(a === 'number') return s + e.value
  //   else if(e.value === 'ACE') return s + 1
  //   else if(e.value === 'KING') return s + 13
  //   else if(e.value === 'QUEEN') return s + 12
  //   else if(e.value === 'JACK') return s + 11
  // });                                  
  // <<<<<<<<<<<<<<<<<<<<< must change face card values
  return cards.reduce((s,e) => s + e.value);
}


function newHand() {
  /* This function needs to:
  1) Call the resetPlayingArea function
  2) Make a call to deckofcardsapi using the deckID state variable in order
  to retrieve draw 4 cards from the deck.
  3) Once 4 cards have been drawn, push 2 of them to our dealerCards state
  array and 2 to our playerCards state array.
  4) Set our dealerScore state variable to "?" and then set the textContent
  value of the dealerScoreNode to dealerScore;
  5) ForEach card in playerCards and dealerCards, create an <img> element
  and assign the src of these to their respective card images. Don't forget to
  append these newly created <img> elements to the respective #dealer-cards and
  #player-cards DOM elements in order to have them show up in the html.
  6) Finally, compute the player's score by calling computeScore() and update
  the playerScoreNode to reflect this.
  7) If player score is 21, announce immediate victory by setting:
  roundWon = true;
  announcementNode.textContent = "BlackJack! You Win!";
  8) catch and log possible error from the fetch.
  */
  resetPlayingArea();
  try {
    console.log('>>>>', deckID)
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`)
  .then(response => response.json())
  .then(data => {
    dealerCards.push(data.cards[0], data.cards[1]);
    playerCards.push(data.cards[2], data.cards[3]);
    dealerScore = '?';
    dealerScoreNode.textContent = dealerScore;
    playerCards.forEach(card => {
      var htmlCard = document.createElement('img');
      htmlCard.setAttribute('src', card.image);
      playerCardsNode.appendChild(htmlCard);
    })
    dealerCards.forEach(card => {
      var htmlCard = document.createElement('img');
      htmlCard.setAttribute('src', card.image);
      dealerCardsNode.appendChild(htmlCard);
    })
    playerScore = computeScore(playerCards);
    console.log(playerScore)
    playerScoreNode.textContent = playerScore;
    if (playerScore === 21) {
      roundWon = true;
      announcementNode.textContent = "Blackjack! You Win!";
    }
  })
  } catch (err) {
    console.log(err);
  }
}


function resetPlayingArea() {
  /* This function needs to:
  1) Reset all state variables to their defaults
  2) Reset the gameplay UI by updating textContent of all Nodes which may
  be displaying data from a previous round in the game. (ex: dealerScoreNode)
  3) Remove all <img> elements inside dealerCardsNode and playerCardsNode.
  */
  dealerCards = [];
  playerCards = [];
  playerScore = 0;
  dealerScore = 0;
  roundLost = false;
  roundWon = false;
  roundTied = false;
  dealerScoreNode.textContent = dealerScore;
  playerScoreNode.textContent = playerScore;
  while (dealerCardsNode.hasChildNodes()) {
    dealerCardsNode.removeChild(dealerCardsNode.lastChild);
  }
  while (playerCardsNode.hasChildNodes()) {
    playerCardsNode.removeChild(playerCardsNode.lastChild);
  }
  announcementNode.textContent = "";
  newDeckNode.setAttribute("style", "display: block;")
  nextHandNode.setAttribute("style", "display: none;");
  hitMeNode.setAttribute("style", "display: block;");
  stayNode.setAttribute("style", "display: block;");


}


function hitMe(target) {
  /* This function needs to:
  1) If any of roundLost or roundWon or roundTied is true, return immediately.
  2) Using the same deckID, fetch to draw 1 card
  3) Depending on wether target is 'player' or 'dealer', push the card to the
  appropriate state array (playerCards or dealerCards).
  4) Create an <img> and set it's src to the card image and append it to the
  appropriate DOM element for it to appear on the game play UI.
  5) If target === 'player', compute score and immediately announce loss if
  score > 21 by setting:
  roundLost = true;
  and updating announcementNode to display a message delivering the bad news.
  6) If target === 'dealer', just call the dealerPlays() function immediately
  after having appended the <img> to the game play UI.
  7) Catch error and log....
  */
  if (roundLost === true || roundWon === true || roundTied === true) return;
  try {
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then(response => response.json())
    .then(data => {
      if (target === 'player') {
        playerCards.push(data.cards[0]);
        var htmlCard = document.createElement('img');
        htmlCard.setAttribute('src', data.cards[0].image);
        playerCardsNode.appendChild(htmlCard);
        console.log(playerScore)
        playerScore = computeScore(playerCards);
        if (playerScore > 21) {
          roundLost = true;
          announcementNode.textContent = "Bust!";
          hitMeNode.setAttribute('style', 'display: none;');      
        }
        playerScoreNode.textContent = playerScore;
      }
      else if (target === "dealer") {
        dealerCards.push(data.cards[0]);       
        var htmlCard = document.createElement('img');
        htmlCard.setAttribute('src', card.image);
        dealerCardsNode.appendChild(htmlCard);
        dealerPlays();
      }
    })
  } catch (err) {
    console.log(err);
  }
  
}

function dealerPlays() {
  /* This function needs to:
  1) If any of roundLost or roundWon or roundTied is true, return immediately.
  2) Compute the dealer's score by calling the computeScore() function and
  update the UI to reflect this.
  */
  if (roundLost === true || roundWon === true || roundTied === true) return;
  dealerScore = computeScore(dealerCards);
  
  if (dealerScore < 17) {
    // a delay here makes for nicer game play because of suspence.
    setTimeout(()=>hitMe('dealer'), 900)
  }
  else if (dealerScore > 21) {
    roundWon = true;
    // ... Update the UI to reflect this...
  }
  else if (dealerScore > playerScore) {
    roundLost = true;
    // ... Update the UI to reflect this...
  }
  else if (dealerScore === playerScore) {
    roundTied = true;
    // ... Update the UI to reflect this...
  }
  else {
    roundWon = true;
    // ... Update the UI to reflect this...
  }

}