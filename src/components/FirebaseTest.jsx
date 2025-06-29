import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { migrateLocalStorageToFirebase, studentsService } from '../firebase/services';
import { testFirebaseConnection } from '../utils/firebaseTest';

const FirebaseTest = () => {
  const [migrationStatus, setMigrationStatus] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleMigration = async () => {
    setIsLoading(true);
    setMigrationStatus('Starting migration...');
    
    try {
      const success = await migrateLocalStorageToFirebase();
      if (success) {
        setMigrationStatus('✅ Migration completed successfully!');
      } else {
        setMigrationStatus('❌ Migration failed. Check console for errors.');
      }
    } catch (error) {
      setMigrationStatus(`❌ Migration error: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const handleConnectionTest = async () => {
    setIsTesting(true);
    setConnectionStatus('Testing Firebase connection...');

    try {
      const result = await testFirebaseConnection();
      if (result.success) {
        setConnectionStatus(`✅ ${result.message} (Doc ID: ${result.docId})`);
      } else {
        setConnectionStatus(`❌ ${result.message}`);
      }
    } catch (error) {
      setConnectionStatus(`❌ Connection test failed: ${error.message}`);
    }

    setIsTesting(false);
  };

  const addTestStudents = async () => {
    setMigrationStatus('Adding test students with tutor assignments...');

    try {
      const testStudents = [
        {
          name: "Aisha Khan",
          age: 16,
          center: "Mehdipatnam Center",
          subjects: ["English", "Math"],
          familyId: 1,
          contact: "+91 9876543210",
          attendance: 85,
          lastTestScore: 78,
          enrollmentDate: "2024-01-15",
          tutorEmail: "tutor@kalams.org",
          tutor: "tutor@kalams.org",
          subjectAttendance: {
            English: { totalClasses: 20, attendedClasses: 17, percentage: 85 },
            Math: { totalClasses: 18, attendedClasses: 15, percentage: 83 }
          },
          subjectMarks: {
            English: [
              { date: "2024-01-10", marks: 85, maxMarks: 100, percentage: 85, timestamp: new Date().toISOString() },
              { date: "2024-01-20", marks: 78, maxMarks: 100, percentage: 78, timestamp: new Date().toISOString() }
            ],
            Math: [
              { date: "2024-01-12", marks: 92, maxMarks: 100, percentage: 92, timestamp: new Date().toISOString() }
            ]
          },
          averageMarks: 85,
          attendanceHistory: []
        },
        {
          name: "Mohammed Shaikh",
          age: 15,
          center: "Santosh Nagar Center",
          subjects: ["English", "Science"],
          familyId: 2,
          contact: "+91 9876543211",
          attendance: 92,
          lastTestScore: 85,
          enrollmentDate: "2024-02-20",
          tutorEmail: "tutor2@kalams.org",
          tutor: "tutor2@kalams.org",
          subjectAttendance: {
            English: { totalClasses: 22, attendedClasses: 20, percentage: 91 },
            Science: { totalClasses: 20, attendedClasses: 19, percentage: 95 }
          },
          subjectMarks: {
            English: [
              { date: "2024-02-15", marks: 88, maxMarks: 100, percentage: 88, timestamp: new Date().toISOString() }
            ],
            Science: [
              { date: "2024-02-18", marks: 95, maxMarks: 100, percentage: 95, timestamp: new Date().toISOString() }
            ]
          },
          averageMarks: 91,
          attendanceHistory: []
        },
        {
          name: "Sara Ahmed",
          age: 17,
          center: "Mehdipatnam Center",
          subjects: ["Math", "Science"],
          familyId: 3,
          contact: "+91 9876543212",
          attendance: 88,
          lastTestScore: 92,
          enrollmentDate: "2024-03-10",
          tutorEmail: "tutor3@kalams.org",
          tutor: "tutor3@kalams.org",
          subjectAttendance: {
            Math: { totalClasses: 25, attendedClasses: 22, percentage: 88 },
            Science: { totalClasses: 23, attendedClasses: 20, percentage: 87 }
          },
          subjectMarks: {
            Math: [
              { date: "2024-03-05", marks: 92, maxMarks: 100, percentage: 92, timestamp: new Date().toISOString() }
            ],
            Science: [
              { date: "2024-03-08", marks: 89, maxMarks: 100, percentage: 89, timestamp: new Date().toISOString() }
            ]
          },
          averageMarks: 90,
          attendanceHistory: []
        }
      ];

      for (const student of testStudents) {
        await studentsService.add(student);
      }

      setMigrationStatus(`✅ Added ${testStudents.length} test students with tutor assignments and sample data!`);
    } catch (error) {
      setMigrationStatus(`❌ Error adding test students: ${error.message}`);
    }
  };

  const assignAllStudentsToTutor = async () => {
    setMigrationStatus('Assigning students to different tutors...');

    try {
      // Get all current students
      const allStudents = await studentsService.getAll();

      if (allStudents.length === 0) {
        setMigrationStatus('❌ No students found in database. Add some students first.');
        return;
      }

      // Different tutor emails to assign
      const tutorEmails = [
        "tutor@kalams.org",
        "tutor2@kalams.org",
        "tutor3@kalams.org",
        "tutor4@kalams.org"
      ];

      let updatedCount = 0;

      for (let i = 0; i < allStudents.length; i++) {
        const student = allStudents[i];
        // Assign tutors in rotation - first student gets tutor@kalams.org, others get different tutors
        const assignedTutorEmail = i === 0 ? tutorEmails[0] : tutorEmails[i % tutorEmails.length];

        // Update student with tutor assignment and ensure proper data structure
        const updatedStudent = {
          ...student,
          tutorEmail: assignedTutorEmail,
          tutor: assignedTutorEmail,
          // Ensure subjectAttendance exists
          subjectAttendance: student.subjectAttendance || student.subjects?.reduce((acc, subject) => {
            acc[subject] = {
              totalClasses: 20,
              attendedClasses: Math.floor((student.attendance || 85) / 100 * 20),
              percentage: student.attendance || 85
            };
            return acc;
          }, {}) || {},
          // Ensure subjectMarks exists
          subjectMarks: student.subjectMarks || {},
          // Ensure averageMarks exists
          averageMarks: student.averageMarks || student.lastTestScore || 0,
          // Ensure attendanceHistory exists
          attendanceHistory: student.attendanceHistory || []
        };

        await studentsService.update(student.id, updatedStudent);
        updatedCount++;
      }

      setMigrationStatus(`✅ Successfully assigned ${updatedCount} students to different tutors! First student assigned to tutor@kalams.org, others to different tutors. Check student cards to see tutor assignments.`);
    } catch (error) {
      setMigrationStatus(`❌ Error assigning students to tutor: ${error.message}`);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Firebase Migration Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          First test Firebase connection, then migrate your localStorage data to Firestore.
        </p>

        <div className="space-y-2">
          <Button
            onClick={handleConnectionTest}
            disabled={isTesting}
            variant="outline"
            className="w-full"
          >
            {isTesting ? 'Testing...' : 'Test Firebase Connection'}
          </Button>

          <Button
            onClick={handleMigration}
            disabled={isLoading}
            variant="kalam"
            className="w-full"
          >
            {isLoading ? 'Migrating...' : 'Migrate to Firebase'}
          </Button>

          <Button
            onClick={addTestStudents}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Add Test Students with Tutor Assignment
          </Button>

          <Button
            onClick={assignAllStudentsToTutor}
            disabled={isLoading}
            variant="secondary"
            className="w-full"
          >
            Assign Students to Different Tutors
          </Button>
        </div>
        
        {connectionStatus && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm">{connectionStatus}</p>
          </div>
        )}

        {migrationStatus && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm">{migrationStatus}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p><strong>Note:</strong> Make sure you've:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Created a Firebase project</li>
            <li>Set up Firestore database</li>
            <li>Updated firebase/config.js with your credentials</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirebaseTest;
