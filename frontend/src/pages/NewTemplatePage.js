import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import axios from '../api/axios';

function NewTemplatePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    category: 'other',
    tags: '',
    isPublic: true
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const templateData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      await axios.post('/api/templates', templateData);
      toast.success('Template created successfully!');
      navigate('/templates');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card>
            <Card.Header>
              <h4><FiPlus className="me-2" />Create New Template</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Template Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter template name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this template is for"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="meeting">Meeting</option>
                    <option value="project">Project</option>
                    <option value="documentation">Documentation</option>
                    <option value="process">Process</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Template Content *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={12}
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Enter your template content here. You can use HTML tags for formatting."
                    required
                  />
                  <Form.Text className="text-muted">
                    Use HTML tags for formatting. Example: &lt;h1&gt;Title&lt;/h1&gt;, &lt;p&gt;Paragraph&lt;/p&gt;
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="tag1, tag2, tag3"
                  />
                  <Form.Text className="text-muted">
                    Separate tags with commas
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    label="Make this template public"
                  />
                  <Form.Text className="text-muted">
                    Public templates can be used by all users
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Template'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/templates')}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default NewTemplatePage;