import UserSettingsForm from "@/components/frorms/UserSettingsForm";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();
  return (
    <div className="mx-auto h-full w-full max-w-4xl px-4 lg:px-0">
      <h1 className="my-4 text-xl font-semibold">Edit profile</h1>
      <UserSettingsForm user={user.user}></UserSettingsForm>
    </div>
  );
};

export default page;
