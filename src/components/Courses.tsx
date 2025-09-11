import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockCourses, mockUsers, hasPermission, Course } from '../lib/utils';

const Courses: React.FC = () => {
  const { user } = useAuth();
  const [courses] = useState(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!user) return null;

  const canCreate = hasPermission(user, 'create', 'courses');
  const canUpdate = hasPermission(user, 'update', 'courses');
  const canDelete = hasPermission(user, 'delete', 'courses');

  const getTeacherName = (teacherId: string) => {
    const teacher = mockUsers.find(u => u.id === teacherId);
    return teacher ? teacher.fullName : 'Unknown';
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleDelete = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      // In a real app, this would make an API call
      console.log('Deleting course:', courseId);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Courses Management</h3>
        {canCreate && (
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSelectedCourse(null);
              setShowModal(true);
            }}
          >
            Add New Course
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Teacher</th>
                  <th>Batch</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <strong>{course.name}</strong>
                    </td>
                    <td>{course.description}</td>
                    <td>{getTeacherName(course.teacherId)}</td>
                    <td>
                      <span className="badge bg-info">{course.batch}</span>
                    </td>
                    <td>
                      <span className="badge bg-success">{course.students.length} students</span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary btn-sm">
                          View
                        </button>
                        {canUpdate && (
                          <button 
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => handleEdit(course)}
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(course.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedCourse ? 'Edit Course' : 'Add New Course'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Course Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      defaultValue={selectedCourse?.name || ''}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control"
                      rows={3}
                      defaultValue={selectedCourse?.description || ''}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teacher</label>
                    <select className="form-select">
                      <option>Select Teacher</option>
                      {mockUsers.filter(u => u.role === 'teacher').map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Batch</label>
                    <select className="form-select">
                      <option>Select Batch</option>
                      <option value="Batch A">Batch A</option>
                      <option value="Batch B">Batch B</option>
                      <option value="Batch C">Batch C</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary">
                  {selectedCourse ? 'Update' : 'Create'} Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;