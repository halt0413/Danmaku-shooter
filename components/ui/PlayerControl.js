export function handlePlayerMovement(scene, player, cursors, keys) {
  const speed = 600;

  player.setVelocity(0); 

  //横
  if (cursors.left.isDown || keys.left.isDown) {
    player.setVelocityX(-speed);
  } else if (cursors.right.isDown || keys.right.isDown) {
    player.setVelocityX(speed);
  }

  //縦
  if (cursors.up.isDown || keys.up.isDown) {
    player.setVelocityY(-speed); 
  } else if (cursors.down.isDown || keys.down.isDown) {
    player.setVelocityY(speed);
  }
}
