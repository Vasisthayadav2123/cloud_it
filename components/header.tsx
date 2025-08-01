import React from 'react';
import Image from 'next/image';
import Search from './Search';
import FileUpLoader from './FileUploader';
import { signOut } from '@/lib/actions/users.action';




const Header = () => {
    return <header className='header'>
        <Search />

        <div className='header-wrapper'>
            <FileUpLoader ownerId={''} accountId={''} />

            <form action={async () => {
                'use server';
                await signOut();
            }}>
                <button type='submit' className='sign-out-button'> <Image src="/assets/icons/logout.svg" alt="logo" width={24} height = {24} className="w-6" /></button>
            </form>
        </div>
        </header>
};

export default Header;
