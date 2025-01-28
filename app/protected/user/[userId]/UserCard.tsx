import Link from "next/link";
import React from "react";

const UserCard = ({ user }: any) => {
  return (
    <Link href={`/protected/user/${user.id}`}>
      <div className="flex flex-row items-center gap-2 rounded bg-foreground/10 p-2">
        <div>
          <img
            src={user.image_url}
            alt=""
            width={30}
            height={30}
            className="max-h-[30px] max-w-[30px] rounded-full"
          />
        </div>
        <p>{user.username}</p>
      </div>
    </Link>
  );
};

export default UserCard;
