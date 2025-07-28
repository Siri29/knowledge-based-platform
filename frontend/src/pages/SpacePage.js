import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Breadcrumb } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FiPlus, FiFolder, FiFile, FiEdit3 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { spacesAPI, pagesAPI } from '../services/api';
import { toast } from 'react-toastify';

function SpacePage() {
  const { spaceId } = useParams();
  const [space, setSpace] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSpaceData();
  }, [spaceId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSpaceData = async () => {
    try {
      const [spaceRes, pagesRes] = await Promise.all([
        spacesAPI.getById(spaceId),
        pagesAPI.getAll({ spaceId, parentId: 'null' })
      ]);
      setSpace(spaceRes.data);
      setPages(pagesRes.data);
    } catch (error) {
      toast.error('Failed to fetch space data');
    } finally {
      setLoading(false);
    }
  };

  const renderPageTree = (pageList, level = 0) => {
    return pageList.map(page => (
      <div key={page._id}>
        <ListGroup.Item 
          className="d-flex justify-content-between align-items-center"
          style={{ paddingLeft: `${20 + level * 20}px` }}
        >
          <div>
            <FiFile className="me-2" />
            <Link to={`/pages/${page._id}`}>{page.title}</Link>
            <small className="text-muted ms-2">
              by {page.author.name} • {new Date(page.updatedAt).toLocaleDateString()}
            </small>
          </div>
          <div>
            {(user?.role === 'admin' || user?.role === 'editor') && (
              <Link to={`/pages/${page._id}/edit`} className="btn btn-sm btn-outline-secondary">
                <FiEdit3 />
              </Link>
            )}
          </div>
        </ListGroup.Item>
      </div>
    ));
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status"></div>
      </Container>
    );
  }

  if (!space) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">Space not found</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{space.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>
                <FiFolder className="me-2" />
                {space.name}
                <span className="badge bg-secondary ms-2">{space.key}</span>
                {space.isPublic && <span className="badge bg-success ms-2">Public</span>}
              </h1>
              {space.description && (
                <p className="text-muted">{space.description}</p>
              )}
            </div>
            {(user?.role === 'admin' || user?.role === 'editor') && (
              <Link to={`/spaces/${spaceId}/new-page`} className="btn btn-primary">
                <FiPlus className="me-1" />New Page
              </Link>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>Pages in this Space</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {pages.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <FiFile size={48} className="mb-3" />
                  <p>No pages in this space yet.</p>
                  {(user?.role === 'admin' || user?.role === 'editor') && (
                    <Link to={`/spaces/${spaceId}/new-page`} className="btn btn-primary">
                      Create First Page
                    </Link>
                  )}
                </div>
              ) : (
                <ListGroup variant="flush">
                  {renderPageTree(pages)}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SpacePage;