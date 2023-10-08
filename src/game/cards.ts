import * as pixi from 'pixi.js';

export const CARD_SIZE_RATIO = 1.452;
const INITIAL_CARD_WIDTH_RATIO = 200;

export type Card = {
    suit: string,
    color: string,
    value: number,
    name: string,
    flipped: boolean,
    sprite: pixi.Sprite,
    frontTexture: pixi.Texture,
};

export type GameState = {
    piles: Array<Array<Card>>,
    draw: Array<Card>,
    returns: {
        clubs: Array<Card>,
        hearts: Array<Card>,
        spades: Array<Card>,
        diamonds: Array<Card>,
    },
    drag: {
        card: Card|null,
        dragging: number,
        dragObjStart: pixi.Point,
        dragGlobalStart: pixi.Point,
        dragFromPile: number,
    },

}

function getCards():Array<Card> {
    let cards: Array<Card> = [];
    suits.forEach(suit => {
        let color = 'black';
        if (suit == 'hearts' || suit == 'diamonds') {
            color = 'red';
        }

        values.forEach(value => {
            let card: Card = {
                suit: suit,
                color: color,
                value: value.value,
                name: value.name,
                flipped: false,
                frontTexture: pixi.Texture.from('/sprites/' + value.name + '_of_' + suit + '.png'),
                sprite: pixi.Sprite.from('/sprites/back.png'),
            };

            card.sprite.anchor.set(0, 0);
            card.sprite.width = INITIAL_CARD_WIDTH_RATIO;
            card.sprite.height = INITIAL_CARD_WIDTH_RATIO * CARD_SIZE_RATIO;

            cards.push(card);
        });
    });

    return cards;
}

function shuffle<T>(cards: Array<T>) {
    for (let i = 0; i < cards.length; i++) {
        let r = i + (Math.floor(Math.random() * (cards.length - i)));
        let temp = cards[i];
        cards[i] = cards[r];
        cards[r] = temp;
    }

    return cards;
}


export function deal(): GameState {
    let cards: Array<Card> = getCards();
    cards = shuffle(cards);

    let gameState: GameState = {
        piles: [],
        draw: [],
        returns: {
            clubs: [],
            hearts: [],
            spades: [],
            diamonds: [],
        },
        drag: {
            card: null,
            dragging: 0,
            dragObjStart: new pixi.Point(),
            dragGlobalStart: new pixi.Point(),
            dragFromPile: 0,
        }
   };

    for (let i = 0; i < 7; i++) {
        let pile: Array<Card> = [];
        for (let j = 6 - i; j < 7; j++) {
            let card = cards.pop();
            if (typeof card != 'undefined') {
                pile.push(card);
            }
            else {
                alert("dealer error");
            }
        }
        gameState.piles.push(pile);
    }

    gameState.draw = cards;

    return gameState;
}

export function cardCanDropOnPile(pileCard: Card, dropCard: Card) {
    if (pileCard.color == 'red' && dropCard.color == 'red'
        || pileCard.color == 'black' && dropCard.color == 'black') {
        return false;
    }

    if (pileCard.value == dropCard.value + 1) {
        return true;
    }

    return false;
}

const suits = [
    'hearts',
    'diamonds',
    'spades',
    'clubs',
];

const values = [
    {
        value: 1,
        name: 'ace',
    },
    {
        value: 2,
        name: 'two',
    },
    {
        value: 3,
        name: 'three',
    },
    {
        value: 4,
        name: 'four',
    },
    {
        value: 5,
        name: 'five',
    },
    {
        value: 6,
        name: 'six',
    },
    {
        value: 7,
        name: 'seven',
    },
    {
        value: 8,
        name: 'eight',
    },
    {
        value: 9,
        name: 'nine',
    },
    {
        value: 10,
        name: 'ten',
    },
    {
        value: 11,
        name: 'jack',
    },
    {
        value: 12,
        name: 'queen',
    },
    {
        value: 13,
        name: 'king',
    },
];

