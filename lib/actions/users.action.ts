'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";


 

const  getUserByEmail  =async(email:string) => {
    const {database} = await createAdminClient ();

    const result = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('email', email)]
    )

    return result.total > 0 ? result.documents[0] : null; 
}

const handleError = (error: unknown , message: string) => {
    console.error(message, error);
    throw Error;
}


const sendEmailOTP = async ({email}: {email: string}) => {
    const {account} = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email )

    return session.userId
    }
    catch (error) {
        handleError(error, 'Failed to send email OTP'); 
    }
} 

export const createAccount = async ({fullName , email} :{fullName : string , email: string}) => {
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({email});
    if (!accountId) throw new Error('failed to send email OTP');

    if(!existingUser){
        const {database} = await createAdminClient();

        await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: 'https://media.istockphoto.com/id/588258370/pt/vetorial/macho-imagem-de-perfil-de-avatar-vetor.jpg?s=612x612&w=0&k=20&c=bxV0pIETBZdArjp40TCspjoSilB9MqcCcNTA4Y8KbYo=',
                accountId,
            }
        );
    }
    return parseStringify({accountId});
}