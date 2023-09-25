import { useState } from 'react';
import fetchRecipes from './utils/FetchRecipes';

const App = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleSearch = async () => {
    try {
      const fetchedRecipes = await fetchRecipes(query);
      const recipeDetailsPromises = fetchedRecipes.map((recipe: any) =>
        fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${import.meta.env.VITE_API_KEY}`)
          .then(response => response.json())
      );

      const recipeDetails = await Promise.all(recipeDetailsPromises);
      setRecipes(recipeDetails);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const toggleReadMore = (index: number) => {
    if (expanded === index) {
      setExpanded(null);
    } else {
      setExpanded(index);
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
          <div className="card" style={{ width: "18rem" }} key={index}>
            <img src={recipe.image} className="card-img-top" alt={recipe.title} />
            <div className="card-body">
              <h5 className="card-title">{recipe.title}</h5>
              <p className="card-text">
                {expanded === index ? (
                  <span dangerouslySetInnerHTML={{ __html: recipe.summary }}></span>
                ) : (
                  recipe.summary.length > 100
                    ? <span dangerouslySetInnerHTML={{ __html: recipe.summary.substring(0, 100) + '...' }}></span>
                    : <span dangerouslySetInnerHTML={{ __html: recipe.summary }}></span>
                )}
              </p>
              {recipe.summary.length > 100 && <button onClick={() => toggleReadMore(index)}>Read {expanded === index ? 'Less' : 'More'}</button>}
              <a href="#" className="btn btn-primary">View Recipe</a>
              <a href="#" className="btn btn-secondary">Add to Favorites</a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};


export default App;
