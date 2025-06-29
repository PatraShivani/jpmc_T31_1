import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './config';

// Collections
const COLLECTIONS = {
  STUDENTS: 'students',
  FAMILIES: 'families',
  WOMEN: 'women',
  VOLUNTEERS: 'volunteers',
  ATTENDANCE: 'attendance'
};

// Students Services
export const studentsService = {
  // Get all students
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.STUDENTS));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  },

  // Add new student
  add: async (studentData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.STUDENTS), {
        ...studentData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...studentData };
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  // Update student
  update: async (id, updateData) => {
    try {
      const studentRef = doc(db, COLLECTIONS.STUDENTS, id);
      await updateDoc(studentRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  // Delete student
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.STUDENTS, id));
      return id;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  // Listen to real-time updates
  listen: (callback) => {
    return onSnapshot(collection(db, COLLECTIONS.STUDENTS), (snapshot) => {
      const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(students);
    });
  }
};

// Families Services
export const familiesService = {
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FAMILIES));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching families:', error);
      return [];
    }
  },

  add: async (familyData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.FAMILIES), {
        ...familyData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...familyData };
    } catch (error) {
      console.error('Error adding family:', error);
      throw error;
    }
  },

  update: async (id, updateData) => {
    try {
      const familyRef = doc(db, COLLECTIONS.FAMILIES, id);
      await updateDoc(familyRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating family:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.FAMILIES, id));
      return id;
    } catch (error) {
      console.error('Error deleting family:', error);
      throw error;
    }
  },

  listen: (callback) => {
    return onSnapshot(collection(db, COLLECTIONS.FAMILIES), (snapshot) => {
      const families = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(families);
    });
  }
};

// Women Services
export const womenService = {
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.WOMEN));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching women:', error);
      return [];
    }
  },

  add: async (womanData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.WOMEN), {
        ...womanData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...womanData };
    } catch (error) {
      console.error('Error adding woman:', error);
      throw error;
    }
  },

  update: async (id, updateData) => {
    try {
      const womanRef = doc(db, COLLECTIONS.WOMEN, id);
      await updateDoc(womanRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating woman:', error);
      throw error;
    }
  },

  listen: (callback) => {
    return onSnapshot(collection(db, COLLECTIONS.WOMEN), (snapshot) => {
      const women = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(women);
    });
  }
};

// Volunteers Services
export const volunteersService = {
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.VOLUNTEERS));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      return [];
    }
  },

  add: async (volunteerData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.VOLUNTEERS), {
        ...volunteerData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...volunteerData };
    } catch (error) {
      console.error('Error adding volunteer:', error);
      throw error;
    }
  },

  update: async (id, updateData) => {
    try {
      const volunteerRef = doc(db, COLLECTIONS.VOLUNTEERS, id);
      await updateDoc(volunteerRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating volunteer:', error);
      throw error;
    }
  },

  listen: (callback) => {
    return onSnapshot(collection(db, COLLECTIONS.VOLUNTEERS), (snapshot) => {
      const volunteers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(volunteers);
    });
  }
};

// Attendance Services
export const attendanceService = {
  add: async (attendanceData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ATTENDANCE), {
        ...attendanceData,
        createdAt: new Date()
      });
      return { id: docRef.id, ...attendanceData };
    } catch (error) {
      console.error('Error adding attendance:', error);
      throw error;
    }
  },

  getByStudent: async (studentId) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.ATTENDANCE), 
        where('studentId', '==', studentId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  }
};

// Data Migration Helper
export const migrateLocalStorageToFirebase = async () => {
  try {
    console.log('Starting migration from localStorage to Firebase...');

    // Migrate Students
    const studentsData = localStorage.getItem('kalams_students_data');
    if (studentsData) {
      const students = JSON.parse(studentsData);
      for (const student of students) {
        await studentsService.add(student);
      }
      console.log(`Migrated ${students.length} students`);
    }

    // Migrate Families
    const familiesData = localStorage.getItem('kalams_families_data');
    if (familiesData) {
      const families = JSON.parse(familiesData);
      for (const family of families) {
        await familiesService.add(family);
      }
      console.log(`Migrated ${families.length} families`);
    }

    // Migrate Women
    const womenData = localStorage.getItem('kalams_women_data');
    if (womenData) {
      const women = JSON.parse(womenData);
      for (const woman of women) {
        await womenService.add(woman);
      }
      console.log(`Migrated ${women.length} women`);
    }

    // Migrate Volunteers
    const volunteersData = localStorage.getItem('kalams_volunteers');
    if (volunteersData) {
      const volunteers = JSON.parse(volunteersData);
      for (const volunteer of volunteers) {
        await volunteersService.add(volunteer);
      }
      console.log(`Migrated ${volunteers.length} volunteers`);
    }

    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};
