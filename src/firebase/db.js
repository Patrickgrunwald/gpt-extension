import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addFolder = async (userId, folderData) => {
  try {
    const foldersRef = collection(db, 'folders');
    const newFolder = {
      ...folderData,
      userId,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(foldersRef, newFolder);
    return { id: docRef.id, ...newFolder };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getFolders = async (userId) => {
  try {
    const foldersRef = collection(db, 'folders');
    const q = query(foldersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateFolder = async (folderId, updates) => {
  try {
    const folderRef = doc(db, 'folders', folderId);
    await updateDoc(folderRef, updates);
    return { id: folderId, ...updates };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteFolder = async (folderId) => {
  try {
    const folderRef = doc(db, 'folders', folderId);
    await deleteDoc(folderRef);
    return folderId;
  } catch (error) {
    throw new Error(error.message);
  }
};