import React from "react";
import { useUser } from "../Context/UserContext";

const TestComponent = () => {
  const { user, membership, fetchUserAndMembership } = useUser();

  return (
    <div style={{ padding: "20px", border: "1px solid black" }}>
      <h2>Test Context API</h2>
      {user ? (
        <>
          <p><strong>User Name:</strong> {user.displayName}</p>
          <p><strong>User ID:</strong> {user.uid}</p>
          <p>
            <strong>Membership:</strong>{" "}
            {membership ? membership.plan : "No membership found"}
          </p>
          <button onClick={fetchUserAndMembership}>Refresh Data</button>
        </>
      ) : (
        <p>No user found. Please log in.</p>
      )}
    </div>
  );
};

export default TestComponent;
