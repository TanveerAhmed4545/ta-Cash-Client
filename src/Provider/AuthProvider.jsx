/* eslint-disable react-refresh/only-export-components */
// import axios from "axios";
// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);

// // eslint-disable-next-line react/prop-types
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

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
//         }
//       }
//     };

//     initializeUser();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post("http://localhost:5000/login", {
//         email,
//         password,
//       });

//       const { token, user } = response.data;
//       localStorage.setItem("token", token);

//       console.log("Login response token:", token);
//       console.log("Login response user:", user);

//       setUser(user); // Assuming the backend sends user data along with token
//       console.log("Set user state:", user);
//     } catch (error) {
//       console.error("Login error:", error.message);
//       throw new Error("Login failed");
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     console.log("Logged out, user set to null");
//   };

//   const isAuthenticated = () => {
//     console.log("Checking authentication, user:", user);
//     return !!user;
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userResponse = await axios.get("http://localhost:5000/Users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(userResponse.data);
          console.log("User initialized from token:", userResponse.data);
        } catch (error) {
          console.error("Error initializing user:", error.message);
        }
      }
      setLoading(false); // Set loading to false after initialization
    };

    initializeUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true); // Set loading to true when login starts
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);

      console.log("Login response token:", token);
      console.log("Login response user:", user);

      setUser(user); // Assuming the backend sends user data along with token
      console.log("Set user state:", user);
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error("Login failed");
    } finally {
      setLoading(false); // Set loading to false after login completes
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("Logged out, user set to null");
  };

  const isAuthenticated = () => {
    console.log("Checking authentication, user:", user);
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated }}
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
