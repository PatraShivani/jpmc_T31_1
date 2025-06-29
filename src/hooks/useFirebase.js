import { useState, useEffect } from 'react';
import { 
  studentsService, 
  familiesService, 
  womenService, 
  volunteersService,
  attendanceService 
} from '../firebase/services';

// Custom hook for Students
export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = studentsService.listen((data) => {
      setStudents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addStudent = async (studentData) => {
    try {
      setLoading(true);
      await studentsService.add(studentData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateStudent = async (id, updateData) => {
    try {
      setLoading(true);
      await studentsService.update(id, updateData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      setLoading(true);
      await studentsService.delete(id);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent
  };
};

// Custom hook for Families
export const useFamilies = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = familiesService.listen((data) => {
      setFamilies(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addFamily = async (familyData) => {
    try {
      setLoading(true);
      await familiesService.add(familyData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateFamily = async (id, updateData) => {
    try {
      setLoading(true);
      await familiesService.update(id, updateData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteFamily = async (id) => {
    try {
      setLoading(true);
      await familiesService.delete(id);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    families,
    loading,
    error,
    addFamily,
    updateFamily,
    deleteFamily
  };
};

// Custom hook for Women
export const useWomen = () => {
  const [women, setWomen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = womenService.listen((data) => {
      setWomen(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addWoman = async (womanData) => {
    try {
      setLoading(true);
      await womenService.add(womanData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateWoman = async (id, updateData) => {
    try {
      setLoading(true);
      await womenService.update(id, updateData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    women,
    loading,
    error,
    addWoman,
    updateWoman
  };
};

// Custom hook for Volunteers
export const useVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = volunteersService.listen((data) => {
      setVolunteers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addVolunteer = async (volunteerData) => {
    try {
      setLoading(true);
      await volunteersService.add(volunteerData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateVolunteer = async (id, updateData) => {
    try {
      setLoading(true);
      await volunteersService.update(id, updateData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    volunteers,
    loading,
    error,
    addVolunteer,
    updateVolunteer
  };
};

// Custom hook for Attendance
export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addAttendance = async (attendanceData) => {
    try {
      setLoading(true);
      await attendanceService.add(attendanceData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getStudentAttendance = async (studentId) => {
    try {
      setLoading(true);
      const attendance = await attendanceService.getByStudent(studentId);
      setLoading(false);
      return attendance;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return [];
    }
  };

  return {
    loading,
    error,
    addAttendance,
    getStudentAttendance
  };
};
