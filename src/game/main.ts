import * as pixi from 'pixi.js';
import { deal, cardCanDropOnPile, type Card, type GameState } from './cards';

let canvas = document.getElementById('solitare');

if (canvas != null) {
    const game = new pixi.Application({ background: '#309C42', view: canvas as HTMLCanvasElement, resizeTo: canvas });

    const container = new pixi.Container();

    game.stage.addChild(container);

    let gameState = deal();

    game.stage.eventMode = 'static';
    game.stage.on("globalmousemove", function(e: pixi.FederatedPointerEvent){
        mouseMove(e, gameState)
    });

    game.stage.on('mouseup', function(e: pixi.FederatedPointerEvent) {
        dropPileCard(e, gameState);
    });

    let pileNumber = 0;
    gameState.piles.forEach(function(pile) {
        let pileSize = 0;
        pile.forEach(function(card) {
            card.sprite.x = 50 + (215 * pileNumber);
            card.sprite.y = 350 + (5 * pileSize);
            container.addChild(card.sprite);

            pileSize++;
        });
        pileNumber++;
    });

    checkPileFlip(gameState);

    let drawNumber = 0;
    gameState.draw.forEach(function(card) {
        card.sprite.y = 50;
        card.sprite.x = 50 + (5 * Math.floor(drawNumber / 3));

        container.addChild(card.sprite);
        drawNumber++;
    });
}

function dragPileCard(e: pixi.FederatedPointerEvent,gameState: GameState, card: Card, pile: number) {
    if (gameState.drag.dragging == 0) {
        console.log('start drag from pile' + pile);
        gameState.drag.card = card;
        gameState.drag.dragging = 1;
        gameState.drag.dragObjStart = new pixi.Point(e.global.x - card.sprite.x, e.global.y - card.sprite.y);
        gameState.drag.dragGlobalStart = new pixi.Point(card.sprite.x, card.sprite.y);
        gameState.drag.dragFromPile = pile;

        toTop(gameState.drag.card.sprite);

    }

}

function dropPileCard(e: pixi.FederatedPointerEvent, gameState: GameState) {
    if (gameState.drag.dragging != 0 && gameState.drag.card != null) {
        let dropped = false;
        gameState.piles.forEach(function(pile, index) {
            if (pile.length > 0) {
                let lastCard:Card = pile[pile.length - 1];

                if(lastCard.sprite.getBounds().contains(e.x, e.y)) {
                    if (gameState.drag.card != null) {
                        if (cardCanDropOnPile(lastCard, gameState.drag.card)) {
                            gameState.drag.card.sprite.x = lastCard.sprite.x;
                            gameState.drag.card.sprite.y = lastCard.sprite.y + 40;
                            gameState.drag.dragging = 0;

                            let popped = gameState.piles[gameState.drag.dragFromPile].pop();
                            if (typeof popped != 'undefined') {
                                pile.push(popped);
                            }

                            gameState.drag.card.sprite.removeListener('mousedown');
                            gameState.drag.card.sprite.on('mousedown', function(e: pixi.FederatedPointerEvent) {
                                    dragPileCard(e, gameState, lastCard, index);
                            });

                            checkPileFlip(gameState);

                            console.log("Dropping " + gameState.drag.card.name + " of " + gameState.drag.card.suit + " on " + lastCard.name + " of " + lastCard.suit);

                            dropped = true;
                        }
                        else {
                            console.log("Cannot drop " + gameState.drag.card.name + " of " + gameState.drag.card.suit + " on " + lastCard.name + " of " + lastCard.suit);
                        }
                    }
                }
            }

        });

        if (!dropped) {
            gameState.drag.card.sprite.x = gameState.drag.dragGlobalStart.x;
            gameState.drag.card.sprite.y = gameState.drag.dragGlobalStart.y;
            gameState.drag.dragging = 0;
        }
    }

}

function mouseMove(e: pixi.FederatedPointerEvent, gameState: GameState) {
    if (gameState.drag.card != null && gameState.drag.dragging != 0) {
        gameState.drag.card.sprite.x = e.x - gameState.drag.dragObjStart.x;
        gameState.drag.card.sprite.y = e.y - gameState.drag.dragObjStart.y;
    }
}

function checkPileFlip(gameState: GameState) {
    gameState.piles.forEach(function(pile, index) {
        if (pile.length > 0) {
            let lastCard = pile[pile.length - 1];

            if (!lastCard.flipped) {
                lastCard.sprite.texture = lastCard.frontTexture;
                lastCard.flipped = true;

                lastCard.sprite.eventMode = 'static';
                lastCard.sprite.on('mousedown', function(e: pixi.FederatedPointerEvent) {
                    dragPileCard(e, gameState, lastCard, index);
                });
            }

            // reset events
            pile.forEach(function(card) {
                card.sprite.off('mousedown');
                if (card.flipped) {
                    card.sprite.on('mousedown', function(e: pixi.FederatedPointerEvent) {
                        dragPileCard(e, gameState, card, index);
                    });
                }

            });
        }
    });
}

function toTop(sprite: pixi.Sprite) {
    sprite.parent.setChildIndex(sprite, sprite.parent.children.length - 1);
}

