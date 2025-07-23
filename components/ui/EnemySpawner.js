const Phaser = require('phaser');

function fireRadialBullets(scene, enemy, bulletCount = 16) {
  if (scene.isGameOver) return;

  const speed = 200;

  for (let i = 0; i < bulletCount; i++) {
    const angle = Phaser.Math.DegToRad((360 / bulletCount) * i); 
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    // 弾の取得
    const bullet = scene.bullets.get(enemy.x, enemy.y, 'bullet');

    console.warn('bulletを取得できませんでした');

    if (!bullet) continue; 

    if (!bullet.body) {
      scene.physics.world.enable(bullet); 
    }

    // 弾の初期化
    bullet.setActive(true).setVisible(true);
    bullet.body.reset(enemy.x, enemy.y);
    bullet.setVelocity(vx, vy);
    bullet.body.setCircle(4); 
    bullet.setTint(0x00ffff); 
  }
}

function startRadialShooting(scene, enemy) {
  enemy.shootTimer = scene.time.addEvent({
    delay: 1500,     
    loop: true,
    callback: () => {
      if (!enemy.active) return;
      fireRadialBullets(scene, enemy);
    }
  });
}

export function createEnemy(scene, x, y, isChild = false, updateType = 'straight') {

  const graphics = scene.add.graphics();
  graphics.fillStyle(0xff0000, 1); 
  graphics.fillCircle(15, 15, 15);
  const key = `enemy-${Date.now()}-${Math.random()}`; 
  graphics.generateTexture(key, 30, 30);
  graphics.destroy();

  const enemy = scene.physics.add.sprite(x, y, key);
  enemy.isChild = isChild;
  enemy.hasSplit = false;
  enemy.updateType = updateType;

  scene.time.delayedCall(0, () => {
    if (!enemy.body) return;

    enemy.setVelocityY(300); 
    enemy.setCircle(15);     
    enemy.body.checkCollision.none = false;

    enemy.update = function () {
      if (!this.body) return;

      if (this.updateType === 'radial' && !this.startedShooting) {
        startRadialShooting(scene, this);
        this.startedShooting = true;
      }

      // 移動パターン
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


// 敵のスポーン処理
export function initEnemySpawner(scene) {
  scene.enemies = scene.physics.add.group();

  // 敵とプレイヤーの当たり判定
  scene.physics.add.overlap(scene.player, scene.enemies, () => {
    if (scene.isGameOver) return;

    scene.isGameOver = true;

    // 敵生成タイマー停止
    scene.enemySpawnTimer?.remove();

    // ゲーム停止
    scene.physics.pause();
    scene.player.setTint(0xff0000);

    const centerX = scene.scale.width / 2;
    const centerY = scene.scale.height / 2;

    scene.add.text(centerX, centerY - 60, 'げーむおーばー', {
      fontSize: '48px',
      color: '#ff0000',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    const retryText = scene.add.text(centerX, centerY, 'リトライ', {
      fontSize: '32px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();
    retryText.on('pointerdown', () => scene.scene.restart());

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

      const x = Phaser.Math.Between(50, 750); 
      const updateType = Phaser.Math.RND.pick(['straight', 'tracking', 'radial']); 
      const enemy = createEnemy(scene, x, 0, false, updateType);
      scene.enemies.add(enemy);
    }
  });
}
