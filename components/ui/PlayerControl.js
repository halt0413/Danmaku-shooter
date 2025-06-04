
// プレイヤーの移動処理を行う関数
// 毎フレーム呼び出され、入力に応じてプレイヤーの速度を更新
export function handlePlayerMovement(scene, player, cursors, keys) {
  const speed = 600;//プレイヤーの移動速度

  player.setVelocity(0); //毎フレーム速度リセット

  //横方向の移動
  if (cursors.left.isDown || keys.left.isDown) {
    player.setVelocityX(-speed);//左へ移動
  } else if (cursors.right.isDown || keys.right.isDown) {
    player.setVelocityX(speed);//右へ移動
  }

  //縦方向の移動
  if (cursors.up.isDown || keys.up.isDown) {
    player.setVelocityY(-speed); //上へ移動
  } else if (cursors.down.isDown || keys.down.isDown) {
    player.setVelocityY(speed);//下へ移動
  }
}
