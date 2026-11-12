import { useState } from 'react';

export default function AboutPage() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <h1>Despre</h1>
      <p>Aplicație web creată în cadrul laboratoarelor de DAW.</p>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1.5rem' }}>
        <button type="button" onClick={() => setCount(count + 1)}>
          Ați apăsat de {count} ori
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Resetează
        </button>
      </div>
    </section>
  );
}