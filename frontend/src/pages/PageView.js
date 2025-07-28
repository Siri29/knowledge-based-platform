import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Breadcrumb, Form, ListGroup } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FiEdit3, FiEye, FiClock, FiUser, FiTag, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { pagesAPI, commentsAPI } from '../services/api';
import { toast } from 'react-toastify';

function PageView() {
  const { pageId } = useParams();
  const [page, setPage] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPageData();
  }, [pageId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPageData = async () => {
    try {
      const [pageRes, commentsRes] = await Promise.all([
        pagesAPI.getById(pageId),
        commentsAPI.getByPage(pageId)
      ]);
      setPage(pageRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      toast.error('Failed to fetch page');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await commentsAPI.create({
        content: newComment,
        pageId: pageId
      });
      setComments([...comments, res.data]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentsAPI.delete(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted!');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status"></div>
      </Container>
    );
  }

  if (!page) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">Page not found</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/spaces/${page.space._id}` }}>
          {page.space.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{page.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="mb-0">{page.title}</h1>
                {(user?.role === 'admin' || user?.role === 'editor') && (
                  <Link to={`/pages/${pageId}/edit`} className="btn btn-primary">
                    <FiEdit3 className="me-1" />Edit
                  </Link>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <small className="text-muted">
                  <FiUser className="me-1" />
                  Created by {page.author.name} on {new Date(page.createdAt).toLocaleDateString()}
                  {page.lastModifiedBy && page.lastModifiedBy._id !== page.author._id && (
                    <span>
                      {' • '}Last modified by {page.lastModifiedBy.name} on {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </small>
              </div>

              <div 
                className="page-content"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </Card.Body>
          </Card>

          {/* Comments Section */}
          <Card>
            <Card.Header>
              <h5><FiMessageCircle className="me-2" />Comments ({comments.length})</h5>
            </Card.Header>
            <Card.Body>
              {/* Add Comment Form */}
              <Form onSubmit={handleAddComment} className="mb-4">
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-2" disabled={!newComment.trim()}>
                  Add Comment
                </Button>
              </Form>

              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-muted">No comments yet. Be the first to comment!</p>
              ) : (
                <ListGroup variant="flush">
                  {comments.map(comment => (
                    <ListGroup.Item key={comment._id}>
                      <div className="d-flex justify-content-between">
                        <div className="flex-grow-1">
                          <div className="mb-2">
                            <strong>{comment.author.name}</strong>
                            <small className="text-muted ms-2">
                              {new Date(comment.createdAt).toLocaleString()}
                              {comment.isEdited && ' (edited)'}
                            </small>
                          </div>
                          <p className="mb-0">{comment.content}</p>
                        </div>
                        {(user?._id === comment.author._id || user?.role === 'admin') && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          {/* Page Info */}
          <Card className="mb-4">
            <Card.Header>
              <h6>Page Information</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-2">
                <FiEye className="me-1" />
                <strong>Views:</strong> {page.viewCount}
              </div>
              <div className="mb-2">
                <FiClock className="me-1" />
                <strong>Created:</strong> {new Date(page.createdAt).toLocaleDateString()}
              </div>
              <div className="mb-2">
                <FiClock className="me-1" />
                <strong>Updated:</strong> {new Date(page.updatedAt).toLocaleDateString()}
              </div>
              <div className="mb-2">
                <strong>Status:</strong>{' '}
                <Badge bg={page.status === 'published' ? 'success' : 'warning'}>
                  {page.status}
                </Badge>
              </div>
            </Card.Body>
          </Card>

          {/* Tags */}
          {page.tags && page.tags.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h6><FiTag className="me-1" />Tags</h6>
              </Card.Header>
              <Card.Body>
                {page.tags.map(tag => (
                  <Badge key={tag} bg="secondary" className="me-1 mb-1">
                    {tag}
                  </Badge>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Version History */}
          <Card>
            <Card.Header>
              <h6>Version History</h6>
            </Card.Header>
            <Card.Body>
              <Button variant="outline-primary" size="sm" className="w-100">
                View All Versions
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PageView;