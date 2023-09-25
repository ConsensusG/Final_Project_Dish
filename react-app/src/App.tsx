import { useState } from 'react';
import fetchRecipes from './utils/FetchRecipes';

const App = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async () => {
    try {
      const fetchedRecipes = await fetchRecipes(query);
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <>
      <input 
        type="text" 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Search for recipes..." 
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {recipes.map((recipe: any, index: number) => (
          <div key={index}>
            {recipes.map((recipe: any, index: number) => (
              <div className="card" style={{ width: "18rem" }} key={index}>
                <img src={recipe.image} className="card-img-top" alt={recipe.title} />
                <div className="card-body">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p className="card-text">{recipe.summary}</p>
                  <a href="#" className="btn btn-primary">View Recipe</a>
                  <a href="#" className="btn btn-secondary">Add to Favorites</a>
                </div>
              </div>
            ))}

          </div>
        ))}
      </div>
    </>
  );
};

export default App;
