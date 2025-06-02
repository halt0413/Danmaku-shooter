'use client';

import { useEffect, useRef } from 'react';
import PlayerScene from './PlayerScene';

export default function GameCanvas() {
   //Phaserのゲーム描画先となるDOM要素を参照するためのref
  const gameRef = useRef(null);

  useEffect(() => {
     //Phaserライブラリを動的に読み込む
    const Phaser = require('phaser');

    //Phaserゲームのインスタンスを作成
    const game = new Phaser.Game({
      type: Phaser.AUTO,//自動でWebGL or Canvasを選択
      width: 800,       //ゲームの横幅
      height: 600,       //ゲームの高さ
      parent: gameRef.current, //描画先のHTML要素を指定(さっきのやつ)
      physics: {
        default: 'arcade',
        arcade: { debug: false },// 当たり判定などを可視化(開発用)
      },
      scene: PlayerScene,//実行するゲームシーンを指定
    });

    //コンポーネントがアンマウントされたときにゲームを破棄
    return () => {
      game.destroy(true);//trueでcanvasも削除
    };
  }, []);

  //ゲーム描画エリア
  return <div ref={gameRef} />;
}
