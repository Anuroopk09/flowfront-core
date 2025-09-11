import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStudents, mockUsers, mockCourses, hasPermission } from '../lib/utils';

const Performance: React.FC = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');

  if (!user || !hasPermission(user, 'read', 'performance')) {
    return (
      <div className="alert alert-warning">
        <h4>Access Denied</h4>
        <p>You don't have permission to view performance data.</p>
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

  // Get all performance records
  const allPerformanceRecords = mockStudents.flatMap(student => 
    student.performance.map(record => ({
      ...record,
      student,
      studentUser: getStudentUser(student.userId),
      percentage: Math.round((record.score / record.maxScore) * 100)
    }))
  );

  // Get unique assignments
  const uniqueAssignments = [...new Set(allPerformanceRecords.map(r => r.assignment))];

  // Filter performance records
  const filteredRecords = allPerformanceRecords.filter(record => {
    const matchesCourse = !selectedCourse || record.courseId === selectedCourse;
    const matchesBatch = !selectedBatch || record.student.batch === selectedBatch;
    const matchesAssignment = !selectedAssignment || record.assignment === selectedAssignment;
    return matchesCourse && matchesBatch && matchesAssignment;
  });

  // Calculate statistics
  const avgScore = filteredRecords.length > 0 
    ? Math.round(filteredRecords.reduce((sum, r) => sum + r.percentage, 0) / filteredRecords.length)
    : 0;

  const highPerformers = filteredRecords.filter(r => r.percentage >= 90).length;
  const lowPerformers = filteredRecords.filter(r => r.percentage < 60).length;

  // Student averages for ranking
  const studentAverages = mockStudents.map(student => {
    const studentRecords = student.performance.filter(p => 
      (!selectedCourse || p.courseId === selectedCourse) &&
      (!selectedAssignment || p.assignment === selectedAssignment)
    );
    
    const avgPercentage = studentRecords.length > 0
      ? Math.round(studentRecords.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / studentRecords.length)
      : 0;
    
    return {
      student,
      studentUser: getStudentUser(student.userId),
      avgPercentage,
      totalAssignments: studentRecords.length
    };
  })
  .filter(s => s.totalAssignments > 0)
  .sort((a, b) => b.avgPercentage - a.avgPercentage);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Performance Management</h3>
        {hasPermission(user, 'create', 'performance') && (
          <button className="btn btn-primary">Add Performance Record</button>
        )}
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{avgScore}%</h4>
              <p className="mb-0">Average Score</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{highPerformers}</h4>
              <p className="mb-0">High Performers (90%+)</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h4>{lowPerformers}</h4>
              <p className="mb-0">Need Support (&lt;60%)</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h4>{filteredRecords.length}</h4>
              <p className="mb-0">Total Records</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Filters and Performance Records */}
        <div className="col-md-8">
          {/* Filters */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
                  <label className="form-label">Assignment</label>
                  <select 
                    className="form-select"
                    value={selectedAssignment}
                    onChange={(e) => setSelectedAssignment(e.target.value)}
                  >
                    <option value="">All Assignments</option>
                    {uniqueAssignments.map(assignment => (
                      <option key={assignment} value={assignment}>{assignment}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Records Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Performance Records</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Assignment</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Date</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.slice(0, 20).map((record) => {
                      const grade = record.percentage >= 90 ? 'A' :
                                   record.percentage >= 80 ? 'B' :
                                   record.percentage >= 70 ? 'C' :
                                   record.percentage >= 60 ? 'D' : 'F';
                      
                      return (
                        <tr key={record.id}>
                          <td>
                            <strong>{record.studentUser?.fullName}</strong>
                            <br />
                            <small className="text-muted">{record.student.batch}</small>
                          </td>
                          <td>{getCourseName(record.courseId)}</td>
                          <td>{record.assignment}</td>
                          <td>{record.score}/{record.maxScore}</td>
                          <td>
                            <span className={`badge ${
                              record.percentage >= 90 ? 'bg-success' :
                              record.percentage >= 75 ? 'bg-primary' :
                              record.percentage >= 60 ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {record.percentage}%
                            </span>
                          </td>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${
                              grade === 'A' ? 'bg-success' :
                              grade === 'B' ? 'bg-primary' :
                              grade === 'C' ? 'bg-info' :
                              grade === 'D' ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredRecords.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">No performance records found for the selected filters.</p>
                  </div>
                )}
                {filteredRecords.length > 20 && (
                  <div className="text-center py-2">
                    <small className="text-muted">Showing first 20 of {filteredRecords.length} records</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers Leaderboard */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">🏆 Top Performers</h5>
            </div>
            <div className="card-body">
              {studentAverages.slice(0, 10).map((student, index) => (
                <div key={student.student.id} className="d-flex align-items-center mb-3">
                  <span className={`badge rounded-pill me-3 ${
                    index === 0 ? 'bg-warning' :
                    index === 1 ? 'bg-secondary' :
                    index === 2 ? 'bg-danger' : 'bg-primary'
                  }`}>
                    #{index + 1}
                  </span>
                  <div className="flex-grow-1">
                    <div className="fw-bold">{student.studentUser?.fullName}</div>
                    <small className="text-muted">{student.student.batch}</small>
                  </div>
                  <span className="badge bg-success">{student.avgPercentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;