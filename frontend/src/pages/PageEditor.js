import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { pagesAPI, spacesAPI } from '../services/api';
import { toast } from 'react-toastify';

function PageEditor() {
  const { pageId, spaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [space, setSpace] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    changeNote: ''
  });

  const isEditing = !!pageId;

  useEffect(() => {
    if (spaceId) {
      fetchSpace();
    }
    if (isEditing) {
      fetchPage();
    } else {
      // Check for template content
      const templateContent = localStorage.getItem('templateContent');
      if (templateContent) {
        setFormData(prev => ({ ...prev, content: templateContent }));
        localStorage.removeItem('templateContent');
        toast.info('Template loaded successfully!');
      }
    }
  }, [pageId, spaceId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSpace = async () => {
    try {
      const res = await spacesAPI.getById(spaceId);
      setSpace(res.data);
    } catch (error) {
      toast.error('Failed to fetch space');
    }
  };

  const fetchPage = async () => {
    try {
      const res = await pagesAPI.getById(pageId);
      const page = res.data;
      setFormData({
        title: page.title,
        content: page.content,
        tags: page.tags.join(', '),
        changeNote: ''
      });
      if (!space) {
        setSpace(page.space);
      }
    } catch (error) {
      toast.error('Failed to fetch page');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const pageData = {
      title: formData.title,
      content: formData.content,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      changeNote: formData.changeNote || (isEditing ? 'Updated page' : 'Created page')
    };

    if (!isEditing) {
      pageData.spaceId = spaceId;
    }

    try {
      let response;
      if (isEditing) {
        response = await pagesAPI.update(pageId, pageData);
      } else {
        response = await pagesAPI.create(pageData);
      }

      toast.success(`Page ${isEditing ? 'updated' : 'created'} successfully!`);
      navigate(`/pages/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} page`);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>{isEditing ? 'Edit Page' : 'Create New Page'}</h2>
              {space && (
                <p className="text-muted">
                  in <Link to={`/spaces/${space._id}`}>{space.name}</Link>
                </p>
              )}
            </div>
            <Link to={isEditing ? `/pages/${pageId}` : `/spaces/${spaceId}`} className="btn btn-outline-secondary">
              <FiArrowLeft className="me-1" />Back
            </Link>
          </div>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Page Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter page title..."
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(content) => setFormData({...formData, content})}
                    modules={modules}
                    style={{ height: '400px', marginBottom: '50px' }}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>
                <h6>Page Settings</h6>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="tag1, tag2, tag3"
                  />
                  <Form.Text className="text-muted">
                    Separate tags with commas
                  </Form.Text>
                </Form.Group>

                {isEditing && (
                  <Form.Group className="mb-3">
                    <Form.Label>Change Note</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.changeNote}
                      onChange={(e) => setFormData({...formData, changeNote: e.target.value})}
                      placeholder="Describe what you changed..."
                    />
                  </Form.Group>
                )}

                <div className="d-grid">
                  <Button type="submit" variant="primary" disabled={loading}>
                    <FiSave className="me-1" />
                    {loading ? 'Saving...' : (isEditing ? 'Update Page' : 'Create Page')}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {user && (
              <Card>
                <Card.Header>
                  <h6>Author Info</h6>
                </Card.Header>
                <Card.Body>
                  <p className="mb-1"><strong>{user.name}</strong></p>
                  <p className="mb-0">
                    <Badge bg="secondary">{user.role}</Badge>
                  </p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default PageEditor;