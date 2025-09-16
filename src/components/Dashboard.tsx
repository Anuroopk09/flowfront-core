import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockCourses, mockStudents, mockUsers, hasPermission } from '../lib/utils';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  if (!user) return null;

  const stats = [
    {
      title: 'Total Courses',
      value: mockCourses.length,
      icon: '📚',
      color: 'primary',
      show: hasPermission(user, 'read', 'courses')
    },
    {
      title: 'Total Students',
      value: mockStudents.length,
      icon: '👥',
      color: 'success',
      show: hasPermission(user, 'read', 'students') && user.role !== 'teacher'
    },
    {
      title: 'My Courses',
      value: user.role === 'student' ? mockStudents.find(s => s.userId === user.id)?.courses.length || 0 : mockCourses.filter(c => c.teacherId === user.id).length,
      icon: '📖',
      color: 'info',
      show: user.role === 'student' || user.role === 'teacher'
    },
    {
      title: 'Attendance Rate',
      value: '95%',
      icon: '✅',
      color: 'warning',
      show: hasPermission(user, 'read', 'attendance')
    }
  ].filter(stat => stat.show);

  const recentActivity = [
    'New student enrolled in Mathematics',
    'Attendance marked for Batch A',
    'Performance updated for Science course',
    'New assignment created'
  ];

  return (
    <div>
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className={`card dashboard-card border-${stat.color}`}>
              <div className="card-body text-center">
                <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                <h3 className={`text-${stat.color}`}>{stat.value}</h3>
                <p className="card-text">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="list-group-item d-flex align-items-center">
                    <span className="badge bg-primary rounded-pill me-3">{index + 1}</span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {hasPermission(user, 'create', 'courses') && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowCourseModal(true)}
                  >
                    Add New Course
                  </button>
                )}
                {hasPermission(user, 'create', 'students') && (
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => setShowStudentModal(true)}
                  >
                    Enroll Student
                  </button>
                )}
                {hasPermission(user, 'update', 'attendance') && (
                  <button 
                    className="btn btn-info btn-sm"
                    onClick={() => setShowAttendanceModal(true)}
                  >
                    Mark Attendance
                  </button>
                )}
                {hasPermission(user, 'create', 'performance') && (
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => setShowPerformanceModal(true)}
                  >
                    Add Performance
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5 className="card-title mb-0">Profile</h5>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {user.fullName}</p>
              <p><strong>Role:</strong> <span className="badge bg-secondary">{user.role}</span></p>
              <p><strong>Email:</strong> {user.email}</p>
              {user.address && <p><strong>Address:</strong> {user.address}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Modals */}
      {showCourseModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Course</h5>
                <button type="button" className="btn-close" onClick={() => setShowCourseModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Course Name</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows={3}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teacher</label>
                    <select className="form-select" required>
                      <option value="">Select Teacher</option>
                      {mockUsers.filter(u => u.role === 'teacher').map(teacher => (
                        <option key={teacher.id} value={teacher.id}>{teacher.fullName}</option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCourseModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => { alert('Course would be created!'); setShowCourseModal(false); }}>Create Course</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStudentModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enroll New Student</h5>
                <button type="button" className="btn-close" onClick={() => setShowStudentModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control" required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Batch</label>
                        <select className="form-select" required>
                          <option value="">Select Batch</option>
                          <option value="Batch A">Batch A</option>
                          <option value="Batch B">Batch B</option>
                          <option value="Batch C">Batch C</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input type="tel" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea className="form-control" rows={2}></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStudentModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => { alert('Student would be enrolled!'); setShowStudentModal(false); }}>Enroll Student</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAttendanceModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Quick Mark Attendance</h5>
                <button type="button" className="btn-close" onClick={() => setShowAttendanceModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <small>For detailed attendance marking, please use the Attendance section from the navigation menu.</small>
                </div>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Course</label>
                    <select className="form-select" required>
                      <option value="">Select Course</option>
                      {mockCourses.map(course => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Batch</label>
                    <select className="form-select" required>
                      <option value="">Select Batch</option>
                      <option value="Batch A">Batch A</option>
                      <option value="Batch B">Batch B</option>
                      <option value="Batch C">Batch C</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAttendanceModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => { alert('Redirecting to attendance page...'); setShowAttendanceModal(false); }}>Continue</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPerformanceModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Quick Add Performance</h5>
                <button type="button" className="btn-close" onClick={() => setShowPerformanceModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <small>For detailed performance management, please use the Performance section from the navigation menu.</small>
                </div>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Student</label>
                    <select className="form-select" required>
                      <option value="">Select Student</option>
                      {mockStudents.slice(0, 10).map(student => {
                        const studentUser = mockUsers.find(u => u.id === student.userId);
                        return (
                          <option key={student.id} value={student.id}>
                            {studentUser?.fullName} - {student.batch}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Assignment</label>
                    <input type="text" className="form-control" placeholder="e.g., Quiz 1" required />
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Score</label>
                        <input type="number" className="form-control" min="0" required />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Max Score</label>
                        <input type="number" className="form-control" min="1" required />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPerformanceModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => { alert('Performance would be recorded!'); setShowPerformanceModal(false); }}>Add Record</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;