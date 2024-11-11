"use server";

import { parseStringify } from '@/lib/utils';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};


const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
  };


const sendEmailOTP = async ({email} : {email:string}) => {
    const {account} = await createAdminClient()

    try{
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    }catch(error){
        handleError(error, "Failed to send email OTP");
    }
}

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const exisitingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP({email});
  if (!accountId) throw new Error("Failed to send an OTP");
  if (!exisitingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: "https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg",
        accountId,
      },
    );
  }

  return parseStringify({ accountId });
};
