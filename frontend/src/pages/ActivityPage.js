import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Form, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiActivity, FiFile, FiFolder, FiMessageCircle, FiFileText, FiUser, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';

function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const actionIcons = {
    created: { icon: FiFile, color: 'success', text: 'created' },
    updated: { icon: FiFile, color: 'primary', text: 'updated' },
    deleted: { icon: FiFile, color: 'danger', text: 'deleted' },
    viewed: { icon: FiFile, color: 'info', text: 'viewed' },
    commented: { icon: FiMessageCircle, color: 'warning', text: 'commented on' }
  };

  const targetIcons = {
    page: FiFile,
    space: FiFolder,
    comment: FiMessageCircle,
    template: FiFileText
  };

  useEffect(() => {
    fetchActivities();
  }, [filter, timeRange]);

  const fetchActivities = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.filter = filter;
      if (timeRange !== 'all') params.timeRange = timeRange;

      const res = await axios.get('/api/activities', { params });
      setActivities(res.data);
    } catch (error) {
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityDate.toLocaleDateString();
  };

  const renderActivityItem = (activity) => {
    const actionConfig = actionIcons[activity.action];
    const TargetIcon = targetIcons[activity.target];
    const ActionIcon = actionConfig.icon;

    return (
      <ListGroup.Item key={activity._id} className="border-0 px-0">
        <div className="d-flex align-items-start">
          <div className="me-3">
            <div className="d-flex align-items-center justify-content-center bg-light rounded-circle" 
                 style={{ width: '40px', height: '40px' }}>
              <ActionIcon size={20} className={`text-${actionConfig.color}`} />
            </div>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="mb-1">
                  <span className="fw-bold">
                    {activity.user?.name || 'Unknown User'}
                  </span>
                  {' '}{actionConfig.text}{' '}
                  <TargetIcon size={16} className="mx-1" />
                  <Link to={getTargetLink(activity)} className="text-decoration-none">
                    {activity.targetTitle}
                  </Link>
                  {activity.space && (
                    <span className="text-muted">
                      {' '}in{' '}
                      <span className="text-decoration-none">
                        {activity.space.name}
                      </span>
                    </span>
                  )}
                </p>
                <div className="d-flex align-items-center text-muted small">
                  <FiClock size={14} className="me-1" />
                  {getRelativeTime(activity.createdAt)}
                  <Badge bg="light" text="dark" className="ms-2">
                    {activity.target}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ListGroup.Item>
    );
  };

  const getTargetLink = (activity) => {
    switch (activity.target) {
      case 'page':
        return `/pages/${activity.targetId}`;
      case 'space':
        return `/spaces/${activity.targetId}`;
      case 'template':
        return `/templates`;
      default:
        return '#';
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
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1><FiActivity className="me-2" />Activity Feed</h1>
              <p className="text-muted">Stay updated with recent changes and activities</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Filter by Action</Form.Label>
                    <ButtonGroup className="w-100">
                      <Button
                        variant={filter === 'all' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilter('all')}
                      >
                        All
                      </Button>
                      <Button
                        variant={filter === 'my' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilter('my')}
                      >
                        My Activity
                      </Button>
                      <Button
                        variant={filter === 'team' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilter('team')}
                      >
                        Team Activity
                      </Button>
                    </ButtonGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Time Range</Form.Label>
                    <Form.Select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                    >
                      <option value="day">Last 24 hours</option>
                      <option value="week">Last week</option>
                      <option value="month">Last month</option>
                      <option value="all">All time</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Activity Feed */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activities</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {activities.length === 0 ? (
                <div className="text-center py-5">
                  <FiActivity size={48} className="text-muted mb-3" />
                  <h5>No activities found</h5>
                  <p className="text-muted">No recent activities match your current filters</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {activities.filter(activity => activity.user).map(renderActivityItem)}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ActivityPage;