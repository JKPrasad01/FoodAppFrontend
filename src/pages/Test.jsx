import axios from "axios";
import React, { useEffect, useState } from "react";
import { uniAPi } from "../api/uniAPi";

export default function Test() {
  const [user, setUser] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await uniAPi.get(`/user/all`);
      const data = response.data;
      setUser(data);
      console.log("fetch the user", data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <div className="bg-red-900  text-white flex justify-center rounded-lg m-5 font-serif font-extrabold ">
        Test
      </div>

      <div className="">
        {user.length > 0 ? (
          user.map((user, index) => (
            <div key={index} className="bg-amber-500 gap-6 ">
              <div>
                <p>{user.userId}</p>
                <img
                  src={`${user.userProfile}`}
                  className="w-[150px] h-[150px]"
                />
                <p>{user.userName}</p>
                <p>{user.userEmail}</p>
              </div>
            </div>
          ))
        ) : (
          <div> no data found</div>
        )}
      </div>
    </div>
  );
}
