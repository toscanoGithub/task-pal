import db from '@/firebase/firebase-config';
import { Child } from '@/types/Entity';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Alert } from 'react-native';

type AuthUser = {
    id?: string;
    email: string;
    name: string;
    isChild: boolean;
    members?: Child[]
    
};

type UserContextType = {
    email: string | undefined;
    user: AuthUser | null;
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
    updateUser: React.Dispatch<{name: string, passcode: string}>;

};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserContextProviderProps = {
    children: ReactNode;
};

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    const value: UserContextType = {
        email: user?.email,
        user,
        setUser,
        updateUser: async function  (value: {name: string, passcode: string}): Promise<void> {
            // Query the doc to edit
            const q = query(collection(db, "users"), where("email", "==", user!.email));
            const querySnapshot = await getDocs(q);
            if(querySnapshot.empty) {
            console.log("no Task registered yet")
            } else {
            querySnapshot.forEach(async (currentDoc) => {
            const docRef = doc(db, 'users', currentDoc.id); // 'users' collection, 'user123' document ID

            // Update the document
            try {
                await updateDoc(docRef, {
                    members: [...currentDoc.data().members, {...value}]
                });

                console.log('Document successfully updated!');
                
            } catch (error) {
                console.error('Error updating document: ', error);
            }
            
                
            });
            
            }

            
        }
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
};
