import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function GameCanvas() {
  const gameRef = useRef(null);

  useEffect(() => {
    // Phaserゲームインスタンスを生成
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      scene: {
        preload,
        create,
        update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      // アセット読み込み（例：画像など）
    }

    function create() {
      // ゲーム初期化処理（例：背景、プレイヤー配置）
      this.add.text(100, 100, '弾幕避けゲーム', { fontSize: '32px', color: '#fff' });
    }

    function update() {
      // 毎フレームの処理（弾の移動など）
    }

    // クリーンアップ（コンポーネントがアンマウントされたとき）
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} />;
}
