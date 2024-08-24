import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState("");
  const [recipeDate, setRecipeDate] = useState(0);
  const [newNames, setNewNames] = useState({});

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/recipes/");
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addRecipe = async () => {
    const recipeData = {
      name,
      recipe_date: recipeDate,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/recipes/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();
      setRecipes((prev) => [...prev, data]);

    } catch (err) {
      console.log(err);
    }
  };

  const updateName = async (pk, recipe_date) => {
    const recipeData = {
      name: newNames[pk] || "",
      recipe_date,
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/recipes/${pk}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();
      setRecipes((prev) => 
        prev.map((recipe) => {
          if (recipe.id === pk) {
            return data;
          } else {
            return recipe;
          }
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleNameChange = (pk, value) => {
    setNewNames((prev) => ({
      ...prev,
      [pk]: value,
    }));
  };

  const deleteRecipe = async (pk) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/recipes/${pk}`, {
        method: "DELETE",
      });

      setRecipes((prev) => prev.filter((recipe) => recipe.id !== pk));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1 className="h1">Tedra's Recipe Vault</h1>

      <div className="form-container">
        <input
          type="text"
          placeholder="Recipe Name..."
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Recipe Date..."
          onChange={(e) => setRecipeDate(Number(e.target.value))}
        />
        <button onClick={addRecipe}>Add</button>
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <p>Name: {recipe.name}</p>
            <p>Recipe Date: {recipe.recipe_date}</p>
            <input
              type="text"
              placeholder="New Name.."
              value={newNames[recipe.id] || ""}
              onChange={(e) => handleNameChange(recipe.id, e.target.value)}
            />
            <button onClick={() => updateName(recipe.id, recipe.recipe_date)}> Change Name</button>
            <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
