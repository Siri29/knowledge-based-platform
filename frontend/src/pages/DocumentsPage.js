import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiFileText, FiSearch, FiPlus, FiEye, FiLock, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../api/axios';

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchDocuments();
      return;
    }

    try {
      const response = await axios.get(`/api/documents/search?q=${encodeURIComponent(searchQuery)}`);
      setDocuments(response.data);
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
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1><FiFileText className="me-2" />Documents</h1>
            <Link to="/documents/new" className="btn btn-primary">
              <FiPlus className="me-1" />New Document
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="outline-secondary">
                <FiSearch />
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Row>
        {documents.length === 0 ? (
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <FiFileText size={48} className="text-muted mb-3" />
                <h5>No documents found</h5>
                <p className="text-muted">Create your first document to get started</p>
                <Link to="/documents/new" className="btn btn-primary">
                  <FiPlus className="me-1" />Create Document
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          documents.map(doc => (
            <Col md={6} lg={4} key={doc._id} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0">
                      <Link to={`/documents/${doc._id}`} className="text-decoration-none">
                        {doc.title}
                      </Link>
                    </h6>
                    <div>
                      {doc.isPublic ? (
                        <Badge bg="success" className="me-1">
                          <FiGlobe size={12} className="me-1" />Public
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="me-1">
                          <FiLock size={12} className="me-1" />Private
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted small mb-2">
                    By {doc.author.name}
                  </p>
                  
                  <p className="card-text small text-muted">
                    {doc.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Modified {new Date(doc.updatedAt).toLocaleDateString()}
                    </small>
                    <div>
                      <Badge bg="info" className="me-1">
                        v{doc.currentVersion}
                      </Badge>
                      {doc.sharedWith.length > 0 && (
                        <Badge bg="warning">
                          <FiEye size={12} className="me-1" />{doc.sharedWith.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default DocumentsPage;