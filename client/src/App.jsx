import "./App.styles.scss";
import TextUpload from "./components/TextUPload/TextUpload";
import { useState } from "react";
import AnimatedScrollText from "./components/AnimatedScrollText/AnimatedScrollText";
const App = () => {
  const [text, setText] = useState(null);
  const handleUpload = async (data) => {
    setText(data);
  };
  return (
    <div>
      <section id="heading">
        <div className="container">
          {!text && <TextUpload onUpload={handleUpload} />}
        </div>
      </section>
      {text && <AnimatedScrollText text={text} onSetText={setText} />}
    </div>
  );
};

export default App;
