'use server';


// Make sure to import or define the Client class before using it
import {Account , Client , Databases , Storage , Avatars} from 'node-appwrite';

import { appwriteConfig } from './config';
import { cookies } from 'next/headers';

export const createSessionClient = async () => {
    const client = new Client();
    client
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId);
    const session = (await cookies()).get('appwrite_session');

    if(!session|| !session.value) throw new Error('no session')
        client.setSession(session.value);

    return{

        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client);
    }
}
};

export const createAdminClient = async () => {
        const client = new Client();
    client
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.secretKey);

    return{

        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        },
        get avatars() {
            return new Avatars(client);
        }, 
}
};
