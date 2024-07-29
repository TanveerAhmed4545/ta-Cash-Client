import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Provider/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useBalance = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: balance = "", isLoading } = useQuery({
    queryKey: ["balance", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/user-balance/${user?.email}`);
      return data.balance;
    },
  });

  // fetch user info using logged in user info

  return [balance, isLoading];
};

export default useBalance;
