const Phaser = require('phaser');


// 放射状に弾を発射する処理
function fireRadialBullets(scene, enemy, bulletCount = 16) {
  if (scene.isGameOver) return;

  const speed = 200;

  for (let i = 0; i < bulletCount; i++) {
    const angle = Phaser.Math.DegToRad((360 / bulletCount) * i); // 弾の角度を計算
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    // 弾の取得
    const bullet = scene.bullets.get(enemy.x, enemy.y, 'bullet');

    console.warn('bulletを取得できませんでした');

    if (!bullet) continue; // nullチェック

    // 物理エンジンが未適用なら適用
    if (!bullet.body) {
      scene.physics.world.enable(bullet); 
    }

    // 弾の初期化
    bullet.setActive(true).setVisible(true);
    bullet.body.reset(enemy.x, enemy.y);
    bullet.setVelocity(vx, vy);
    bullet.body.setCircle(4); // 衝突判定サイズ
    bullet.setTint(0x00ffff); // 水色に変更
  }
}


// 弾を定期的に発射するタイマーを開始
function startRadialShooting(scene, enemy) {
  enemy.shootTimer = scene.time.addEvent({
    delay: 1500,     // 毎秒発射
    loop: true,
    callback: () => {
      if (!enemy.active) return;
      fireRadialBullets(scene, enemy);
    }
  });
}


// 敵キャラを生成する関数
export function createEnemy(scene, x, y, isChild = false, updateType = 'straight') {
  // 敵のテクスチャ作成
  const graphics = scene.add.graphics();
  graphics.fillStyle(0xff0000, 1); // 赤
  graphics.fillCircle(15, 15, 15);
  const key = `enemy-${Date.now()}-${Math.random()}`; // 一意なキー
  graphics.generateTexture(key, 30, 30);
  graphics.destroy();

  // 敵のSprite作成
  const enemy = scene.physics.add.sprite(x, y, key);
  enemy.isChild = isChild;
  enemy.hasSplit = false;
  enemy.updateType = updateType;

  // 敵の設定を少し遅延させてから適用（Phaser対策）
  scene.time.delayedCall(0, () => {
    if (!enemy.body) return;

    enemy.setVelocityY(300); // 下方向へ移動
    enemy.setCircle(15);     // 衝突判定
    enemy.body.checkCollision.none = false;

    // 毎フレーム呼ばれるupdate関数を定義
    enemy.update = function () {
      if (!this.body) return;

      // 一度だけ放射弾開始
      if (this.updateType === 'radial' && !this.startedShooting) {
        startRadialShooting(scene, this);
        this.startedShooting = true;
      }

      // 特定の移動パターン
      switch (this.updateType) {
        case 'tracking': {
          const playerX = scene.player.x;
          const dx = playerX - this.x;
          this.x += dx * 0.030;
          break;
        }
        case 'straight':
          break;
      }
    };
  });

  return enemy;
}


// 敵のスポーン処理（一定間隔で生成）
export function initEnemySpawner(scene) {
  scene.enemies = scene.physics.add.group();

  // 敵とプレイヤーの当たり判定（ゲームオーバー処理）
  scene.physics.add.overlap(scene.player, scene.enemies, () => {
    if (scene.isGameOver) return;

    scene.isGameOver = true;

    // 敵生成タイマー停止
    scene.enemySpawnTimer?.remove();

    // ゲーム停止
    scene.physics.pause();
    scene.player.setTint(0xff0000);

    // 画面中央にゲームオーバー表示
    const centerX = scene.scale.width / 2;
    const centerY = scene.scale.height / 2;

    scene.add.text(centerX, centerY - 60, 'げーむおーばー', {
      fontSize: '48px',
      color: '#ff0000',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // リトライボタン
    const retryText = scene.add.text(centerX, centerY, 'リトライ', {
      fontSize: '32px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();
    retryText.on('pointerdown', () => scene.scene.restart());

    // ホームに戻るボタン
    const homeText = scene.add.text(centerX, centerY + 60, 'ホームへ', {
      fontSize: '32px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();
    homeText.on('pointerdown', () => window.location.href = '/');
  });

  // 敵生成タイマー
  scene.enemySpawnTimer = scene.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      if (scene.isGameOver) return;

      const x = Phaser.Math.Between(50, 750); // ランダムなx座標
      const updateType = Phaser.Math.RND.pick(['straight', 'tracking', 'radial']); // ランダムな動き
      const enemy = createEnemy(scene, x, 0, false, updateType);
      scene.enemies.add(enemy);
    }
  });
}
