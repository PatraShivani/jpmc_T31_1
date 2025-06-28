import React, { useState } from 'react';
import { Calendar, Plus, BookOpen, TrendingUp, Users, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { mockStudents, centers } from '../data/mockData';

const Students = () => {
  const [students, setStudents] = useState(mockStudents);
  const [selectedCenter, setSelectedCenter] = useState('All Centers');
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isTestScoreModalOpen, setIsTestScoreModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'present'
  });
  const [testScoreData, setTestScoreData] = useState({
    subject: '',
    score: '',
    maxScore: '100'
  });

  const filteredStudents = selectedCenter === 'All Centers' 
    ? students 
    : students.filter(student => student.center === selectedCenter);

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
    setIsAttendanceModalOpen(true);
  };

  const handleAddTestScore = (student) => {
    setSelectedStudent(student);
    setIsTestScoreModalOpen(true);
  };

  const submitAttendance = (e) => {
    e.preventDefault();
    // In a real app, this would update the backend
    console.log('Attendance recorded:', {
      student: selectedStudent.name,
      date: attendanceData.date,
      status: attendanceData.status
    });
    setIsAttendanceModalOpen(false);
    setAttendanceData({
      date: new Date().toISOString().split('T')[0],
      status: 'present'
    });
  };

  const submitTestScore = (e) => {
    e.preventDefault();
    // Update student's last test score
    const updatedStudents = students.map(student => 
      student.id === selectedStudent.id 
        ? { ...student, lastTestScore: parseInt(testScoreData.score) }
        : student
    );
    setStudents(updatedStudents);
    setIsTestScoreModalOpen(false);
    setTestScoreData({ subject: '', score: '', maxScore: '100' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Track student progress, attendance, and performance</p>
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
                  {Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)}%
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
                  {Math.round(students.reduce((acc, s) => acc + s.lastTestScore, 0) / students.length)}
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
                  </div>

                  {/* Performance Metrics */}
                  <div className="neumorphic-card p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Attendance</span>
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
                      <div className="flex justify-between text-sm">
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
    </div>
  );
};

export default Students;
