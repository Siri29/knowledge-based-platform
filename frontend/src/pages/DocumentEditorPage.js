import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Modal, Badge, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiShare2, FiClock, FiEye, FiEdit3, FiGlobe, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../api/axios';

function DocumentEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');
  const autoSaveRef = useRef(null);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchDocument();
    }
  }, [id]);

  useEffect(() => {
    // Auto-save functionality
    if (id && id !== 'new' && document) {
      clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000);
    }
    return () => clearTimeout(autoSaveRef.current);
  }, [title, content, isPublic]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/api/documents/${id}`);
      const doc = response.data;
      setDocument(doc);
      setTitle(doc.title);
      setContent(doc.content);
      setIsPublic(doc.isPublic);
    } catch (error) {
      toast.error('Failed to fetch document');
      navigate('/documents');
    }
  };

  const handleAutoSave = async () => {
    if (!document || loading) return;
    
    try {
      await axios.put(`/api/documents/${id}`, {
        title,
        content,
        isPublic
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    try {
      if (id === 'new') {
        const response = await axios.post('/api/documents', {
          title,
          content,
          isPublic
        });
        toast.success('Document created successfully');
        navigate(`/documents/${response.data._id}`);
      } else {
        await axios.put(`/api/documents/${id}`, {
          title,
          content,
          isPublic
        });
        toast.success('Document saved successfully');
        fetchDocument();
      }
    } catch (error) {
      toast.error('Failed to save document');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/documents/${id}/share`, {
        userEmail: shareEmail,
        permission: sharePermission
      });
      toast.success('Document shared successfully');
      setShowShareModal(false);
      setShareEmail('');
      fetchDocument();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to share document');
    }
  };

  const formatContent = (command) => {
    document.execCommand(command, false, null);
  };

  const insertMention = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const mention = document.createElement('span');
      mention.style.color = '#0066cc';
      mention.style.fontWeight = 'bold';
      mention.textContent = '@username';
      range.insertNode(mention);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document title..."
                    className="border-0 fs-5 fw-bold"
                    style={{ background: 'transparent' }}
                  />
                  {isPublic ? (
                    <Badge bg="success" className="ms-2">
                      <FiGlobe size={12} className="me-1" />Public
                    </Badge>
                  ) : (
                    <Badge bg="secondary" className="ms-2">
                      <FiLock size={12} className="me-1" />Private
                    </Badge>
                  )}
                </div>
                <div>
                  {document && (
                    <>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => setShowVersionModal(true)}
                      >
                        <FiClock className="me-1" />v{document.currentVersion}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => setShowShareModal(true)}
                      >
                        <FiShare2 className="me-1" />Share
                      </Button>
                    </>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    <FiSave className="me-1" />
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </Card.Header>
            
            <Card.Body>
              {/* Toolbar */}
              <div className="border-bottom pb-2 mb-3">
                <div className="btn-group me-2">
                  <Button variant="outline-secondary" size="sm" onClick={() => formatContent('bold')}>
                    <strong>B</strong>
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={() => formatContent('italic')}>
                    <em>I</em>
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={() => formatContent('underline')}>
                    <u>U</u>
                  </Button>
                </div>
                <div className="btn-group me-2">
                  <Button variant="outline-secondary" size="sm" onClick={() => formatContent('insertUnorderedList')}>
                    • List
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={() => formatContent('insertOrderedList')}>
                    1. List
                  </Button>
                </div>
                <Button variant="outline-secondary" size="sm" onClick={insertMention}>
                  @ Mention
                </Button>
              </div>

              {/* Editor */}
              <div
                contentEditable
                className="form-control"
                style={{ minHeight: '400px', border: 'none' }}
                dangerouslySetInnerHTML={{ __html: content }}
                onInput={(e) => setContent(e.target.innerHTML)}
                placeholder="Start writing your document..."
              />

              {/* Privacy Toggle */}
              <div className="mt-3">
                <Form.Check
                  type="switch"
                  id="public-switch"
                  label="Make this document public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Public documents can be accessed by anyone with the link
                </Form.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Share Modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Share Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {document && document.sharedWith.length > 0 && (
            <div className="mb-3">
              <h6>Currently shared with:</h6>
              <ListGroup>
                {document.sharedWith.map((share, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between">
                    <span>{share.user.name} ({share.user.email})</span>
                    <Badge bg={share.permission === 'edit' ? 'warning' : 'info'}>
                      <FiEdit3 className="me-1" />{share.permission}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
          
          <Form onSubmit={handleShare}>
            <Form.Group className="mb-3">
              <Form.Label>User Email</Form.Label>
              <Form.Control
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="Enter user email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Permission</Form.Label>
              <Form.Select
                value={sharePermission}
                onChange={(e) => setSharePermission(e.target.value)}
              >
                <option value="view">View Only</option>
                <option value="edit">Can Edit</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary">Share</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Version History Modal */}
      <Modal show={showVersionModal} onHide={() => setShowVersionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Version History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {document && document.versions.length > 0 ? (
            <ListGroup>
              {document.versions.reverse().map((version, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>Version {version.versionNumber}</strong>
                      <p className="mb-1 text-muted">{version.changes}</p>
                      <small className="text-muted">
                        By {version.author.name} on {new Date(version.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <Badge bg="secondary">v{version.versionNumber}</Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No version history available</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default DocumentEditorPage;