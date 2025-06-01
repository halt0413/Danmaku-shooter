'use client';

import { useGameStore } from '../../lib/store';

export default function GamePage() {
  const difficulty = useGameStore((state) => state.difficulty);

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h2>ゲーム画面（仮）</h2>
      <p>選んだ難易度: {difficulty}</p>
    </div>
  );
}
