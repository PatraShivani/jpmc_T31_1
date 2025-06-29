import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useStudents, useFamilies, useWomen } from '../hooks/useFirebase';
import { Users, GraduationCap, Heart, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import FirebaseTest from '../components/FirebaseTest';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { students, loading, updateStudent } = useStudents();
  const { families } = useFamilies();
  const { women } = useWomen();

  // Filter students by tutor email (for tutors) or show all (for admins)
  const filteredStudents = user?.role === 'tutor'
    ? students.filter(student => {
        // Check if student is assigned to current tutor by email
        const isAssignedToTutor = student.tutorEmail === user.email ||
                                 student.tutor === user.email ||
                                 student.tutorEmail === 'tutor@kalams.org' ||
                                 student.tutor === 'tutor@kalams.org';
        return isAssignedToTutor;
      })
    : students;

  console.log('Current user:', user);
  console.log('User email:', user?.email);
  console.log('All students:', students);
  console.log('Filtered students for tutor:', filteredStudents);
  console.log('Students with tutor assignments:', students.map(s => ({ name: s.name, tutorEmail: s.tutorEmail, tutor: s.tutor })));

  // Attendance modal state
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('English');

  // Marks modal state
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [marksData, setMarksData] = useState({});
  const [selectedMarksSubject, setSelectedMarksSubject] = useState('English');
  const [maxMarks, setMaxMarks] = useState(100);

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleAddFamily = () => {
    navigate('/families');
    // You can also add a URL parameter to auto-open the modal
    // navigate('/families?action=add');
  };

  const handleTakeAttendance = () => {
    navigate('/students');
    // You can add a parameter to auto-open attendance modal
    // navigate('/students?action=attendance');
  };

  const handleUpdateSkills = () => {
    navigate('/women');
  };

  const handleAddStudent = () => {
    navigate('/students');
    // You can add a parameter to auto-open add student modal
    // navigate('/students?action=add');
  };

  // Handle record attendance
  const handleRecordAttendance = () => {
    if (filteredStudents.length === 0) {
      alert('No students assigned to you. Please contact admin to assign students.');
      return;
    }
    // Initialize attendance data for assigned students
    const initialAttendance = {};
    filteredStudents.forEach(student => {
      initialAttendance[student.id] = 'present'; // Default to present
    });
    setAttendanceData(initialAttendance);
    setIsAttendanceModalOpen(true);
  };

  // Handle attendance change for a student
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Submit attendance for all students
  const submitBulkAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let updatedCount = 0;

      for (const student of filteredStudents) {
        const status = attendanceData[student.id] || 'present';
        const updatedSubjectAttendance = { ...student.subjectAttendance };

        // Update subject-specific attendance
        if (updatedSubjectAttendance[selectedSubject]) {
          const currentData = updatedSubjectAttendance[selectedSubject];
          const newTotalClasses = currentData.totalClasses + 1;
          const newAttendedClasses = status === 'present'
            ? currentData.attendedClasses + 1
            : currentData.attendedClasses;
          const newPercentage = Math.round((newAttendedClasses / newTotalClasses) * 100);

          updatedSubjectAttendance[selectedSubject] = {
            totalClasses: newTotalClasses,
            attendedClasses: newAttendedClasses,
            percentage: newPercentage
          };
        } else {
          // Create new subject attendance if it doesn't exist
          updatedSubjectAttendance[selectedSubject] = {
            totalClasses: 1,
            attendedClasses: status === 'present' ? 1 : 0,
            percentage: status === 'present' ? 100 : 0
          };
        }

        // Calculate overall attendance percentage
        const subjects = Object.keys(updatedSubjectAttendance);
        const totalPercentage = subjects.reduce((sum, subj) =>
          sum + updatedSubjectAttendance[subj].percentage, 0);
        const overallAttendance = Math.round(totalPercentage / subjects.length);

        // Add to attendance history
        const newAttendanceRecord = {
          date: today,
          subject: selectedSubject,
          status: status,
          timestamp: new Date().toISOString()
        };

        // Update student in Firebase
        const updatedStudent = {
          ...student,
          attendance: overallAttendance,
          subjectAttendance: updatedSubjectAttendance,
          attendanceHistory: [...(student.attendanceHistory || []), newAttendanceRecord]
        };

        await updateStudent(student.id, updatedStudent);
        updatedCount++;
      }

      setIsAttendanceModalOpen(false);
      alert(`✅ Attendance recorded successfully for ${updatedCount} students!\n\nSubject: ${selectedSubject}\nDate: ${today}`);
    } catch (error) {
      alert(`❌ Error recording attendance: ${error.message}`);
    }
  };

  // Handle record marks
  const handleRecordMarks = () => {
    if (filteredStudents.length === 0) {
      alert('No students assigned to you. Please contact admin to assign students.');
      return;
    }
    // Initialize marks data for assigned students
    const initialMarks = {};
    filteredStudents.forEach(student => {
      initialMarks[student.id] = ''; // Empty by default
    });
    setMarksData(initialMarks);
    setIsMarksModalOpen(true);
  };

  // Handle marks change for a student
  const handleMarksChange = (studentId, marks) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: marks
    }));
  };

  // Submit marks for all students
  const submitBulkMarks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let updatedCount = 0;

      for (const student of filteredStudents) {
        const marks = marksData[student.id];
        if (marks === '' || marks === undefined) continue; // Skip empty marks

        const marksValue = parseInt(marks);
        if (isNaN(marksValue) || marksValue < 0 || marksValue > maxMarks) {
          alert(`❌ Invalid marks for ${student.name}. Please enter a number between 0 and ${maxMarks}.`);
          return;
        }

        // Initialize or update subject marks
        const updatedSubjectMarks = { ...student.subjectMarks } || {};
        if (!updatedSubjectMarks[selectedMarksSubject]) {
          updatedSubjectMarks[selectedMarksSubject] = [];
        }

        // Add new test score
        const newTestScore = {
          date: today,
          marks: marksValue,
          maxMarks: maxMarks,
          percentage: Math.round((marksValue / maxMarks) * 100),
          timestamp: new Date().toISOString()
        };

        updatedSubjectMarks[selectedMarksSubject].push(newTestScore);

        // Calculate average marks for the subject
        const subjectScores = updatedSubjectMarks[selectedMarksSubject];
        const subjectAverage = Math.round(
          subjectScores.reduce((sum, score) => sum + score.percentage, 0) / subjectScores.length
        );

        // Calculate overall average across all subjects
        const allSubjects = Object.keys(updatedSubjectMarks);
        const overallAverage = allSubjects.length > 0 ? Math.round(
          allSubjects.reduce((sum, subject) => {
            const scores = updatedSubjectMarks[subject];
            if (scores && scores.length > 0) {
              const subjectAvg = scores.reduce((s, score) => s + score.percentage, 0) / scores.length;
              return sum + subjectAvg;
            }
            return sum;
          }, 0) / allSubjects.length
        ) : subjectAverage;

        // Update student in Firebase
        const updatedStudent = {
          ...student,
          subjectMarks: updatedSubjectMarks,
          lastTestScore: marksValue,
          averageMarks: overallAverage,
          [`${selectedMarksSubject}Average`]: subjectAverage
        };

        await updateStudent(student.id, updatedStudent);
        updatedCount++;
      }

      setIsMarksModalOpen(false);
      alert(`✅ Marks recorded successfully for ${updatedCount} students!\n\nSubject: ${selectedMarksSubject}\nMax Marks: ${maxMarks}\nDate: ${today}`);
    } catch (error) {
      alert(`❌ Error recording marks: ${error.message}`);
    }
  };

  // Handle view students data
  const handleViewStudents = () => {
    setIsViewModalOpen(true);
  };

  // Calculate real statistics from data
  const calculatedStats = useMemo(() => {
    if (loading) return null;

    // Calculate average attendance
    const totalAttendance = students.reduce((sum, student) => sum + (student.attendance || 0), 0);
    const avgAttendance = students.length > 0 ? Math.round(totalAttendance / students.length) : 0;

    // Calculate average marks correctly
    const studentsWithMarks = students.filter(student => student.subjectMarks && Object.keys(student.subjectMarks).length > 0);
    let totalAverage = 0;
    let validStudents = 0;

    studentsWithMarks.forEach(student => {
      const subjects = Object.keys(student.subjectMarks);
      if (subjects.length > 0) {
        const studentAverage = subjects.reduce((sum, subject) => {
          const scores = student.subjectMarks[subject];
          if (scores && scores.length > 0) {
            const subjectAvg = scores.reduce((s, score) => s + score.percentage, 0) / scores.length;
            return sum + subjectAvg;
          }
          return sum;
        }, 0) / subjects.length;

        totalAverage += studentAverage;
        validStudents++;
      }
    });

    const avgMarks = validStudents > 0 ? Math.round(totalAverage / validStudents) : 0;

    // Calculate women empowerment stats
    const womenCompleted = women.filter(woman => woman.trainingStatus === 'completed').length;
    const womenCompletionRate = women.length > 0 ? Math.round((womenCompleted / women.length) * 100) : 0;

    return {
      totalFamilies: families.length,
      activeStudents: students.length,
      womenEmpowered: women.length,
      avgAttendance,
      avgMarks,
      womenCompletionRate
    };
  }, [students, families, women, loading]);

  // Function to calculate individual student's correct average
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

  const stats = calculatedStats ? [
    {
      title: 'Total Families',
      value: calculatedStats.totalFamilies.toString(),
      icon: Users,
      change: calculatedStats.totalFamilies > 0 ? '+' + calculatedStats.totalFamilies : '0',
      changeType: 'positive'
    },
    {
      title: 'Active Students',
      value: calculatedStats.activeStudents.toString(),
      icon: GraduationCap,
      change: `Avg: ${calculatedStats.avgAttendance}% attendance`,
      changeType: 'positive'
    },
    {
      title: 'Women Empowered',
      value: calculatedStats.womenEmpowered.toString(),
      icon: Heart,
      change: `${calculatedStats.womenCompletionRate}% completed training`,
      changeType: 'positive'
    },
    {
      title: 'Average Performance',
      value: `${calculatedStats.avgMarks}%`,
      icon: TrendingUp,
      change: `Class average marks`,
      changeType: 'positive'
    }
  ] : [
    {
      title: 'Loading...',
      value: '...',
      icon: Users,
      change: 'Loading data...',
      changeType: 'neutral'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'student',
      message: 'New student Aisha Khan enrolled in Math program',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'women',
      message: 'Fatima completed tailoring certification',
      time: '4 hours ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'family',
      message: 'New family registered: The Shaikh Family',
      time: '1 day ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'attendance',
      message: 'Weekly attendance report generated',
      time: '2 days ago',
      status: 'info'
    }
  ];

  // Conditional layout based on user role
  if (user?.role === 'admin') {
    return (
      <div className="flex gap-6">
        {/* Left Sidebar with Dashboard Components - ADMIN ONLY */}
        <div className="w-80 space-y-6 flex-shrink-0">
          {/* Welcome Header */}
          <div className="neumorphic-card p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 text-sm">
              Here's what's happening with your KALAMS Foundation dashboard today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="neumorphic-card p-2">
                    <stat.icon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <Badge variant="success" className="text-xs">
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 neumorphic-card">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={handleAddStudent}
                className="w-full p-3 text-left neumorphic-button rounded-xl hover:shadow-neumorphic-sm transition-all"
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-4 w-4 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Add New Student</p>
                    <p className="text-xs text-gray-600">Register a new student to the program</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleTakeAttendance}
                className="w-full p-3 text-left neumorphic-button rounded-xl hover:shadow-neumorphic-sm transition-all"
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-4 w-4 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Take Attendance</p>
                    <p className="text-xs text-gray-600">Record student attendance for today</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleUpdateSkills}
                className="w-full p-3 text-left neumorphic-button rounded-xl hover:shadow-neumorphic-sm transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Heart className="h-4 w-4 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Update Skills Training</p>
                    <p className="text-xs text-gray-600">Update women's training progress</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Content Area - Available for other components */}
      <div className="flex-1 min-h-[600px]">
        <div className="neumorphic-card p-6 h-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Main Content Area</h2>
          <p className="text-gray-600 mb-6">
            This space is available for additional dashboard components, charts, or other content.
          </p>

          {/* Placeholder content - you can replace this with any components you want */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
            <div className="neumorphic-card p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-kalams-orange to-kalams-blue rounded-full mx-auto mb-3 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analytics Widget</h3>
                <p className="text-sm text-gray-600">Performance metrics and charts can go here</p>
              </div>
            </div>

            <div className="neumorphic-card p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-kalams-orange to-kalams-blue rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Progress Tracker</h3>
                <p className="text-sm text-gray-600">Student and women progress visualization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Firebase Migration Tool - Only show for admin */}
        <div className="mt-8">
          <FirebaseTest />
        </div>
      </div>
    </div>
    );
  }

  // Original Tutor Dashboard Layout
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="neumorphic-card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your KALAMS Foundation dashboard today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="neumorphic-card p-3">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="success" className="text-xs">
                  {stat.change}
                </Badge>
                <span className="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 neumorphic-card">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={handleRecordAttendance}
                className="w-full p-4 text-left neumorphic-button rounded-xl hover:shadow-neumorphic-sm transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Record Attendance</p>
                    <p className="text-sm text-gray-600">Mark attendance for all students at once</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleRecordMarks}
                className="w-full p-4 text-left neumorphic-button rounded-xl hover:shadow-neumorphic-sm transition-all"
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Record Marks</p>
                    <p className="text-sm text-gray-600">Enter test scores for all students at once</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleViewStudents}
                className="w-full p-4 text-left neumorphic-button rounded-xl hover:shadow-neumorphic-sm transition-all"
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">View Student Progress</p>
                    <p className="text-sm text-gray-600">See attendance and marks overview</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleUpdateSkills}
                className="w-full p-4 text-left neumorphic-button rounded-xl hover:shadow-neumorphic-sm transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Update Skills Training</p>
                    <p className="text-sm text-gray-600">Update women's training progress</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Attendance Modal */}
        <Modal
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          title="Record Attendance for All Students"
        >
          <div className="space-y-6">
            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kalams-blue focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="Hindi">Hindi</option>
                <option value="Computer">Computer</option>
                <option value="Art">Art</option>
              </select>
            </div>

            {/* Students List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Mark Attendance ({filteredStudents.length} students)
              </h3>

              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kalams-blue mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading students...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No students assigned to you. Contact admin to assign students.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.center}</p>
                      </div>

                      <div className="flex gap-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value="present"
                            checked={attendanceData[student.id] === 'present'}
                            onChange={() => handleAttendanceChange(student.id, 'present')}
                            className="mr-2 text-green-600"
                          />
                          <span className="text-sm text-green-600 font-medium">Present</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value="absent"
                            checked={attendanceData[student.id] === 'absent'}
                            onChange={() => handleAttendanceChange(student.id, 'absent')}
                            className="mr-2 text-red-600"
                          />
                          <span className="text-sm text-red-600 font-medium">Absent</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={submitBulkAttendance}
                variant="kalam"
                className="flex-1"
                disabled={filteredStudents.length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Attendance
              </Button>
              <Button
                onClick={() => setIsAttendanceModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Record Marks Modal */}
        <Modal
          isOpen={isMarksModalOpen}
          onClose={() => setIsMarksModalOpen(false)}
          title="Record Marks for All Students"
        >
          <div className="space-y-6">
            {/* Subject and Max Marks Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={selectedMarksSubject}
                  onChange={(e) => setSelectedMarksSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kalams-blue focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Computer">Computer</option>
                  <option value="Art">Art</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Marks *
                </label>
                <select
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kalams-blue focus:border-transparent"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Students List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Enter Marks ({filteredStudents.length} students)
              </h3>

              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kalams-blue mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading students...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No students assigned to you. Contact admin to assign students.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.center}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Marks:</span>
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          value={marksData[student.id] || ''}
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          placeholder="0"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-kalams-blue focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600">/ {maxMarks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={submitBulkMarks}
                variant="kalam"
                className="flex-1"
                disabled={filteredStudents.length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Marks
              </Button>
              <Button
                onClick={() => setIsMarksModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* View Students Progress Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Student Progress Overview"
        >
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kalams-blue mx-auto mb-2"></div>
                <p className="text-gray-600">Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No students assigned to you. Contact admin to assign students.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.center}</p>
                        <p className="text-xs text-blue-600">Tutor: {student.tutorEmail || student.tutor || 'Not assigned'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Overall</p>
                        <p className="font-medium text-gray-900">
                          {student.attendance || 0}% Attendance
                        </p>
                        <p className="font-medium text-gray-900">
                          {calculateStudentAverage(student)}% Average
                        </p>
                      </div>
                    </div>

                    {/* Subject-wise Attendance */}
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Attendance by Subject:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {student.subjectAttendance && Object.entries(student.subjectAttendance).map(([subject, data]) => (
                          <div key={subject} className="flex justify-between text-xs">
                            <span className="text-gray-600">{subject}:</span>
                            <span className="font-medium">{data.percentage}% ({data.attendedClasses}/{data.totalClasses})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subject-wise Marks */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Test Scores:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {student.subjectMarks && Object.entries(student.subjectMarks).map(([subject, scores]) => {
                          const latestScore = scores[scores.length - 1];
                          const average = Math.round(scores.reduce((sum, score) => sum + score.percentage, 0) / scores.length);
                          return (
                            <div key={subject} className="flex justify-between text-xs">
                              <span className="text-gray-600">{subject}:</span>
                              <span className="font-medium">
                                {latestScore ? `${latestScore.marks}/${latestScore.maxMarks}` : 'No scores'}
                                {scores.length > 0 && ` (${average}% avg)`}
                              </span>
                            </div>
                          );
                        })}
                        {(!student.subjectMarks || Object.keys(student.subjectMarks).length === 0) && (
                          <div className="text-xs text-gray-500 col-span-2">No test scores recorded yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={() => setIsViewModalOpen(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
