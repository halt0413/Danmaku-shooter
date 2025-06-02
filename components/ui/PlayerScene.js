const Phaser = require('phaser');
import { handlePlayerMovement } from './PlayerControl';
import { initEnemySpawner } from './EnemySpawner';

export default class PlayerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayerScene' });//シーンキーの設定
  }

  preload() {
    //アセットなし
  }
create() {
  this.isGameOver = false;//ゲームオーバーフラグの初期化

  //プレイヤー用の図形を生成してテクスチャ化
  const graphics = this.add.graphics();

  graphics.fillStyle(0xffff00, 1);//黄色
  graphics.fillCircle(20, 20, 20);//半径20の円
  graphics.generateTexture('playerCircle', 40, 40);//テクスチャ名とサイズ
  graphics.destroy();//描画のgraphics削除

  //プレイヤースプライトを作成
  this.player = this.physics.add.sprite(400, 300, 'playerCircle');
  this.player.setCollideWorldBounds(true);// 画面外に出ないようにする

  //入力設定
  this.cursors = this.input.keyboard.createCursorKeys();
  this.keys = this.input.keyboard.addKeys({
    up: 'W',
    down: 'S',
    left: 'A',
    right: 'D',
  });

  //敵の生成
  initEnemySpawner(this);

  //プレイヤーと敵の当たり判定
  this.physics.add.overlap(this.player, this.enemies, () => {
    if (this.isGameOver) return;

    this.isGameOver = true;
    this.physics.pause();
    this.player.setTint(0xff0000);

    this.add.text(250, 250, 'げーむおーばー', {
      fontSize: '48px',
      color: '#ff0000',
      fontFamily: 'Arial',
    });
  }, null, this);
  }

  update() {
     if (this.isGameOver) return; //ゲームオーバー時は処理を停止

    //プレイヤーの移動制御
    handlePlayerMovement(this, this.player, this.cursors, this.keys);

    //画面外に出た敵は破棄
    this.enemies.children.each((enemy) => {
      if (enemy.y > 600) enemy.destroy();
    });
  }
}