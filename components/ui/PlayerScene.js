const Phaser = require('phaser');
import { handlePlayerMovement } from './PlayerControl';
import { initEnemySpawner } from './EnemySpawner';

export default class PlayerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayerScene' }); // シーンの識別キーを設定
  }

  preload() {
    // アセットは動的に生成するため読み込みは不要
  }

  create() {
    console.log('Game Over!');
    this.isGameOver = false; // ゲームオーバーフラグの初期化

    // プレイヤー用のテクスチャ作成
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(20, 20, 20);
    graphics.generateTexture('playerCircle', 40, 40);
    graphics.destroy();

    // プレイヤーの生成
    this.player = this.physics.add.sprite(400, 300, 'playerCircle');
    this.player.setCollideWorldBounds(true); // 画面外に出ないよう制限

    // キーボード操作の設定（矢印キー + WASD）
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
      this.enemySpawnTimer?.remove(); // 敵生成停止
      this.physics.pause(); // ゲーム停止
      this.player.setTint(0xff0000); // プレイヤーを赤に

      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;

      // ゲームオーバー表示
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

    // 敵のスポーン処理の初期化
    initEnemySpawner(this);

    // プレイヤーと敵の接触でゲームオーバー
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

    // プレイヤーの移動処理
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
