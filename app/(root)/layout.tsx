import React from 'react';
import SideBar from '@/components/SideBar';
import MobileNavigation from '@/components/MobileNavigation';
import Header from '@/components/header';
import { getCurrentUser } from '@/lib/actions/users.action';
import { redirect } from 'next/navigation';

const layout = async ({children} : {children : React.ReactNode }) => {


    const currentUser = await getCurrentUser();
    if(!currentUser) {redirect("/sign-in")}





    return <html lang='en'>
        <body>
    <main className='flex h-screen '>
        <SideBar {...currentUser}/>

        <section className='flex h-full flex-1 flex-col '>
            <MobileNavigation {...currentUser} />
            <Header />
            <div className='main-content'>{children}</div>
        </section>
    </main>
    </body>
    </html>
};

export default layout;