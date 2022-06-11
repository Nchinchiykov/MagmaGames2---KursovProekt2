import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
// Only importing what we need from the firebase util library. The base firebase import is required though

// Firebase config from dashboard
const config = {
    apiKey: "AIzaSyC76RM-r-tp7pET0RDipnSRpHEkCaVER_I",
    authDomain: "magmagames1-7d87e.firebaseapp.com",
    projectId: "magmagames1-7d87e",
    storageBucket: "magmagames1-7d87e.appspot.com",
    messagingSenderId: "108071594060",
    appId: "1:108071594060:web:30892f23fff0c63499ace9",
};

// Take the auth object that we got from auth library
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  // Check if the user exists in Firebase
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('Error creating user', error);
    }
  }

  return userRef;
};

firebase.initializeApp(config);

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();
  objectsToAdd.forEach(obj => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  await batch.commit();
  console.log('DONE');
};

// Get the snapshop and return data
export const convertCollectionSnapshotToMap = collections => {
  const transformedCollection = collections.docs.map(doc => {
    const { title, items } = doc.data();
    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    };
  });
  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

// Exporting auth and firestore
export const auth = firebase.auth();
export const firestore = firebase.firestore();

// exporting google auth util
export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;
