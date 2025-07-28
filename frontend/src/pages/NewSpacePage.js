import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiFolder } from 'react-icons/fi';
import axios from '../api/axios';

function NewSpacePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    key: '',
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

    // Auto-generate key from name
    if (name === 'name') {
      const key = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10);
      setFormData(prev => ({ ...prev, key }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/spaces', formData);
      toast.success('Space created successfully!');
      navigate(`/spaces/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create space');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header>
              <h4><FiFolder className="me-2" />Create New Space</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Space Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter space name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this space is for"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Space Key *</Form.Label>
                  <Form.Control
                    type="text"
                    name="key"
                    value={formData.key}
                    onChange={handleChange}
                    placeholder="SPACE"
                    maxLength={10}
                    required
                  />
                  <Form.Text className="text-muted">
                    Short identifier for the space (auto-generated from name)
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    label="Make this space public"
                  />
                  <Form.Text className="text-muted">
                    Public spaces can be viewed by all users
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Space'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/')}
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

export default NewSpacePage;