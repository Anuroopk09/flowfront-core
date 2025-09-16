import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStudents, mockUsers, hasPermission } from '../lib/utils';

const Students: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [modalType, setModalType] = useState<'view' | 'edit'>('view');

  if (!user || !hasPermission(user, 'read', 'students')) {
    return (
      <div className="alert alert-warning">
        <h4>Access Denied</h4>
        <p>You don't have permission to view student data.</p>
      </div>
    );
  }

  const getStudentUser = (userId: string) => {
    return mockUsers.find(u => u.id === userId);
  };

  const filteredStudents = mockStudents.filter(student => {
    const studentUser = getStudentUser(student.userId);
    const matchesSearch = studentUser?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = !selectedBatch || student.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const calculateAttendanceRate = (student: any) => {
    if (student.attendance.length === 0) return 0;
    const presentCount = student.attendance.filter((a: any) => a.present).length;
    return Math.round((presentCount / student.attendance.length) * 100);
  };

  const calculateAverageScore = (student: any) => {
    if (student.performance.length === 0) return 0;
    const totalScore = student.performance.reduce((sum: number, p: any) => sum + (p.score / p.maxScore) * 100, 0);
    return Math.round(totalScore / student.performance.length);
  };

  const handleView = (student: any) => {
    setSelectedStudent(student);
    setModalType('view');
    setShowModal(true);
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setModalType('edit');
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Students Management</h3>
        <span className="badge bg-info">{filteredStudents.length} students</span>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search students by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
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
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{mockStudents.filter(s => s.batch === 'Batch A').length}</h4>
              <p className="mb-0">Batch A</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{mockStudents.filter(s => s.batch === 'Batch B').length}</h4>
              <p className="mb-0">Batch B</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h4>{mockStudents.filter(s => s.batch === 'Batch C').length}</h4>
              <p className="mb-0">Batch C</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h4>{mockStudents.length}</h4>
              <p className="mb-0">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Batch</th>
                  <th>Courses</th>
                  <th>Attendance</th>
                  <th>Avg Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const studentUser = getStudentUser(student.userId);
                  const attendanceRate = calculateAttendanceRate(student);
                  const avgScore = calculateAverageScore(student);
                  
                  return (
                    <tr key={student.id}>
                      <td>
                        <strong>{studentUser?.fullName}</strong>
                        <br />
                        <small className="text-muted">{studentUser?.address}</small>
                      </td>
                      <td>{studentUser?.email}</td>
                      <td>
                        <span className={`badge ${
                          student.batch === 'Batch A' ? 'bg-primary' :
                          student.batch === 'Batch B' ? 'bg-success' : 'bg-info'
                        }`}>
                          {student.batch}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{student.courses.length} courses</span>
                      </td>
                      <td>
                        <div className="progress" style={{ width: '60px', height: '20px' }}>
                          <div 
                            className={`progress-bar ${
                              attendanceRate >= 90 ? 'bg-success' :
                              attendanceRate >= 75 ? 'bg-warning' : 'bg-danger'
                            }`}
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                        <small>{attendanceRate}%</small>
                      </td>
                      <td>
                        <span className={`badge ${
                          avgScore >= 90 ? 'bg-success' :
                          avgScore >= 75 ? 'bg-warning' : 'bg-danger'
                        }`}>
                          {avgScore}%
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleView(student)}
                          >
                            View
                          </button>
                          {hasPermission(user, 'update', 'students') && (
                            <button 
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => handleEdit(student)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Modal */}
      {showModal && selectedStudent && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === 'view' ? 'Student Details' : 'Edit Student'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {modalType === 'view' ? (
                  <div>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Name:</strong> {getStudentUser(selectedStudent.userId)?.fullName}</p>
                        <p><strong>Email:</strong> {getStudentUser(selectedStudent.userId)?.email}</p>
                        <p><strong>Address:</strong> {getStudentUser(selectedStudent.userId)?.address}</p>
                        <p><strong>Batch:</strong> <span className="badge bg-info">{selectedStudent.batch}</span></p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Courses:</strong> {selectedStudent.courses.length}</p>
                        <p><strong>Attendance Rate:</strong> {calculateAttendanceRate(selectedStudent)}%</p>
                        <p><strong>Average Score:</strong> {calculateAverageScore(selectedStudent)}%</p>
                      </div>
                    </div>
                    <hr />
                    <h6>Recent Performance:</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Assignment</th>
                            <th>Score</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedStudent.performance.slice(0, 5).map((perf: any) => (
                            <tr key={perf.id}>
                              <td>{perf.assignment}</td>
                              <td>{perf.score}/{perf.maxScore}</td>
                              <td>{new Date(perf.date).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <form>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Full Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            defaultValue={getStudentUser(selectedStudent.userId)?.fullName}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input 
                            type="email" 
                            className="form-control"
                            defaultValue={getStudentUser(selectedStudent.userId)?.email}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Batch</label>
                          <select className="form-select" defaultValue={selectedStudent.batch}>
                            <option value="Batch A">Batch A</option>
                            <option value="Batch B">Batch B</option>
                            <option value="Batch C">Batch C</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <textarea 
                            className="form-control"
                            rows={3}
                            defaultValue={getStudentUser(selectedStudent.userId)?.address}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                {modalType === 'edit' && (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => {
                      alert('Changes would be saved here!');
                      setShowModal(false);
                    }}
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;