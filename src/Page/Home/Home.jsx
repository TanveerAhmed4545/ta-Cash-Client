import { useAuth } from "../../Provider/AuthProvider";

const Home = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      <h2>Home</h2>
      {/* Render user information or handle null state */}
      {user ? (
        <p>Welcome, {user.name}</p>
      ) : (
        <p>Please login to view content.</p>
      )}
    </div>
  );
};

export default Home;
