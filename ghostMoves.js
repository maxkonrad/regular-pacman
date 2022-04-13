import { DIRECTIONS, GRID_SIZE, OBJECT_TYPE } from './setup';

// Primitive random movement.
export function randomMovement(position, direction, objectExist, pacman) {
  let dir = direction;
  let nextMovePos = position + dir.movement;
  // Create an array from the diretions objects keys
  const keys = Object.keys(DIRECTIONS);
  
  let attempts = 10

  while (
    objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
    objectExist(nextMovePos, OBJECT_TYPE.GHOST)) {
    // Get a random key from that array
    const key = keys[Math.floor(Math.random() * keys.length)];
    // Set the new direction
    dir = DIRECTIONS[key];
    // Set the next move
    nextMovePos = position + dir.movement;

    attempts--

    if (attempts == 0) {
      return
    }
  }

  return { nextMovePos, direction: dir };
}

export function huntMovement(position, direction, objectExist, pacman){
  let dir = direction
  const keys = Object.keys(DIRECTIONS);
  let decision = false
  if (!pacman.powerPill){
    decision = true 
  }
  let validMoves = []
  let nextMovePos = position + dir.movement;
  keys.forEach(key => {
    dir = DIRECTIONS[key];
    let nextMovePos = position + dir.movement;
    if(!(objectExist(nextMovePos, OBJECT_TYPE.WALL) || objectExist(nextMovePos, OBJECT_TYPE.GHOST))){
      validMoves.push(nextMovePos)
    }
  });
  let attempts = 10
  nextMovePos = validMoves[Math.floor(Math.random() * validMoves.length)]
  let isClose = isCloser(pacman.pos, position, nextMovePos)
  while(
    (decision ? isClose : !isClose) && attempts) {
    nextMovePos = validMoves[Math.floor(Math.random() * validMoves.length)]
    isClose = isCloser(pacman.pos, position, nextMovePos)
    attempts--
  }
  dir = nextMovePos - position
  return { nextMovePos, direction: dir}
}

function isCloser(pacmanPos, position, nextMovePos) {
  const [pointX, pointY] = getCoords(pacmanPos)
  const [posX, posY] = getCoords(position)
  const [nextX, nextY] = getCoords(nextMovePos)

  return Math.abs(nextX - pointX) > Math.abs(posX - pointX) ||
    Math.abs(nextY - pointY) > Math.abs(posY - pointY)
}

function getCoords(index) {
  return [index % GRID_SIZE, Math.floor(index / GRID_SIZE)]
}