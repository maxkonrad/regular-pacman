import { LEVEL, OBJECT_TYPE } from './setup';
import { huntMovement, randomMovement } from './ghostMoves';
// Classes
import GameBoard from './GameBoard';
import Pacman from './pacman';
import Ghost from './Ghost';
// Sounds
import soundDot from './sounds/munch.wav';
import soundPill from './sounds/pill.wav';
import soundGameStart from './sounds/game_start.wav';
import soundGameOver from './sounds/death.wav';
import soundGhost from './sounds/eat_ghost.wav';
import soundWin from './sounds/win.wav'
// Dom Elements
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');
// Game constants
const POWER_PILL_TIME = 10000; // ms
const GLOBAL_SPEED = 80; // ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);
// Initial setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;
let messageBool = true;
let huntMovementTime = 5000;
let huntMovementRandom = 1
let huntTimer = null


// --- AUDIO --- //
function playAudio(audio) {
  const soundEffect = new Audio(audio);
  soundEffect.play();
}

function huntMovementTimer(ghosts){
  huntMovementRandom = Math.floor(Math.random() * 10)
  if (huntMovementRandom < 6){
    ghosts.forEach(ghost => ghost.movement = huntMovement)
  }
  else{
    ghosts.forEach(ghost => ghost.movement = randomMovement)
  }
}

// --- GAME CONTROLLER --- //
function gameOver(pacman, grid) {
  if (gameBoard.dotCount == 0) {
    playAudio(soundWin)
  }
  else{
    playAudio(soundGameOver)
  }


  document.removeEventListener('keydown', (e) =>
    pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
  );

  gameBoard.showGameStatus(gameWin);

  clearInterval(timer);
  // Show startbutton
  startButton.classList.remove('hide');
}

function checkCollision(pacman, ghosts) {
  const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);
  if (collidedGhost) {
    if (pacman.powerPill) {
      playAudio(soundGhost);
      gameBoard.removeObject(collidedGhost.pos, [
        OBJECT_TYPE.GHOST,
        OBJECT_TYPE.SCARED,
        collidedGhost.name
      ]);
      collidedGhost.pos = collidedGhost.startPos;
      score += 100;
    } else {
      gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
      gameBoard.rotateDiv(pacman.pos, 0);
      gameOver(pacman, gameGrid);
    }
  }
}

function gameLoop(pacman, ghosts) {
  // 1. Move Pacman
  gameBoard.moveCharacter(pacman);
  // 2. Check Ghost collision on the old positions
  checkCollision(pacman, ghosts);
  // 3. Move ghosts
  ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));
  
  checkCollision(pacman, ghosts);
  // 5. Check if Pacman eats a dot
  if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
    playAudio(soundDot);
    
    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
    // Remove a dot
    gameBoard.dotCount--;
    // Add Score
    score += 10;
  }
   // 7. Change ghost scare mode depending on powerpill
   if (pacman.powerPill !== powerPillActive) {
    powerPillActive = pacman.powerPill;
    ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
  }
    // 6. Check if Pacman eats a power pill
  if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
    playAudio(soundPill);
    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);
    pacman.powerPill = true;
    score += 50;
    clearTimeout(powerPillTimer);
    powerPillTimer = setTimeout(() => {
      pacman.powerPill = false
      ghosts.forEach((ghost) => (ghost.isScared = false));
      }, POWER_PILL_TIME);
    }
    // 8. Check if all dots have been eaten
    if (gameBoard.dotCount === 0) {
      gameWin = true;
      gameOver(pacman, gameGrid);
    }
    // 9. Show new score
    scoreTable.innerHTML = score;
  }


function startGame() {
  playAudio(soundGameStart);

  gameWin = false;
  powerPillActive = false;
  score = 0;

  startButton.classList.add('hide');
  LEVEL[41] = 7
  LEVEL[58] = 7
  LEVEL[418] = 7
  LEVEL[401] = 7
  gameBoard.createGrid(LEVEL);

  const pacman = new Pacman(2, 287);
  gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
  document.addEventListener('keydown', (e) =>
    pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
  );

  const ghosts = [
    new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY, pacman),
    new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY, pacman),
    new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY, pacman),
    new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE, pacman)
  ];
  setTimeout(() => {
    alert("Game over. Please save the code PACMAN2022, then close this tab and return to the survey.")
    gameGrid.remove();
    startButton.remove();
  }, 300000)

  setTimeout(() => {
    if(messageBool){
    alert("You are doing so good! Keep it up. So far, you are doing better than 95% of the players. We appreciate your help so much!")
    }
    messageBool = false;
  }, 160000)
  huntTimer = setInterval(() => huntMovementTimer(ghosts), 5000)
  // Gameloop
  timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}

// Initialize game
startButton.addEventListener('click', startGame);


function showPage(){

  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('wrapper').style.display = 'flex';
}

setTimeout(showPage, Math.floor(Math.random() * 5000));