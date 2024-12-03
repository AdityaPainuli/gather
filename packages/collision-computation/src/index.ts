
// It can be manupilated from the browser so we need some backend validation as well to check if the user is making a right or wrong move.
export function detectCollision(map: SpaceMap, currentUser: user, dotRadius: number): boolean {
    return !map.map.some((obs) => {
      return (
        currentUser.posX + dotRadius > obs.posX &&                 
        currentUser.posX - dotRadius < obs.posX + obs.width &&     
        currentUser.posY + dotRadius > obs.posY &&                 
        currentUser.posY - dotRadius < obs.posY + obs.height      
      );
    });
  }
  