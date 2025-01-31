"use client";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

const Settings = () => {
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        // Dobijamo username
        const currentUser = await getCurrentUser();
        setUsername(currentUser.username);

        // Dobijamo atribute (email)
        const attributes = await fetchUserAttributes();
        console.log("User attributes:", attributes);

        if (attributes.email) {
          setUserEmail(attributes.email);
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };

    getUserData();
  }, []);

  const labelStyles = "block text-sm font-medium dark:text-white";
  const textStyles =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white";

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="space-y-4">
        <div>
          <label className={labelStyles}>Username</label>
          <div className={textStyles}>{username}</div>
        </div>
        <div>
          <label className={labelStyles}>Email</label>
          <div className={textStyles}>{userEmail}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
