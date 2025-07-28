import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, ButtonGroup } from 'react-bootstrap';
import { FiPlus, FiFileText, FiEye, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';

function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    category: 'other',
    tags: '',
    isPublic: true
  });
  const { user } = useAuth();

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'meeting', label: 'Meeting Notes' },
    { value: 'project', label: 'Project Plans' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'process', label: 'Processes' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  const fetchTemplates = async () => {
    try {
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const res = await axios.get('/api/templates', { params });
      setTemplates(res.data);
    } catch (error) {
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const templateData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingTemplate) {
        const res = await axios.put(`/api/templates/${editingTemplate._id}`, templateData);
        setTemplates(templates.map(t => t._id === editingTemplate._id ? res.data : t));
        toast.success('Template updated successfully!');
      } else {
        const res = await axios.post('/api/templates', templateData);
        setTemplates([res.data, ...templates]);
        toast.success('Template created successfully!');
      }

      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save template');
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      content: template.content,
      category: template.category,
      tags: template.tags.join(', '),
      isPublic: template.isPublic
    });
    setShowModal(true);
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    try {
      await axios.delete(`/api/templates/${templateId}`);
      setTemplates(templates.filter(t => t._id !== templateId));
      toast.success('Template deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const handleUseTemplate = async (templateId) => {
    try {
      const res = await axios.post(`/api/templates/${templateId}/use`);
      // Store template content in localStorage for use in page editor
      localStorage.setItem('templateContent', res.data.content);
      toast.success('Template ready to use! Create a new page to apply it.');
    } catch (error) {
      toast.error('Failed to load template');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      content: '',
      category: 'other',
      tags: '',
      isPublic: true
    });
    setEditingTemplate(null);
    setShowModal(false);
  };

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

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
            <div>
              <h1><FiFileText className="me-2" />Page Templates</h1>
              <p className="text-muted">Create and manage reusable page templates</p>
            </div>
            {(user?.role === 'admin' || user?.role === 'editor') && (
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <FiPlus className="me-1" />New Template
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Category Filter */}
      <Row className="mb-4">
        <Col>
          <ButtonGroup>
            {categories.map(category => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'primary' : 'outline-primary'}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
      </Row>

      {/* Templates Grid */}
      <Row>
        {filteredTemplates.length === 0 ? (
          <Col>
            <Card>
              <Card.Body className="text-center py-5">
                <FiFileText size={48} className="text-muted mb-3" />
                <h5>No templates found</h5>
                <p className="text-muted">Create your first template to get started</p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filteredTemplates.map(template => (
            <Col md={6} lg={4} key={template._id} className="mb-4">
              <Card className="h-100">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <Badge bg="secondary">{template.category}</Badge>
                    <small className="text-muted">Used {template.usageCount} times</small>
                  </div>
                </Card.Header>
                <Card.Body>
                  <h6>{template.name}</h6>
                  {template.description && (
                    <p className="text-muted small">{template.description}</p>
                  )}
                  <div className="mb-2">
                    {template.tags.map(tag => (
                      <Badge key={tag} bg="light" text="dark" className="me-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <small className="text-muted">
                    by {template.author.name} • {new Date(template.createdAt).toLocaleDateString()}
                  </small>
                </Card.Body>
                <Card.Footer>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUseTemplate(template._id)}
                    >
                      <FiEye className="me-1" />Use Template
                    </Button>
                    {template.author._id === user?._id && (
                      <div>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEdit(template)}
                        >
                          <FiEdit3 />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(template._id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Create/Edit Template Modal */}
      <Modal show={showModal} onHide={resetForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Template Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Template Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Enter the template content here..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="tag1, tag2, tag3"
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Make this template public"
              checked={formData.isPublic}
              onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default TemplatesPage;