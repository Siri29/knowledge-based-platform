import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiFolderPlus, FiEye, FiEdit3 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { spacesAPI, pagesAPI } from '../services/api';
import { toast } from 'react-toastify';
import SearchWithSuggestions from '../components/SearchWithSuggestions';

function Dashboard() {
  const [spaces, setSpaces] = useState([]);
  const [recentPages, setRecentPages] = useState([]);
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spaceForm, setSpaceForm] = useState({
    name: '',
    description: '',
    key: '',
    isPublic: false
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [spacesRes, pagesRes] = await Promise.all([
        spacesAPI.getAll(),
        pagesAPI.getAll({ limit: 10 })
      ]);
      setSpaces(spacesRes.data);
      setRecentPages(pagesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    try {
      const newSpace = await spacesAPI.create(spaceForm);
      setSpaces([newSpace.data, ...spaces]);
      setShowSpaceModal(false);
      setSpaceForm({ name: '', description: '', key: '', isPublic: false });
      toast.success('Space created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create space');
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const res = await pagesAPI.search(query);
      setSearchResults(res.data);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status"></div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4 fade-in">
        <Col>
          <h1>Welcome back, {user?.name}!</h1>
          <p className="text-muted">Manage your knowledge base and collaborate with your team.</p>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={8}>
          <SearchWithSuggestions
            onSearch={handleSearch}
            placeholder="Search pages, spaces, or content..."
          />
        </Col>
        <Col md={4} className="text-end">
          {(user?.role === 'admin' || user?.role === 'editor') && (
            <Button variant="primary" onClick={() => setShowSpaceModal(true)}>
              <FiFolderPlus className="me-1" />New Space
            </Button>
          )}
        </Col>
      </Row>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Row className="mb-4">
          <Col>
            <h4>Search Results</h4>
            {searchResults.map(page => (
              <Card key={page._id} className="mb-2">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6><Link to={`/pages/${page._id}`}>{page.title}</Link></h6>
                      <small className="text-muted">
                        in {page.space.name} • by {page.author.name}
                      </small>
                    </div>
                    <div>
                      <FiEye className="me-1" />{page.viewCount}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}

      <Row>
        {/* Spaces */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Your Spaces</h5>
            </Card.Header>
            <Card.Body>
              {spaces.length === 0 ? (
                <p className="text-muted">No spaces yet. Create your first space!</p>
              ) : (
                spaces.map(space => (
                  <div key={space._id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div>
                      <Link to={`/spaces/${space._id}`} className="fw-bold">{space.name}</Link>
                      <div className="small text-muted">{space.key}</div>
                    </div>
                    <div>
                      {space.isPublic && <span className="badge bg-success me-2">Public</span>}
                      <Link to={`/spaces/${space._id}/new-page`} className="btn btn-sm btn-outline-primary">
                        <FiPlus />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Pages */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Recent Pages</h5>
            </Card.Header>
            <Card.Body>
              {recentPages.length === 0 ? (
                <p className="text-muted">No pages yet. Create your first page!</p>
              ) : (
                recentPages.map(page => (
                  <div key={page._id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div>
                      <Link to={`/pages/${page._id}`} className="fw-bold">{page.title}</Link>
                      <div className="small text-muted">
                        {page.space.name} • {new Date(page.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <FiEye className="me-1" />{page.viewCount}
                      {(user?.role === 'admin' || user?.role === 'editor') && (
                        <Link to={`/pages/${page._id}/edit`} className="btn btn-sm btn-outline-secondary ms-2">
                          <FiEdit3 />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Space Modal */}
      <Modal show={showSpaceModal} onHide={() => setShowSpaceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Space</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSpace}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Space Name</Form.Label>
              <Form.Control
                type="text"
                value={spaceForm.name}
                onChange={(e) => setSpaceForm({...spaceForm, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Space Key</Form.Label>
              <Form.Control
                type="text"
                value={spaceForm.key}
                onChange={(e) => setSpaceForm({...spaceForm, key: e.target.value.toUpperCase()})}
                placeholder="e.g., PROJ"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={spaceForm.description}
                onChange={(e) => setSpaceForm({...spaceForm, description: e.target.value})}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Make this space public"
              checked={spaceForm.isPublic}
              onChange={(e) => setSpaceForm({...spaceForm, isPublic: e.target.checked})}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSpaceModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Space
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Dashboard;