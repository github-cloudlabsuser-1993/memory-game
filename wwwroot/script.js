window.onload = function () {
    const gameBoard = document.getElementById('game-board');
    const winMessage = document.createElement('div');
    winMessage.id = 'win-message';
    winMessage.innerText = 'You Win!';
    document.body.appendChild(winMessage);
    const cards = [];

    fetch('https://rawcdn.githack.com/akabab/starwars-api/0.2.1/api/all.json')
        .then(response => response.json())
        .then(symbols => {
            // Loop through the first 8 elements of the symbols array
            for (let i = 0; i < 8; i++) {
                const symbol = symbols[i];
                // Add two cards for each symbol
                cards.push(createCard(symbol));
                cards.push(createCard(symbol));
            }

            shuffle(cards);

            // Create a 4x4 grid
            const gameBoard = document.createElement('div');
            gameBoard.classList.add('game-board');
            document.body.appendChild(gameBoard);

            cards.forEach(card => {
                gameBoard.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function createCard(symbol) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol.name;

        const img = document.createElement('img');
        img.src = symbol.image;
        img.classList.add('card-image');
        card.appendChild(img);

        card.addEventListener('click', flipCard);

        return card;
    }

    function shuffle(array) {
        // Shuffle the array using the Fisher-Yates algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let flippedCards = [];
    let matchedPairs = 0;

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.symbol === card2.dataset.symbol) {
            matchedPairs++;
            flippedCards = [];
            checkForWinner();
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }

    function checkForWinner() {
        if (matchedPairs === 8) {
            setTimeout(() => {
                alert('You Win!');
                resetGame();
            }, 500);
        }
    }

    function resetGame() {
        matchedPairs = 0;
        flippedCards = [];
        shuffle(cards);

        const gameBoard = document.querySelector('.game-board');
        gameBoard.innerHTML = '';
        cards.forEach(card => {
            card.classList.remove('flipped');
            gameBoard.appendChild(card);
        });
    }
};
