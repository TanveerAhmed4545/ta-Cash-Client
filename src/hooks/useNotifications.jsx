import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useAuth } from "../Provider/AuthProvider";

const useNotifications = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ["notifications", user?.email],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(`/notifications/${user?.email}`);
        return data;
      } catch (err) {
        // Mock data for fallback
        return [
          {
            _id: "1",
            title: "Cash Received!",
            message: "You just received $500.00 from Agent John.",
            type: "cash-in",
            isRead: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
          },
          {
            _id: "2",
            title: "Security Alert",
            message: "Your PIN was successfully updated.",
            type: "security",
            isRead: true,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
          }
        ];
      }
    },
    enabled: !!user?.email,
    refetchInterval: 5000,
    refetchOnWindowFocus: true
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      await axiosSecure.patch(`/notifications/mark-read`, { email: user?.email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", user?.email]);
    }
  });

  return { 
    notifications, 
    isLoading, 
    markAllRead: markAllRead.mutate, 
    refetch 
  };
};

export default useNotifications;
