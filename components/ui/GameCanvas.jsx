'use client';

import { useEffect, useRef } from 'react';
import PlayerScene from './PlayerScene';

export default function GameCanvas() {
  const gameRef = useRef(null);

  useEffect(() => {
    const Phaser = require('phaser');

    //Phaserゲームのインスタンスを作成
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,       //ゲームの横幅
      height: 600,       //ゲームの高さ
      parent: gameRef.current, //描画先のHTML要素を指定(さっきのやつ)
      physics: {
        default: 'arcade',
        arcade: { debug: false },
      },
      scene: PlayerScene,
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} />;
}
