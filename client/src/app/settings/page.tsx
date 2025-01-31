"use client";
import Header from "@/components/Header";
import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

const Settings = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  
  // Dodajemo console.log da vidimo šta imamo u user objektu
  console.log("Complete user object:", JSON.stringify(user, null, 2));

  const labelStyles = "block text-sm font-medium dark:text-white";
  const textStyles =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white";

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="space-y-4">
        <div>
          <label className={labelStyles}>Username</label>
          <div className={textStyles}>{user?.signInDetails?.loginId}</div>
        </div>
        <div>
          <label className={labelStyles}>Email</label>
          <div className={textStyles}>{user?.username}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
