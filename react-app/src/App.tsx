import { useState, useEffect } from 'react';
import fetchRecipes from './utils/FetchRecipes';
import './AppStyles.css'
import Slider from "react-slick";
import { BrowserRouter as Router,  Route,  Link,  Routes} from "react-router-dom";
import Register from './Views/Register'; // Import the Register component
import SignIn from './Views/Sign-In'; // Import the Sign-In component
import { saveRecipeToFavorite, removeRecipeFromFavorite, fetchFavoriteRecipes } from './utils/FirestoreFunctions.tsx';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase.tsx';
import { signOut } from "firebase/auth";





interface FavoritesProps {
  userId: string | null;
  favoriteRecipes: any[];
  deleteFavorite: (recipeToDelete: any) => void;
  selectedRecipeForNotes: number | null;
  setSelectedRecipeForNotes: React.Dispatch<React.SetStateAction<number | null>>;
  notesForRecipes: Record<number, string>;
  setNotesForRecipes: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

function Favorites({
  favoriteRecipes,
  deleteFavorite,
  selectedRecipeForNotes,
  setSelectedRecipeForNotes,
  notesForRecipes,
  setNotesForRecipes
}: FavoritesProps) {
  return (
    <div className="favorites-container mt-5">
      <div className="favorites-cards-container mt-5">
        {favoriteRecipes.map((recipe: any, index: number) => (
          <div className="favorites-card" style={{ width: "18rem" }} key={index}>
            <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                <img src={recipe.image} className="card-img-top" alt={recipe.title} />
            </a>
            <div className="card-body">
              <h5 className="favorites-card-title">{recipe.title}</h5>
              <button className="btn btn-secondary add-notes-btn" onClick={() => setSelectedRecipeForNotes(recipe.id)}>Add/Edit Notes</button>
              <button className="btn btn-danger delete-fave-btn" onClick={() => deleteFavorite(recipe)}>Delete Fave</button>
            </div>
          </div>
        ))}
      </div>


      
      {selectedRecipeForNotes && (
        <div className="notes-container">
          <textarea 
            value={notesForRecipes[selectedRecipeForNotes] || ''}
            onChange={(e) => setNotesForRecipes({
              ...notesForRecipes, 
              [selectedRecipeForNotes]: e.target.value
            })}
            placeholder="Add your notes here..."
          />
          <button className='Favorites-close-button' onClick={() => setSelectedRecipeForNotes(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

const App = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showModalContent, setShowModalContent] = useState<boolean>(false);
  const [modalRecipe, setModalRecipe] = useState<any>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);
  const [notesForRecipes, setNotesForRecipes] = useState<Record<number, string>>({});
  const [selectedRecipeForNotes, setSelectedRecipeForNotes] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);


    // Add this useEffect in your App component
  
    useEffect(() => {
      // Moved fetchFavorites inside this useEffect
      const fetchFavorites = async () => {
        if (userId) { 
          const fetchedFavorites = await fetchFavoriteRecipes(userId);
          console.log("Fetched Favorites:", fetchedFavorites);
          setFavoriteRecipes(fetchedFavorites);
        }
      };
    
      // Handle user authentication state
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, set the userId.
          setUserId(user.uid);
        } else {
          // User is signed out, clear the favorites and userId.
          setUserId(null);
          setFavoriteRecipes([]);
        }
      });
    
      fetchFavorites();  // Call it here to fetch favorites whenever userId changes
    
      return () => unsubscribe(); // Cleanup subscription
    }, [userId]);  // Add userId here
    
  
    useEffect(() => {
      console.log("Current userId:", userId);
    }, [userId]);


    const handleSignOut = async () => {
      try {
        await signOut(auth);
        console.log('User signed out');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };
  
  
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
      console.log("Sample Recipe Object:", recipeDetails[0]);  // Log the first recipe object
      setQuery(''); // Clear the search bar
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  

  const handleKeywordSearch = (keyword: string) => {
    const newQuery = `${query} ${keyword}`.trim();
    setQuery(newQuery);
    handleSearch();
    setQuery(''); // Clear the search bar
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

  const addToFavorites = async (recipe: any) => {
    // Check if the recipe is already in the favorites list
    if (!favoriteRecipes.some(favRecipe => favRecipe.id === recipe.id)) {
      console.log('Inside the if condition');
      console.log("Adding recipe to favorites...");
      setFavoriteRecipes(prevFavorites => [...prevFavorites, recipe]);
      if (userId) { // make sure userId is not null or undefined
        console.log("User ID is:", userId);
        console.log("About to call saveRecipeToFavorite");
        await saveRecipeToFavorite(userId, recipe);
      }
    }
  };

  useEffect(() => {
    console.log('Favorite Recipes:', favoriteRecipes);
  }, [favoriteRecipes]);
  
  const deleteFavorite = async (recipeToDelete: any) => {
    setFavoriteRecipes(prevFavorites => 
      prevFavorites.filter(recipe => recipe.id !== recipeToDelete.id)
    );
    if (userId) { // make sure userId is not null or undefined
      await removeRecipeFromFavorite(userId, recipeToDelete);
    }
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
          <li className="nav-item">
            <Link to="/register" className="nav-link">Register</Link>
          </li>
          <li className="nav-item">
            <Link to="/sign-in" className="nav-link">Sign-in</Link>
          </li>
          <li className="nav-item">
          <a href="#" className="nav-link" onClick={handleSignOut}>
              Sign-out
            </a>
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
                              <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                                  <img src={recipe.image} className="card-img-top" alt={recipe.title} />
                              </a>
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
      <Route 
          path="/favorites" 
          element={
            <Favorites 
              userId={userId}
              favoriteRecipes={favoriteRecipes}
              deleteFavorite={deleteFavorite}
              selectedRecipeForNotes={selectedRecipeForNotes}
              setSelectedRecipeForNotes={setSelectedRecipeForNotes}
              notesForRecipes={notesForRecipes}
              setNotesForRecipes={setNotesForRecipes}
            />
          } 
      />
      <Route path="/register" element={<Register />} />  {/* New Route for Register */}
      <Route path="/sign-in" element={<SignIn />} />  {/* New Route for Sign-In */}
    </Routes>
  </Router>
);

}

export default App;