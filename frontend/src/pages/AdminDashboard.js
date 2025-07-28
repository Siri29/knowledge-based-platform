import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { FiUsers, FiFileText, FiFolder, FiActivity, FiEdit3, FiTrash2, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import PasswordDisplay from '../components/PasswordDisplay';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, activitiesRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/activities')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowEditModal(true);
  };

  const handleUpdateRole = async () => {
    try {
      await axios.put(`/api/admin/users/${selectedUser._id}/role`, { role: newRole });
      setUsers(users.map(u => u._id === selectedUser._id ? { ...u, role: newRole } : u));
      setShowEditModal(false);
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their content.')) return;
    
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'editor': return 'warning';
      case 'viewer': return 'secondary';
      default: return 'secondary';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Container className="mt-5 text-center">
        <FiShield size={64} className="text-muted mb-3" />
        <h3>Access Denied</h3>
        <p className="text-muted">You need admin privileges to access this page.</p>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status"></div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 fade-in">
      <Row className="mb-4">
        <Col>
          <h1><FiShield className="me-2" />Admin Dashboard</h1>
          <p className="text-muted">Manage users and monitor platform activity</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FiUsers size={32} className="text-primary mb-2" />
              <h3>{stats.totalUsers}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FiFileText size={32} className="text-success mb-2" />
              <h3>{stats.totalPages}</h3>
              <p className="text-muted mb-0">Total Pages</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FiFolder size={32} className="text-warning mb-2" />
              <h3>{stats.totalSpaces}</h3>
              <p className="text-muted mb-0">Total Spaces</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FiFileText size={32} className="text-info mb-2" />
              <h3>{stats.totalDocuments}</h3>
              <p className="text-muted mb-0">Total Documents</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Users Management */}
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5><FiUsers className="me-2" />User Management</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <PasswordDisplay password={user.plainPassword} />
                      </td>
                      <td>
                        <Badge bg={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEditUser(user)}
                        >
                          <FiEdit3 />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5><FiActivity className="me-2" />Recent Activities</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {activities.filter(activity => activity.user).map(activity => (
                <div key={activity._id} className="activity-item mb-2 p-2 border rounded">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{activity.user?.name || 'Unknown User'}</strong>
                      <span className="text-muted"> {activity.action} </span>
                      <span>{activity.targetTitle}</span>
                      {activity.space && (
                        <div className="small text-muted">
                          in {activity.space.name}
                        </div>
                      )}
                    </div>
                    <small className="text-muted">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>User: {selectedUser.name}</Form.Label>
                <Form.Text className="d-block text-muted">
                  Email: {selectedUser.email}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateRole}>
            Update Role
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;