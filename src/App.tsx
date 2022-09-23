import { useRef } from "react";
import { PolyButtonV4 } from "@components/index";
import "./App.css";

function App() {
  const divRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="App">
      <PolyButtonV4 ref={buttonRef} as="button" color="primary">
        default element
      </PolyButtonV4>
      <PolyButtonV4
        as="h2"
        color="accent"
        style={{ border: "1px solid SteelBlue", padding: "0.5rem 1rem", borderRadius: "4px" }}
      >
        default element
      </PolyButtonV4>
    </div>
  );
}

export default App;
