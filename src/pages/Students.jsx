import React, { useState, useEffect } from 'react';
import { Calendar, Plus, BookOpen, TrendingUp, Users, Filter, Trash2 } from 'lucide-react';
import { useStudents } from '../hooks/useFirebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { mockStudents, centers } from '../data/mockData';

// Helper function to calculate student's correct average
const calculateStudentAverage = (student) => {
  if (!student.subjectMarks || Object.keys(student.subjectMarks).length === 0) {
    return student.lastTestScore || 0;
  }

  const subjects = Object.keys(student.subjectMarks);
  const totalAverage = subjects.reduce((sum, subject) => {
    const scores = student.subjectMarks[subject];
    if (scores && scores.length > 0) {
      const subjectAvg = scores.reduce((s, score) => s + score.percentage, 0) / scores.length;
      return sum + subjectAvg;
    }
    return sum;
  }, 0);

  return subjects.length > 0 ? Math.round(totalAverage / subjects.length) : (student.lastTestScore || 0);
};

const Students = () => {
  const { user } = useAuth();
  // Use Firebase hook for students data
  const { students, loading: studentsLoading, error: studentsError, addStudent: addStudentToFirebase, updateStudent: updateStudentInFirebase, deleteStudent: deleteStudentFromFirebase } = useStudents();
  const [selectedCenter, setSelectedCenter] = useState('All Centers');
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isTestScoreModalOpen, setIsTestScoreModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    status: 'present'
  });
  const [testScoreData, setTestScoreData] = useState({
    subject: '',
    score: '',
    maxScore: '100'
  });
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    age: '',
    center: '',
    subjects: [],
    familyId: '',
    contact: ''
  });

  // Save students data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kalams_students_data', JSON.stringify(students));
  }, [students]);

  const filteredStudents = selectedCenter === 'All Centers'
    ? students
    : students.filter(student => student.center === selectedCenter);

  // Function to reset attendance data (for testing/development)
  const resetAttendanceData = () => {
    localStorage.removeItem('kalams_students_data');
    window.location.reload();
  };

  // Function to handle adding a new student
  const handleAddStudent = async (e) => {
    e.preventDefault();

    const newStudent = {
      name: newStudentData.name,
      age: parseInt(newStudentData.age),
      center: newStudentData.center,
      subjects: newStudentData.subjects,
      familyId: parseInt(newStudentData.familyId) || null,
      contact: newStudentData.contact,
      attendance: 100, // Start with 100% attendance
      lastTestScore: 0,
      enrollmentDate: new Date().toISOString().split('T')[0],
      subjectAttendance: newStudentData.subjects.reduce((acc, subject) => {
        acc[subject] = {
          totalClasses: 0,
          attendedClasses: 0,
          percentage: 100
        };
        return acc;
      }, {}),
      attendanceHistory: []
    };

    try {
      await addStudentToFirebase(newStudent);
      setNewStudentData({
        name: '',
        age: '',
        center: '',
        subjects: [],
        familyId: '',
        contact: ''
      });
      setIsAddStudentModalOpen(false);

      // Show success message
      alert(`✅ Student added successfully to Firebase!\n\nName: ${newStudentData.name}\nCenter: ${newStudentData.center}\nSubjects: ${newStudentData.subjects.join(', ')}`);
    } catch (error) {
      alert(`❌ Error adding student: ${error.message}`);
    }
  };

  // Delete student function (admin only)
  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
      try {
        await deleteStudentFromFirebase(student.id);
        alert(`✅ Student ${student.name} deleted successfully from Firebase!`);
      } catch (error) {
        alert(`❌ Error deleting student: ${error.message}`);
      }
    }
  };

  const getPerformanceBadge = (student) => {
    if (student.attendance >= 90 && student.lastTestScore >= 85) {
      return { variant: 'success', text: 'Excellent' };
    } else if (student.attendance >= 75 && student.lastTestScore >= 70) {
      return { variant: 'primary', text: 'Good' };
    } else if (student.attendance >= 60 || student.lastTestScore >= 50) {
      return { variant: 'warning', text: 'Needs Attention' };
    } else {
      return { variant: 'danger', text: 'At Risk' };
    }
  };

  const handleTakeAttendance = (student) => {
    setSelectedStudent(student);
    setAttendanceData({
      date: new Date().toISOString().split('T')[0],
      subject: '',
      status: 'present'
    });
    setIsAttendanceModalOpen(true);
  };

  const handleAddTestScore = (student) => {
    setSelectedStudent(student);
    setIsTestScoreModalOpen(true);
  };

  const submitAttendance = async (e) => {
    e.preventDefault();

    try {
      const student = selectedStudent;
      const updatedSubjectAttendance = { ...student.subjectAttendance };
      const subject = attendanceData.subject;

      // Update subject-specific attendance
      if (updatedSubjectAttendance[subject]) {
        const currentData = updatedSubjectAttendance[subject];
        const newTotalClasses = currentData.totalClasses + 1;
        const newAttendedClasses = attendanceData.status === 'present'
          ? currentData.attendedClasses + 1
          : currentData.attendedClasses;
        const newPercentage = Math.round((newAttendedClasses / newTotalClasses) * 100);

        updatedSubjectAttendance[subject] = {
          totalClasses: newTotalClasses,
          attendedClasses: newAttendedClasses,
          percentage: newPercentage
        };
      }

      // Calculate overall attendance percentage
      const subjects = Object.keys(updatedSubjectAttendance);
      const totalPercentage = subjects.reduce((sum, subj) =>
        sum + updatedSubjectAttendance[subj].percentage, 0);
      const overallAttendance = Math.round(totalPercentage / subjects.length);

      // Add to attendance history
      const newAttendanceRecord = {
        date: attendanceData.date,
        subject: attendanceData.subject,
        status: attendanceData.status,
        timestamp: new Date().toISOString()
      };

      // Update student in Firebase
      const updatedStudent = {
        ...student,
        attendance: overallAttendance,
        subjectAttendance: updatedSubjectAttendance,
        attendanceHistory: [...student.attendanceHistory, newAttendanceRecord]
      };

      await updateStudentInFirebase(student.id, updatedStudent);

      setIsAttendanceModalOpen(false);
      setAttendanceData({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        status: 'present'
      });

      // Show success message
      alert(`✅ Attendance recorded successfully in Firebase!\n\nStudent: ${selectedStudent.name}\nSubject: ${attendanceData.subject}\nDate: ${attendanceData.date}\nStatus: ${attendanceData.status.toUpperCase()}`);

    } catch (error) {
      alert(`❌ Error recording attendance: ${error.message}`);
    }
  };

  const submitTestScore = async (e) => {
    e.preventDefault();

    try {
      // Update student's last test score in Firebase
      const updatedData = {
        lastTestScore: parseInt(testScoreData.score)
      };

      await updateStudentInFirebase(selectedStudent.id, updatedData);

      setIsTestScoreModalOpen(false);
      setTestScoreData({ subject: '', score: '', maxScore: '100' });

      alert(`✅ Test score updated successfully in Firebase!\n\nStudent: ${selectedStudent.name}\nSubject: ${testScoreData.subject}\nScore: ${testScoreData.score}/${testScoreData.maxScore}`);
    } catch (error) {
      alert(`❌ Error updating test score: ${error.message}`);
    }
  };

  // Show loading state
  if (studentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kalams-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students from Firebase...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (studentsError) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading students: {studentsError}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Track student progress, attendance, and performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAttendanceData}
            className="text-xs"
          >
            Reset Data
          </Button>
          <Button
            onClick={() => setIsAddStudentModalOpen(true)}
            variant="kalam"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / students.length) : 0}%
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Test Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + calculateStudentAverage(s), 0) / students.length) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="w-full sm:w-auto"
            >
              {centers.map(center => (
                <option key={center} value={center}>{center}</option>
              ))}
            </Select>
            <div className="text-sm text-gray-600">
              Showing {filteredStudents.length} students
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          const badge = getPerformanceBadge(student);
          return (
            <Card key={student.id} className="hover:shadow-neumorphic-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{student.name}</span>
                  <Badge variant={badge.variant}>{badge.text}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Student Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Education:</span>
                      <span className="font-medium">{student.education}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Center:</span>
                      <span className="font-medium">{student.center}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Family:</span>
                      <span className="font-medium">{student.family}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tutor:</span>
                      <span className="font-medium text-blue-600">{student.tutorEmail || student.tutor || 'Not assigned'}</span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="neumorphic-card p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                    <div className="space-y-3">
                      {/* Overall Attendance */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Overall Attendance</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${student.attendance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{student.attendance}%</span>
                        </div>
                      </div>

                      {/* Subject-wise Attendance */}
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 font-medium">Subject Attendance:</span>
                        {student.subjectAttendance && Object.entries(student.subjectAttendance).map(([subject, data]) => (
                          <div key={subject} className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{subject}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-green-500 h-1.5 rounded-full"
                                  style={{ width: `${data.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium w-8">{data.percentage}%</span>
                              <span className="text-xs text-gray-400">({data.attendedClasses}/{data.totalClasses})</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between text-sm pt-1 border-t border-gray-200">
                        <span className="text-gray-600">Last Test Score:</span>
                        <span className="font-medium">{student.lastTestScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleTakeAttendance(student)}
                      className="flex-1"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Attendance
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAddTestScore(student)}
                      className="flex-1"
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Test Score
                    </Button>
                    {user?.role === 'admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteStudent(student)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Attendance Modal */}
      <Modal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        title={`Take Attendance - ${selectedStudent?.name}`}
      >
        <form onSubmit={submitAttendance} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={attendanceData.date}
              onChange={(e) => setAttendanceData({...attendanceData, date: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <Select
              value={attendanceData.subject}
              onChange={(e) => setAttendanceData({...attendanceData, subject: e.target.value})}
              required
            >
              <option value="">Select Subject</option>
              {selectedStudent?.subjects?.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={attendanceData.status}
              onChange={(e) => setAttendanceData({...attendanceData, status: e.target.value})}
              required
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </Select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Record Attendance
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAttendanceModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Test Score Modal */}
      <Modal
        isOpen={isTestScoreModalOpen}
        onClose={() => setIsTestScoreModalOpen(false)}
        title={`Add Test Score - ${selectedStudent?.name}`}
      >
        <form onSubmit={submitTestScore} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <Select
              value={testScoreData.subject}
              onChange={(e) => setTestScoreData({...testScoreData, subject: e.target.value})}
              required
            >
              <option value="">Select subject</option>
              <option value="Math">Math</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score
            </label>
            <Input
              type="number"
              min="0"
              max={testScoreData.maxScore}
              value={testScoreData.score}
              onChange={(e) => setTestScoreData({...testScoreData, score: e.target.value})}
              placeholder="Enter score"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Score
            </label>
            <Input
              type="number"
              value={testScoreData.maxScore}
              onChange={(e) => setTestScoreData({...testScoreData, maxScore: e.target.value})}
              placeholder="Enter maximum score"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Add Score
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsTestScoreModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        title="Add New Student"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name *
              </label>
              <Input
                type="text"
                value={newStudentData.name}
                onChange={(e) => setNewStudentData({...newStudentData, name: e.target.value})}
                placeholder="Enter student name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <Input
                type="number"
                value={newStudentData.age}
                onChange={(e) => setNewStudentData({...newStudentData, age: e.target.value})}
                placeholder="Enter age"
                min="5"
                max="25"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Center *
            </label>
            <Select
              value={newStudentData.center}
              onChange={(e) => setNewStudentData({...newStudentData, center: e.target.value})}
              required
            >
              <option value="">Select Center</option>
              <option value="Mehdipatnam Center">Mehdipatnam Center</option>
              <option value="Santosh Nagar Center">Santosh Nagar Center</option>
              <option value="Charminar Center">Charminar Center</option>
              <option value="Secunderabad Center">Secunderabad Center</option>
              <option value="Kukatpally Center">Kukatpally Center</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['English', 'Math', 'Science', 'Hindi', 'Computer', 'Art'].map((subject) => (
                <label key={subject} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newStudentData.subjects.includes(subject)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewStudentData({
                          ...newStudentData,
                          subjects: [...newStudentData.subjects, subject]
                        });
                      } else {
                        setNewStudentData({
                          ...newStudentData,
                          subjects: newStudentData.subjects.filter(s => s !== subject)
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Family ID (Optional)
              </label>
              <Input
                type="number"
                value={newStudentData.familyId}
                onChange={(e) => setNewStudentData({...newStudentData, familyId: e.target.value})}
                placeholder="Enter family ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <Input
                type="tel"
                value={newStudentData.contact}
                onChange={(e) => setNewStudentData({...newStudentData, contact: e.target.value})}
                placeholder="Enter contact number"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Add Student
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddStudentModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
