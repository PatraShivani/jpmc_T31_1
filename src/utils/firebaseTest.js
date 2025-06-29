import { db } from '../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Simple test to verify Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to add a test document
    const testData = {
      test: true,
      timestamp: new Date(),
      message: 'Firebase connection test'
    };
    
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('✅ Test document written with ID: ', docRef.id);
    
    // Try to read documents
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Test documents read:', querySnapshot.size);
    
    return {
      success: true,
      message: 'Firebase connection successful!',
      docId: docRef.id,
      docsCount: querySnapshot.size
    };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return {
      success: false,
      message: `Firebase connection failed: ${error.message}`,
      error: error
    };
  }
};
