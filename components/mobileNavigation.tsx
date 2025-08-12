'use client';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator";

import Image from "next/image";
import { usePathname } from "next/navigation";
import  Props  from "next/script";


import { useState } from 'react';
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FileUploader from "@/components/FileUploader";
import { signOut } from "@/lib/actions/users.action";


// eslint-disable-next-line no-redeclare
interface Props {
    $id: string;
    accountId: string;
    fullname: string;
    email: string;
    avatar: string;
}

const MobileNavigation = ({ $id: ownerId , accountId ,fullname , email ,avatar} : Props) => {

    const [open , setOpen] = useState(false);
    const pathName = usePathname();

    return <header className="mobile-header">
        <Image src="/assets/icons/logo-full-brand.svg" alt="logo" width={120} height={52} className="h-auto" />
        <Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger>
    <Image src="/assets/icons/menu.svg" alt="search" width={30} height={30} />
    </SheetTrigger>
  <SheetContent className="shad-sheet h-screen bg-lime-100 px-3">
    
      <SheetTitle>
        <div className="header-user">
        <Image src={avatar} alt="avatar" width={44} height={44} className="header-user-avatar" />
        <div className="sm:hidden lg:block">
            <p className="subtitle-2 capitalize">
                {fullname}
            </p>
            <p className="caption">{email}</p>
        </div>
        </div>
        <Separator className="mb-4 bg-light-200/20" />
        </SheetTitle>
      <nav className="mobile-nav">
        <ul className="mobile-nav-list">
        {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "mobile-nav-item",
                  pathName === url && "shad-active",
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon",
                    pathName === url && "nav-icon-active",
                  )}
                />
                <p className="">{name}</p>
              </li>
            </Link>
            ))}
        </ul>
      </nav>
      <Separator className="my-5 bg-light-200/20"/>
      <div className="flex flex-col justify-between gap-5">
        <FileUploader ownerId={ownerId} accountId={accountId} />

        <button type='submit' className='mobile-sign-out-button' onClick = { async () => await signOut } > <Image src="/assets/icons/logout.svg" alt="logo" width={24} height = {24}/><p>logout</p></button>
      </div>
  </SheetContent>
</Sheet>
    </header>
};

export default MobileNavigation;
