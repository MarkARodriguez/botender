import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import loading1 from './assets/loading1.svg';
import loading2 from './assets/loading2.svg';
import loading3 from './assets/loading3.svg';
import loading4 from './assets/loading4.svg';
import './App.css';
import './fonts.css';

function App() {
  const [tequila, setTequila] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showButton, setShowButton] = useState(true);
  const [loadingImageIndex, setLoadingImageIndex] = useState(0);
  const [recipeParts, setRecipeParts] = useState({ title: '', ingredients: '', instructions: '' });

  const tequilas = ["Suerte Tequila Añejo", "Suerte Tequila Reposado", "Suerte Tequila Blanco", "Suerte Tequila Gold"];

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingImageIndex(prevIndex => (prevIndex + 1) % 4); // Cycle through 0 to 3
      }, 250); // Change image every 250ms
    } else {
      setLoadingImageIndex(0); // Reset to the first image when not loading
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tequila || !ingredients) {
      setErrorMessage("Please select a tequila type and list the ingredients.");
      setShowButton(false);

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
      const processedRecipe = processRecipeText(data.recipe.message.content);
      setRecipeParts(processedRecipe);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const processRecipeText = (recipeText) => {
    const parts = {
      title: '',
      ingredients: '',
      instructions: '',
    };

    if (recipeText.includes("Recipe:")) {
      parts.title = recipeText.split("Ingredients:")[0];
    }
    
    if (recipeText.includes("Ingredients:")) {
      parts.ingredients = recipeText.split("Ingredients:")[1].split("Instructions:")[0];
    }
    
    if (recipeText.includes("Instructions:")) {
      parts.instructions = recipeText.split("Instructions:")[1];
    }

    return parts;
  };

  const resetForm = () => {
    setTequila('');
    setIngredients('');
    setShowButton(true);
    setErrorMessage('');
    setRecipeParts({ title: '', ingredients: '', instructions: '' });
  };

  // Helper function to check if recipeParts is empty
  const isRecipePartsEmpty = () => {
    return !recipeParts.title && !recipeParts.ingredients && !recipeParts.instructions;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {!isLoading && isRecipePartsEmpty() && (
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
        {isLoading && (
          <div className="App-loading">
            <img src={[loading1, loading2, loading3, loading4][loadingImageIndex]} alt="Loading" />
          </div>
        )}
        {!isLoading && !isRecipePartsEmpty() && (
          <div className="App-recipe-output">
            {recipeParts.title && <strong>{recipeParts.title.trim()}</strong>}
            {recipeParts.ingredients && (
              <div>
                <strong>Ingredients:</strong>
                <p>{recipeParts.ingredients.trim()}</p>
              </div>
            )}
            {recipeParts.instructions && (
              <div>
                <strong>Instructions:</strong>
                <p>{recipeParts.instructions.trim()}</p>
              </div>
            )}
            <button onClick={resetForm} className="App-button" style={{ fontFamily: "'zai_OlivettiLettera22Typewriter', sans-serif" }}>SECOND ROUND</button>
            <p style={{ color: '#ED6C23', fontSize: '16px' }}>
  Mix, snap, sip, and share your Botender masterpiece on social media 
  with the hashtag #suertebotender. And don't forget to tag @suertetequila. 
  Cheers to virtual cheers!
</p>
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
