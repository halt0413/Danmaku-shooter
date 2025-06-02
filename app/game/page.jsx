'use client';

import GameCanvas from '../../components/ui/GameCanvas';

export default function GamePage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff'}}>
      <GameCanvas />
    </div>
  );
}

