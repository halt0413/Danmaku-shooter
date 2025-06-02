'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useGameStore } from '../../lib/store';

export default function StartScreen() {

  //ページ遷移
  const router = useRouter();

   //Zustandで難易度を保存
  const setDifficulty = useGameStore((state) => state.setDifficulty);

  //ローカル状態で選択中の難易度を管理
  const [selected, setSelected] = useState('easy');

  //スタートボタン押した時の処理
  const startGame = () => {
    setDifficulty(selected);//グローバルに難易度を保存
    router.push('/game'); //ゲーム画面に遷移
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>Code Dodge</h1>
      <p>難易度を選んでください</p>
      <div style={{ marginBottom: '20px' }}>
        {['easy', 'normal', 'hard'].map((level) => (
          <button
            key={level}
            onClick={() => setSelected(level)}
            style={{
              margin: '0 10px',
              padding: '10px 20px',
              backgroundColor: selected === level ? '#4caf50' : '#ccc',
            }}
          >
            {level}
          </button>
        ))}
      </div>
      <button onClick={startGame} style={{ padding: '10px 30px' }}>
        ゲームスタート
      </button>
    </div>
  );
}
