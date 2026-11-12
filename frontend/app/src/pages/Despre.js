import { useState } from "react";

function Despre() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Despre</h1>
      <p>Ai apăsat de {count} ori.</p>

      <button onClick={() => setCount(count + 1)}>
        Apasă-mă
      </button>

      <button onClick={() => setCount(0)}>
        Resetează
      </button>
    </div>
  );
}

export default Despre;