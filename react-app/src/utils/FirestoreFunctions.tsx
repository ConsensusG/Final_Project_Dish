import { db } from "../Firebase"; // Import the db object you exported in Firebase.tsx
import { doc, setDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";

interface Recipe {
    id: number;
    title: string;
    image: string;
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    veryHealthy: boolean;
    aggregateLikes: number;
    cookingMinutes: number;
    cuisines: string[];
    diets: string[];
    dishTypes: string[];
    extendedIngredients: any[]; // You can make this more specific
    healthScore: number;
    instructions: string;
    readyInMinutes: number;
    servings: number;
    sourceName: string;
    sourceUrl: string;
    // ... add other fields as needed
  }
  

export const saveRecipeToFavorite = async (uid: string, recipe: Recipe) => {
  console.log("Attempting to save recipe to favorites...");
  const userDoc = doc(db, "users", uid);
  await setDoc(userDoc, {
    favorites: arrayUnion(recipe)
  }, { merge: true })
  .then(() => console.log("Successfully saved recipe to favorites"))
  .catch((error) => console.log("Error saving recipe to favorites:", error));
};

export const removeRecipeFromFavorite = async (uid: string, recipe: Recipe) => {
  const userDoc = doc(db, "users", uid);
  await setDoc(userDoc, {
    favorites: arrayRemove(recipe)
  }, { merge: true });
};

export const fetchFavoriteRecipes = async (uid: string) => {
    const userDoc = doc(db, "users", uid);
    const docSnap = await getDoc(userDoc);
  
    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log("UserData from Firestore:", userData); 
      return userData?.favorites || [];
    } else {
      console.log("No such document!");
      return [];
    }
  };
  