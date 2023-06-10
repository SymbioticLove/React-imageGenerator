import './imageGenerator.css';
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("Enter a detailed prompt!");
  const [showEnlargeButton, setShowEnlargeButton] = useState(false);
  const [enlarged, setEnlarged] = useState(false);

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setPlaceholder("Save your image & enter a new prompt...");
    setLoading(true);

    try {
      const res = await openai.createImage({
        prompt: prompt,
        n: 10,
        size: "1024x1024",
      });

      setLoading(false);
      setResult(res.data.data[0].url);
      setShowEnlargeButton(true);
    } catch (error) {
      setLoading(false);
      console.error(
        `Error generating image: ${error.response.data.error.message}`
      );
    }
  };

  const toggleEnlargeButton = () => {
    setEnlarged(!enlarged);
  };

  return (
    <div className="container">
      {loading ? (
        <>
          <div className="loadingContainer">
            <h3>Generating your image! Just a moment...</h3>
          </div>
        </>
      ) : (
        <>
          <div className="titleContainer">
            <h2 className="title">SymbioticBot Image Generator</h2>
            <h3 className="subtitle">Powered by DALL&middot;E</h3>
          </div>

          <div className="descriptionContainer">
            <p className="description">
              Enter a detailed prompt into the generator and click the
              generate button to see the result!
            </p>
          </div>

          <div className="promptContainer">
            <textarea
              className={placeholder === "Enter a new prompt..." ? "secondaryPlaceholder app-input" : "originalPlaceholder app-input"}
              placeholder={placeholder}
              onChange={(e) => setPrompt(e.target.value)}
              rows="10"
              cols="50"
            />
          </div>

          <div className="generateButtonContainer">
            <button onClick={generateImage} className="generateButton">Generate Image</button>
          </div>
          <p className="info">Your image will be displayed below!</p>
          <div className="arrowContainer">
            <span>&darr;</span><span>&darr;</span><span>&darr;</span><span>&darr;</span>
          </div>

          {result.length > 0 && (
            <>
              <div className={`resultContainer ${enlarged ? 'enlarged' : ''}`}>
                <div className="imageContainer">
                  <img className="result-image" src={result} alt="Your result!" />
                  {enlarged && (
                    <button className="closeButton" onClick={toggleEnlargeButton}>
                      X
                    </button>
                  )}
                </div>
              </div>
              {showEnlargeButton && !enlarged && (
                <div className="enlargeButtonContainer">
                  <button className="enlargeButton" onClick={toggleEnlargeButton}>
                    Enlarge Image
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ImageGenerator;







