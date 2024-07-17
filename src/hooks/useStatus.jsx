import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Provider/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useStatus = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: status = "", isLoading } = useQuery({
    queryKey: ["status", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/user-status/${user?.email}`);
      return data.status;
    },
  });

  // fetch user info using logged in user info

  return [status, isLoading];
};

export default useStatus;
