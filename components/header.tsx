import React from 'react';
import Image from 'next/image';
import Search from './search';
import FileUpLoader from './fileUploader';



const Header = () => {
    return <header className='header'>
        <Search />

        <div className='header-wrapper'>
            <FileUpLoader />

            <form>
                <button type='submit' className='sign-out-button'> <Image src="/assets/icons/logout.svg" alt="logo" width={24} height = {24} className="w-6" /></button>
            </form>
        </div>
        </header>
};

export default Header;
