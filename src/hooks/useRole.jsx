import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Provider/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role = "", isLoading } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/user-role/${user?.email}`);
      return data.role;
    },
  });

  // fetch user info using logged in user info

  return [role, isLoading];
};

export default useRole;
