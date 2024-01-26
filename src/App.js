import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';
import './fonts.css';

function App() {
  const [tequila, setTequila] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showButton, setShowButton] = useState(true);

  const tequilas = ["Suerte Tequila Añejo", "Suerte Tequila Reposado", "Suerte Tequila Blanco", "Suerte Tequila Gold"];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tequila || !ingredients) {
      setErrorMessage("Please select a tequila type and list the ingredients.");
      setShowButton(false);

      // Clear the error message and show the button after 2 seconds
      setTimeout(() => {
        setErrorMessage('');
        setShowButton(true);
      }, 2000);

      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://bot.sourcemachines.com:3000/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tequila, ingredients }),
      });
      const data = await response.json();
      setRecipe(data.recipe.message.content);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTequila('');
    setIngredients('');
    setRecipe('');
    setShowButton(true);
    setErrorMessage('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {!recipe && !isLoading && (
          <form onSubmit={handleSubmit}>
            <p style={{ fontFamily: "'zai_OlivettiLettera22Typewriter', sans-serif" }}>WHICH TEQUILA ARE WE USING TODAY?</p>
            <select value={tequila} onChange={(e) => setTequila(e.target.value)} className="App-select">
              <option value="">Select Tequila</option>
              {tequilas.map((teq, index) => (
                <option key={index} value={teq}>{teq}</option>
              ))}
            </select>
            <p style={{ fontFamily: "'zai_OlivettiLettera22Typewriter', sans-serif" }}>LIST OTHER INGREDIENTS YOU HAVE ON HAND:</p>
            <textarea
              className="App-input"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter other ingredients"
            />
            {showButton ? (
              <button type="submit" className="App-button" style={{ fontFamily: "'zai_OlivettiLettera22Typewriter', sans-serif" }}>MAKE A DRINK</button>
            ) : (
              <p style={{ color: 'red' }}>{errorMessage}</p>
            )}
          </form>
        )}
        {isLoading && <div className="App-loading"></div>}
        {recipe && (
          <div className="App-recipe-output">
            <strong>Recipe:</strong>
            <p>{recipe}</p>
            <button onClick={resetForm} className="App-button" style={{ fontFamily: "'zai_OlivettiLettera22Typewriter', sans-serif" }}>SECOND ROUND</button>
          </div>
        )}
      </header>
      <footer className="App-footer">
        <p>Disclaimer: The Suerte Botender's here to suggest cocktails based on your ingredients, but let's be clear—it's not as great as a real mixologist. If your drink doesn't hit the mark, it's not the Botender’s fault. Enjoy responsibly and remember, it's just a digital recipe bot. Good luck!</p>
      </footer>
    </div>
  );
}

export default App;
