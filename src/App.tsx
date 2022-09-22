import { PolyButtonV1 } from "@components/index";
import "./App.css";

function App() {
  return (
    <div className="App">
      <PolyButtonV1 as="a" href="https://www.google.com" style={{ display: "block" }}>
        anchor element
      </PolyButtonV1>
      <PolyButtonV1 >default element</PolyButtonV1>
    </div>
  );
}

export default App;
