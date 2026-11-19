import { createContext, useContext, useState } from "react";
import { nearbyFood } from "../data/mockNearby";

const FoodContext = createContext(null);

export function FoodProvider({ children }) {
    const [foods, setFoods] = useState(nearbyFood);

    const updateStatus = (id, status) =>
        setFoods((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));

    return (
        <FoodContext.Provider value={{ foods, updateStatus }}>{children}</FoodContext.Provider>
    );
}

export const useFood = () => useContext(FoodContext);