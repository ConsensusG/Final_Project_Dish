import { useState, useEffect } from 'react';
import fetchRecipes from './utils/FetchRecipes';
import './AppStyles.css'
import Slider from "react-slick";
import { BrowserRouter as Router,  Route,  Link,  Routes} from "react-router-dom";


const App = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showModalContent, setShowModalContent] = useState<boolean>(false);
  const [modalRecipe, setModalRecipe] = useState<any>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);

  function Favorites() {
    return (
      <div className="cards-container">
        {favoriteRecipes.map((recipe: any, index: number) => (
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
              <button className="btn btn-secondary view-details-btn" onClick={() => toggleModal(recipe)}>View Details</button>
              <button className="btn btn-secondary add-to-faves-btn" onClick={() => addToFavorites(recipe)}>Add to Faves</button>
            </div>
          </div>
        ))}
      </div>
    );
  }


  const handleSearch = async () => {
    try {
      // Check if the data is already in localStorage
      const cachedData = localStorage.getItem(`recipes-${query}`);
      
      if (cachedData) {
        setRecipes(JSON.parse(cachedData));
        return;
      }
  
      const fetchedRecipes = await fetchRecipes(query);
      const recipeDetailsPromises = fetchedRecipes.map((recipe: any) =>
        fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${import.meta.env.VITE_API_KEY}`)
          .then(response => response.json())
      );
  
      const recipeDetails = await Promise.all(recipeDetailsPromises);
      console.log('Fetched Recipe Details:', recipeDetails);
      
      // Save the data in localStorage for future use
      localStorage.setItem(`recipes-${query}`, JSON.stringify(recipeDetails));
      
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
  
  const sliderSettings = {
    dots: true,  // Display dot indicators at the bottom
    infinite: true,  // Infinite loop sliding
    speed: 1000,  // Slide transition speed
    slidesToShow: 5,  // Number of cards to show at once
    slidesToScroll: 5,  // Number of cards to scroll at a time
    // ... any other settings you want
  };

  const addToFavorites = (recipe: any) => {
    // Check if the recipe is already in the favorites list
    if (!favoriteRecipes.some(favRecipe => favRecipe.id === recipe.id)) {
      setFavoriteRecipes(prevFavorites => [...prevFavorites, recipe]);
    }
  };

  useEffect(() => {
    console.log('Favorite Recipes:', favoriteRecipes);
  }, [favoriteRecipes]);
  
  const deleteFavorite = (recipeToDelete: any) => {
    setFavoriteRecipes(prevFavorites => 
        prevFavorites.filter(recipe => recipe.id !== recipeToDelete.id)
    );
};


  return (
    <Router>
        <nav className="navbar navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src="/icons/icons8-meal-48.png" alt="Logo" width="30" height="30" className="d-inline-block align-text-top" />
                    DISH
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/favorites" className="nav-link">Favorites</Link>
                    </li>
                </ul>
            </div>
        </nav>

        <Routes>
            <Route path="/" element={
                <div>
                    <div className="search-main-container">
                        <div className="search-container">
                            <input
                                className="search-input"
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search for recipes..."
                            />
                            <button className="search-button" onClick={handleSearch}>Search</button>
                        </div>
                        <div className="filter-icons">
                            <img
                                src="/icons/gluten-free.png"
                                alt="Gluten Free"
                                className="icon-button"
                                onClick={() => handleKeywordSearch('gluten free')}
                            />
                            <img
                                src="/icons/vegetarian.png"
                                alt="Vegetarian"
                                className="icon-button"
                                onClick={() => handleKeywordSearch('vegetarian')}
                            />
                            <img
                                src="/icons/vegan.png"
                                alt="Vegan"
                                className="icon-button"
                                onClick={() => handleKeywordSearch('vegan')}
                            />
                        </div>
                    </div>
                    <div className="cards-container">
                        <Slider {...sliderSettings}>
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
                                        <button className="btn btn-secondary view-details-btn" onClick={() => toggleModal(recipe)}>View Details</button>
                                        <button className="btn btn-secondary add-to-faves-btn" onClick={() => addToFavorites(recipe)}>Add to Faves</button>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    {isModalOpen && (
                        <div className="modal">
                            <div className={`modal-content ${showModalContent ? 'show' : ''}`}>
                                <span className="close-button" onClick={() => { setModalOpen(false); setShowModalContent(false); }}>×</span>
                                {modalRecipe && (
                                    <>
                                        <h5 className="card-title">{modalRecipe.title}</h5>
                                        <img src={modalRecipe.image} className="card-img-top" alt={modalRecipe.title} />
                                        <p dangerouslySetInnerHTML={{ __html: modalRecipe.summary }}></p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            } />
            <Route path="/favorites" element={<Favorites />} />
        </Routes>
    </Router>
);
          }


export default App;
