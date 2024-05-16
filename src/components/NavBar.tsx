"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 w-full">
      <div className="flex w-full items-center justify-end gap-3 px-4 py-5">
        <Link
          className="rounded-md border-2 border-neutral-900 px-3 py-1 transition-colors duration-300 hover:bg-neutral-900 hover:text-neutral-100"
          href="/"
          style={{
            backgroundColor: pathname === "/" ? "#000" : undefined,
            color: pathname === "/" ? "#fff" : undefined,
          }}
        >
          Home
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
