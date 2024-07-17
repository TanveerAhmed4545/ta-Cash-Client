import useStatus from "../../hooks/useStatus";
import { useAuth } from "../../Provider/AuthProvider";

const Home = () => {
  const { user } = useAuth();
  const [status, isLoading] = useStatus();
  // console.log(status);
  if (isLoading) return <div>Loading .....</div>;
  return (
    <div>
      {status === "approved" ? <h2>Home</h2> : <h2>No Home</h2>}
      <h2>Home</h2>
      {user ? (
        <p>Welcome, {user.name}</p>
      ) : (
        <p>Please login to view content.</p>
      )}
    </div>
  );
};

export default Home;
