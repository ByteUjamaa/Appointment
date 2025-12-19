import React, { createContext, useContext, useEffect, useState } from "react";
//createContext this creates the global context to be used throughout
//useContext allows components to read the context
//useState this stores the current state which is the current theme
//useEffect runs side effects(reading localstorage and updating the DOM)




//We are creating theme context object and passed with the default object(light) and this
//  context will be used only when the component accesses the context outside the provider
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {}, //the function to switch themes
});


//this component wraps your app
//children means all components inside <ThemeProvider> will be provided with the theme data
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); //stores the cuurrent theme where by the default value is light and it can be changed to dark

  // Load initial theme from localStorage or system preference runs once the componnetc mounts and read the saved theme from localstorge
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    //check if the themeexists if user previously chose the theme them apply t and stop furthet execution
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      return;
    }

    //detect system theme preference and uses browserAPI to detect if the os prefrs dark mode
    const prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
      //sets theme based on system preference if no saved theme exists
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  // Apply theme class to <html> and persist
  useEffect(() => {
    const root = document.documentElement; //tailwindcss uses this for dark mode

    //this add or remove the dark class for light mode 
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    //persist theme across page reloads
    localStorage.setItem("theme", theme);
  }, [theme]); //runs this effect everytime theme changes 


  //this switches the theme from dark to light and otherwise use the previous state(prev) for safety
  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));


  //this makes the theme and toggleTheme available globally any component inside the context provider can access theme
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


//exporting the custom hook 
export const useTheme = () => useContext(ThemeContext);


