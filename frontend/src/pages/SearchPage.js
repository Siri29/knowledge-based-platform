import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Badge, Button } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiFile, FiUser, FiCalendar } from 'react-icons/fi';
import { pagesAPI, spacesAPI } from '../services/api';
import { toast } from 'react-toastify';
import SearchWithSuggestions from '../components/SearchWithSuggestions';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [filters, setFilters] = useState({
    spaceId: searchParams.get('space') || '',
    author: searchParams.get('author') || '',
    tags: searchParams.get('tags') || '',
    dateFrom: searchParams.get('from') || '',
    dateTo: searchParams.get('to') || ''
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSpaces();
    if (query) {
      handleSearch();
    }
  }, []);

  const fetchSpaces = async () => {
    try {
      const res = await spacesAPI.getAll();
      setSpaces(res.data);
    } catch (error) {
      toast.error('Failed to fetch spaces');
    }
  };

  const handleSearchWithQuery = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const params = { q: searchQuery, ...filters };
      Object.keys(params).forEach(key => params[key] === '' && delete params[key]);
      
      const res = await pagesAPI.search(searchQuery, filters.spaceId);
      setResults(res.data);
      
      // Update URL params
      setSearchParams(params);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    handleSearchWithQuery(query);
  };

  const clearFilters = () => {
    setFilters({
      spaceId: '',
      author: '',
      tags: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchParams({ q: query });
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2><FiSearch className="me-2" />Advanced Search</h2>
          
          {/* Search Form */}
          <Card className="mb-4">
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex gap-2">
                  <div className="flex-grow-1">
                    <SearchWithSuggestions
                      onSearch={(searchQuery) => {
                        setQuery(searchQuery);
                        handleSearchWithQuery(searchQuery);
                      }}
                      placeholder="Search pages, content, or tags..."
                    />
                  </div>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FiFilter />
                  </Button>
                </div>
              </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Space</Form.Label>
                        <Form.Select
                          value={filters.spaceId}
                          onChange={(e) => setFilters({...filters, spaceId: e.target.value})}
                        >
                          <option value="">All Spaces</option>
                          {spaces.map(space => (
                            <option key={space._id} value={space._id}>{space.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tags</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="tag1, tag2"
                          value={filters.tags}
                          onChange={(e) => setFilters({...filters, tags: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>From Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>To Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Button variant="outline-danger" size="sm" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </Col>
                  </Row>
                )}
            </Card.Body>
          </Card>

          {/* Search Results */}
          {results.length > 0 && (
            <div>
              <h4>Search Results ({results.length})</h4>
              {results.map(page => (
                <Card key={page._id} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div className="flex-grow-1">
                        <h5>
                          <FiFile className="me-2" />
                          <Link to={`/pages/${page._id}`}>{page.title}</Link>
                        </h5>
                        <p className="text-muted mb-2">
                          <FiUser className="me-1" />by {page.author.name} in{' '}
                          <Link to={`/spaces/${page.space._id}`}>{page.space.name}</Link>
                          <FiCalendar className="ms-3 me-1" />
                          {new Date(page.updatedAt).toLocaleDateString()}
                        </p>
                        <div className="mb-2">
                          {page.tags.map(tag => (
                            <Badge key={tag} bg="secondary" className="me-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="mb-0">
                          {page.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </p>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">{page.viewCount} views</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {query && results.length === 0 && !loading && (
            <Card>
              <Card.Body className="text-center">
                <FiSearch size={48} className="text-muted mb-3" />
                <h5>No results found</h5>
                <p className="text-muted">Try adjusting your search terms or filters</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchPage;