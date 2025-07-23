'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useGameStore } from '../../lib/store';

export default function StartScreen() {

  const router = useRouter();

  const setDifficulty = useGameStore((state) => state.setDifficulty);

  const [selected, setSelected] = useState('easy');

  const startGame = () => {
    setDifficulty(selected);
    router.push('/game'); 
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>Code Dodge</h1>
      {/* <p>難易度を選んでください</p>
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
      </div> */}
      <button onClick={startGame} style={{ padding: '10px 30px' }}>
        ゲームスタート
      </button>
    </div>
  );
}
