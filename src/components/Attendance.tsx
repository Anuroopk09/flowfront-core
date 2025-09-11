import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStudents, mockUsers, mockCourses, hasPermission } from '../lib/utils';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  if (!user || !hasPermission(user, 'read', 'attendance')) {
    return (
      <div className="alert alert-warning">
        <h4>Access Denied</h4>
        <p>You don't have permission to view attendance data.</p>
      </div>
    );
  }

  const getStudentUser = (userId: string) => {
    return mockUsers.find(u => u.id === userId);
  };

  const getCourseName = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course?.name || 'Unknown Course';
  };

  // Get all attendance records
  const allAttendanceRecords = mockStudents.flatMap(student => 
    student.attendance.map(record => ({
      ...record,
      student,
      studentUser: getStudentUser(student.userId)
    }))
  );

  // Filter attendance records
  const filteredRecords = allAttendanceRecords.filter(record => {
    const matchesDate = !selectedDate || record.date === selectedDate;
    const matchesCourse = !selectedCourse || record.courseId === selectedCourse;
    const matchesBatch = !selectedBatch || record.student.batch === selectedBatch;
    return matchesDate && matchesCourse && matchesBatch;
  });

  // Calculate statistics
  const totalRecords = filteredRecords.length;
  const presentRecords = filteredRecords.filter(r => r.present).length;
  const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  const todayAttendance = allAttendanceRecords.filter(r => r.date === new Date().toISOString().split('T')[0]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Attendance Management</h3>
        {hasPermission(user, 'create', 'attendance') && (
          <button className="btn btn-primary">Mark Today's Attendance</button>
        )}
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{todayAttendance.filter(r => r.present).length}</h4>
              <p className="mb-0">Present Today</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h4>{todayAttendance.filter(r => !r.present).length}</h4>
              <p className="mb-0">Absent Today</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{attendanceRate}%</h4>
              <p className="mb-0">Overall Rate</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h4>{totalRecords}</h4>
              <p className="mb-0">Total Records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Course</label>
              <select 
                className="form-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">All Courses</option>
                {mockCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Batch</label>
              <select 
                className="form-select"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="">All Batches</option>
                <option value="Batch A">Batch A</option>
                <option value="Batch B">Batch B</option>
                <option value="Batch C">Batch C</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSelectedDate('');
                  setSelectedCourse('');
                  setSelectedBatch('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Student</th>
                  <th>Batch</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.studentUser?.fullName}</strong>
                      <br />
                      <small className="text-muted">{record.studentUser?.email}</small>
                    </td>
                    <td>
                      <span className={`badge ${
                        record.student.batch === 'Batch A' ? 'bg-primary' :
                        record.student.batch === 'Batch B' ? 'bg-success' : 'bg-info'
                      }`}>
                        {record.student.batch}
                      </span>
                    </td>
                    <td>{getCourseName(record.courseId)}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${record.present ? 'bg-success' : 'bg-danger'}`}>
                        {record.present ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td>
                      {hasPermission(user, 'update', 'attendance') && (
                        <button className="btn btn-outline-warning btn-sm">
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRecords.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted">No attendance records found for the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;