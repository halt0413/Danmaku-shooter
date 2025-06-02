const Phaser = require('phaser');

//敵を生成してシーンに追加する関数
export function createEnemy(scene, x, y) {

  //赤い円を描いて一時的なテクスチャとして保存(画像読む予定)
  const graphics = scene.add.graphics();
  graphics.fillStyle(0xff0000, 1);
  graphics.fillCircle(15, 15, 15);
  const key = `enemy-${Date.now()}-${Math.random()}`;
  graphics.generateTexture(key, 30, 30);
  graphics.destroy();

  //物理オブジェクトとして敵スプライトを生成
  const enemy = scene.physics.add.sprite(x, y, key);

  //フレーム遅延で物理ボディが初期化されるのを待つ
  scene.time.delayedCall(0, () => {
    if (!enemy.body) return;

    enemy.setVelocityY(200);//下方向へ移動
    enemy.setCircle(15);  //円形の当たり判定
    enemy.body.checkCollision.none = false;//衝突検出を有効にする
  });

  return enemy;
}

//敵の定期生成を開始する関数
export function initEnemySpawner(scene) {
  scene.enemies = scene.physics.add.group();

  
  // 敵を1秒ごとに生成するタイマーを設定
  scene.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      if (scene.isGameOver) return;//ゲームオーバーなら敵生成しない

      const x = Phaser.Math.Between(50, 750);//X座標をランダムに決定
      const enemy = createEnemy(scene, x, 0);//敵を生成
      scene.enemies.add(enemy);              //グループに追加

      //プレイヤーと敵が重なったときの処理
      scene.physics.add.overlap(scene.player, enemy, () => {
        if (scene.isGameOver) return;//多重実行防止

        scene.isGameOver = true;

        scene.enemySpawnTimer.remove();//ゲームオーバーフラグを立てる

        scene.physics.pause();//すべての物理処理を停止
        scene.player.setTint(0xff0000);//やられたとき赤になる 

        //げーむおーばー
        scene.add.text(250, 250, 'げーむおーばー', {
          fontSize: '48px',
          color: '#ff0000',
        });
      });
    },
  });
}