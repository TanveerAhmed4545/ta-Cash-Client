import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://ta-cash-server.vercel.app" 
    : "http://localhost:5000",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
