import React from 'react';
import SideBar from '../../components/SideBar'
import MobileNavigation from '../../components/MobileNavigation'
import Header from '../../components/Header'
import { getCurrentUser } from '@/lib/actions/users.action';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const layout = async ({children} : {children : React.ReactNode }) => {


    const currentUser = await getCurrentUser();

    // If no user is found, redirect to sign-in page
    // This is a server-side check to ensure the user is authenticated
    if(!currentUser) {redirect("/sign-in")}





    return <>
            <main className='flex h-screen'>
                <SideBar {...currentUser}/>

                <section className='flex h-full flex-1 flex-col '>
                    <MobileNavigation {...currentUser} />
                    <Header userId={currentUser.$id} accountId={currentUser.$accountId} />

                    <div className='main-content'>{children}</div>
                </section>
            </main>
            </>
};

export default layout;