'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";


 

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


export const sendEmailOTP = async ({email}: {email: string}) => {
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
                avatar: avatarPlaceholderUrl,
                accountId,
            }
        );
    }
    return parseStringify({accountId});
}

export const verifySecret = async ({accountId , password } : {accountId: string , password: string}) => {
    try{
        const {account} = await createAdminClient();
        const session = await account.createSession(accountId, password);

        ( (await cookies()).set('appwrite_session', session.secret,{
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure : true,
            }))

            return parseStringify({sessionId: session.$id});    
    }catch (error) {
        handleError(error, 'Failed to verify OTP');
    }
};


export const getCurrentUser = async () => {


    const {database , account} = await createSessionClient();

    const result = await account.get();

    const user = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('accountId', result.$id)]
    );

    if(user.total <= 0 ) return null;

    return parseStringify({
        ...user.documents[0],
    });
}

export async function signOut() {
     "use server";

     const { account } = await createSessionClient();

     (await cookies()).delete("my-custom-session");
     await account.deleteSession("current");

     redirect("/sign-up");
   }

   export default async function HomePage() {
     const user = await getCurrentUser();
     if (!user) redirect("/sign-up");
   }

// Removed unused getLoggedInUser function

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    // User exists, send OTP
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};
