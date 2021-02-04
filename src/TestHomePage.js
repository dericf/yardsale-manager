import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

const TestHomePage = () => {
  // const msg = useContext(AuthContext);
  const { auth, setAuth } = useContext(AuthContext);
  // console.log(auth);
  const [valueField, setValueField] = useState(auth);
  return (
    <div>
      {/* <h2>Home</h2> */}
      <p>{JSON.stringify(auth)}</p>
      {/* <input
        type="text"
        name="value"
        value={valueField}
        onChange={(e) => {
          setValueField(e.target.value);
        }}
      />
      <button onClick={() => setAuth(valueField)}>Update</button> */}
    </div>
  );
};

export default TestHomePage;
