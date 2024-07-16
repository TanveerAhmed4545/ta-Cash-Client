/* eslint-disable react-refresh/only-export-components */

// export { AuthContext, AuthProvider, useAuth };

// import axios from "axios";
// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);

// // eslint-disable-next-line react/prop-types
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // Add loading state

//   useEffect(() => {
//     const initializeUser = async () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const userResponse = await axios.get("http://localhost:5000/Users", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setUser(userResponse.data);
//           console.log("User initialized from token:", userResponse.data);
//         } catch (error) {
//           console.error("Error initializing user:", error.message);
//           // Handle token expiration or network errors here
//           localStorage.removeItem("token"); // Clear invalid token
//           setUser(null); // Reset user state
//         }
//       }
//       setLoading(false); // Set loading to false after initialization attempt
//     };

//     initializeUser();
//   }, []);

//   const login = async (email, password) => {
//     setLoading(true); // Set loading to true when login starts
//     try {
//       const response = await axios.post("http://localhost:5000/login", {
//         email,
//         password,
//       });

//       const { token, user } = response.data;
//       localStorage.setItem("token", token);

//       // console.log("Login response token:", token);
//       // console.log("Login response user:", user);

//       setUser(user); // Assuming the backend sends user data along with token
//       // console.log("Set user state:", user);
//     } catch (error) {
//       console.error("Login error:", error.message);
//       throw new Error("Login failed");
//     } finally {
//       setLoading(false); // Set loading to false after login completes
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     // console.log("Logged out, user set to null");
//   };

//   const isAuthenticated = () => {
//     // console.log("Checking authentication, user:", user);
//     return !!user;
//   };
//   const getToken = () => {
//     const token = localStorage.getItem("token");
//     return token;
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, logout, isAuthenticated, getToken }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => {
//   const auth = useContext(AuthContext);
//   if (!auth) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return auth;
// };

// export { AuthContext, AuthProvider, useAuth };

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          // console.log("User initialized from localStorage:", parsedUserData);
        } catch (error) {
          console.error(
            "Error parsing user data from localStorage:",
            error.message
          );
          logout(); // Handle any error with user data
        }
      }

      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // console.log("Login successful. User:", userData);
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return auth;
};

export { AuthContext, AuthProvider, useAuth };
