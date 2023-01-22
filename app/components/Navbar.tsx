import type { User } from "@prisma/client";
import { Link } from "@remix-run/react";
import React from "react";

type Props = {
  user: User | null;
};

export default function Navbar({ user }: Props) {
  return (
    <nav className='h-12 px-1 bg-indigo-500 text-white'>
      <ul className='flex h-full gap-2 justify-between items-center'>
        <div className='flex gap-2'>
          <li>
            <Link className='p-1' to={"/heroes"}>
              Heroes
            </Link>
          </li>
          <li>
            <Link className='p-1' to={"/builds"}>
              Builds
            </Link>
          </li>
        </div>
        {user ? (
          <div className='flex gap-2'>
            <li>
              <Link className='p-1' to={`/users/${user.username}`}>
                My Account
              </Link>
            </li>
          </div>
        ) : null}
      </ul>
    </nav>
  );
}
