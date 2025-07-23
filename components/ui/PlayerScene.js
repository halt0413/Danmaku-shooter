const Phaser = require('phaser');
import { handlePlayerMovement } from './PlayerControl';
import { initEnemySpawner } from './EnemySpawner';

export default class PlayerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayerScene' }); 
  }

  preload() {
    //不要
  }

  create() {
    this.isGameOver = false;

    // スコア表示とタイマー
    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'スコア: 0', {
      fontSize: '24px',
      color: '#ffffff',
    });

    this.scoreTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.isGameOver) return;
        this.score += 10;
        this.scoreText.setText(`スコア: ${this.score}`);
      }
    });
    console.log('Game Over!');
    this.isGameOver = false; 

    // プレイヤー用のテクスチャ作成
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(20, 20, 20);
    graphics.generateTexture('playerCircle', 40, 40);
    graphics.destroy();

    // プレイヤーの生成
    this.player = this.physics.add.sprite(400, 300, 'playerCircle');
    this.player.setCollideWorldBounds(true); 

    // キーボード
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D',
    });

    // 弾のテクスチャ作成
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('bullet', 8, 8);
    g.destroy();

    // 弾のグループ作成
    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      defaultKey: 'bullet',
      runChildUpdate: true,
    });

    // 弾とプレイヤーの当たり判定
    this.physics.add.overlap(this.player, this.bullets, () => {
      if (this.isGameOver) return;

      this.isGameOver = true;
      this.scoreTimer?.remove();
      this.enemySpawnTimer?.remove(); 
      this.physics.pause(); 
      this.player.setTint(0xff0000); 

      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;

      // げーむおーばー表示
      this.add.text(centerX, centerY - 60, 'げーむおーばー', {
        fontSize: '48px',
        color: '#ff0000',
        fontFamily: 'Arial',
      }).setOrigin(0.5);

      // リトライボタン
      const retryText = this.add.text(centerX, centerY, 'リトライ', {
        fontSize: '32px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 10, y: 5 },
      }).setOrigin(0.5).setInteractive();
      retryText.on('pointerdown', () => this.scene.restart());

      // ホームに戻るボタン
      const homeText = this.add.text(centerX, centerY + 60, 'ホームへ', {
        fontSize: '32px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 10, y: 5 },
      }).setOrigin(0.5).setInteractive();
      homeText.on('pointerdown', () => window.location.href = '/');
    });

    initEnemySpawner(this);

    // プレイヤーと敵の接触でげーむおーばー
    this.physics.add.overlap(this.player, this.enemies, () => {
      if (this.isGameOver) return;

      this.isGameOver = true;
      this.enemySpawnTimer?.remove();
      this.physics.pause();
      this.player.setTint(0xff0000);
    }, null, this);
  }


  update() {
    if (this.isGameOver) return;

    handlePlayerMovement(this, this.player, this.cursors, this.keys);

    // 敵の更新と画面外削除
    if (this.enemies) {
      this.enemies.children.each((enemy) => {
        if (enemy.y > 600) {
          enemy.destroy();
          return;
        }
        if (enemy.update) {
          enemy.update();
        }
      });
    }

    // 弾が画面外に出たら無効化
    this.bullets.children.each((bullet) => {
      if (
        bullet.active &&
        (bullet.x < -10 || bullet.x > 810 || bullet.y < -10 || bullet.y > 610)
      ) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.stop();
      }
    });
  }
}
