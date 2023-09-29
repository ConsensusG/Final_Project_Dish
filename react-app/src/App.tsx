import { useState, useEffect } from 'react';
import fetchRecipes from './utils/FetchRecipes';
import './AppStyles.css'

const App = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showModalContent, setShowModalContent] = useState<boolean>(false);
  const [modalRecipe, setModalRecipe] = useState<any>(null);


  const handleSearch = async () => {
    try {
      const fetchedRecipes = await fetchRecipes(query);
      const recipeDetailsPromises = fetchedRecipes.map((recipe: any) =>
        fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${import.meta.env.VITE_API_KEY}`)
          .then(response => response.json())
      );

      const recipeDetails = await Promise.all(recipeDetailsPromises);
      setRecipes(recipeDetails);
      setQuery(''); // Clear the search bar
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleKeywordSearch = (keyword: string) => {
    const newQuery = `${query} ${keyword}`.trim();
    setQuery(newQuery);
    handleSearch();
  };

  const getRandomRecipes = async () => {
    try {
      const url = `https://api.spoonacular.com/recipes/random?number=8&apiKey=${import.meta.env.VITE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error('An error occurred fetching random recipes:', error);
    }
  };

  useEffect(() => {
    getRandomRecipes();
  }, []);

  const toggleModal = (recipe: any) => {
    if (!isModalOpen) {
      // If the modal is currently closed, open it and prepare the animation
      setModalOpen(true);
  
      // Delay the content appearance for a smoother animation effect
      setTimeout(() => {
        setShowModalContent(true);
        setModalRecipe(recipe);
      }, 50);
    } else {
      // If modal is currently open and we are closing it, hide content immediately
      setShowModalContent(false);
  
      // Delay closing the modal a bit to allow the content's hide animation to play
      setTimeout(() => {
        setModalOpen(false);
        setModalRecipe(null);
      }, 300);
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
      <button onClick={() => handleKeywordSearch('gluten free')}>Gluten Free</button>
      <button onClick={() => handleKeywordSearch('vegetarian')}>Vegetarian</button>
      <button onClick={() => handleKeywordSearch('vegan')}>Vegan</button>
      <div>
        {recipes.map((recipe: any, index: number) => (
          <div className="card" style={{ width: "18rem" }} key={index}>
            <img src={recipe.image} className="card-img-top" alt={recipe.title} />
            <div className="card-body">
              <h5 className="card-title">{recipe.title}</h5>
              <p className="card-text">
                <span dangerouslySetInnerHTML={{ 
                  __html: recipe.summary.length > 100 
                  ? recipe.summary.substring(0, 100) + '...'
                  : recipe.summary 
                }}></span>
              </p>
              <button onClick={() => toggleModal(recipe)}>View Details</button>
              <a href="#" className="btn btn-secondary">Add to Favorites</a>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className={`modal-content ${showModalContent ? 'show' : ''}`}>
            <span className="close-button" onClick={() => { setModalOpen(false); setShowModalContent(false); }}>×</span>

            <h5 className="card-title">{modalRecipe.title}</h5>
            <img src={modalRecipe.image} className="card-img-top" alt={modalRecipe.title} />
            <p dangerouslySetInnerHTML={{ __html: modalRecipe.summary }}></p>
          </div>
        </div>
      )}

    </>
  );
};

export default App;