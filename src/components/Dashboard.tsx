import React from 'react';
import { useAuth } from '../context/AuthContext';
import { mockCourses, mockStudents, hasPermission } from '../lib/utils';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

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
                  <button className="btn btn-primary btn-sm">Add New Course</button>
                )}
                {hasPermission(user, 'create', 'students') && (
                  <button className="btn btn-success btn-sm">Enroll Student</button>
                )}
                {hasPermission(user, 'update', 'attendance') && (
                  <button className="btn btn-info btn-sm">Mark Attendance</button>
                )}
                {hasPermission(user, 'create', 'performance') && (
                  <button className="btn btn-warning btn-sm">Add Performance</button>
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
    </div>
  );
};

export default Dashboard;