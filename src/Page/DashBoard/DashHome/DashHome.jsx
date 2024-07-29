import { useState } from "react";
import useBalance from "../../../hooks/useBalance";

const DashHome = () => {
  const [balance, isLoading] = useBalance();
  const [showBalance, setShowBalance] = useState(false);

  const handleShowBalance = () => {
    setShowBalance(!showBalance);
  };
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Welcome to the Dashboard of Ta Cash
        </h1>
        <p className="text-center text-lg font-medium">Your personal Bank.</p>
        <button
          onClick={handleShowBalance}
          className="mt-4 px-4 py-2  bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {showBalance ? "Hide Balance" : "Show Balance"}
        </button>
        {showBalance && (
          <div className="text-center font-semibold mt-2">
            {isLoading ? (
              <p>Loading your balance...</p>
            ) : (
              <p>Your Balance: {balance}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashHome;
