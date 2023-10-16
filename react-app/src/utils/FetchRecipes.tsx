const fetchRecipes = async (query: string) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;
  
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(data);  
      return data.results; 
    } else {
      throw new Error('Failed to fetch recipes');
    }
  }
  export default fetchRecipes;