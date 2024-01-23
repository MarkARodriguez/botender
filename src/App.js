import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';

function App() {
  const [tequila, setTequila] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tequilas = ["Tequila Añejo", "Tequila Reposado", "Tequila Blanco", "Tequila Gold"];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://18.188.217.185:3000/generate-recipe', {
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
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {!recipe && !isLoading && (
          <form onSubmit={handleSubmit}>
             <p>WHAT TEQUILA ARE WE USING TODAY?</p>

            <select value={tequila} onChange={(e) => setTequila(e.target.value)} className="App-select">
              <option value="">Select Tequila</option>
              {tequilas.map((teq, index) => (
                <option key={index} value={teq}>{teq}</option>
              ))}
            </select>
            <p>LIST OTHER INGREDIENTS YOU HAVE ON HAND:</p>

            <textarea
              className="App-input"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter other ingredients"
            />
            <button type="submit" className="App-button">Make drink</button>
          </form>
        )}

        {isLoading && <div className="App-loading"></div>}

        {recipe && (
        <div className="App-recipe-output">
          <strong>Recipe:</strong>
          <p>{recipe}</p>
          <button onClick={resetForm} className="App-button">Second Round</button>
        </div>
)}
      </header>
    </div>
  );
}

export default App;
