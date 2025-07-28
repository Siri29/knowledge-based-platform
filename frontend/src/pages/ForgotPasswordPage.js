import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetData, setResetData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setResetData(response.data);
      setSuccess(true);
      toast.success('Password reset link generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Forgot Password</h2>
              
              {success ? (
                <Alert variant="success">
                  <h5>Reset Link Generated!</h5>
                  <p>In demo mode, use this link to reset your password:</p>
                  {resetData && (
                    <div className="mb-3">
                      <Link 
                        to={`/reset-password/${resetData.resetToken}`} 
                        className="btn btn-warning mb-2 d-block"
                      >
                        Reset Password Now
                      </Link>
                      <small className="text-muted">
                        Token: {resetData.resetToken}
                      </small>
                    </div>
                  )}
                  <Link to="/login" className="btn btn-primary">
                    Back to Login
                  </Link>
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Email'}
                  </Button>
                </Form>
              )}
              
              <div className="text-center mt-3">
                <Link to="/login">Back to Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPasswordPage;