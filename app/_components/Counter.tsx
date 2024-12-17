"use client";

import { useState } from "react";

// const Counter = ({ users }) => {
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* <p>There are {users.length} users</p> */}
      <button onClick={() => setCount((ct) => ct + 1)}>{count}</button>
    </div>
  );
};

export default Counter;
