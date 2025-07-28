const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Space = require('../models/Space');
const Page = require('../models/Page');
const Template = require('../models/Template');
const Comment = require('../models/Comment');

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Space.deleteMany({});
    await Page.deleteMany({});
    await Template.deleteMany({});
    await Comment.deleteMany({});

    console.log('Cleared existing data...');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        name: 'Arjun Krishnan',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Priya Nair',
        email: 'editor@example.com',
        password: hashedPassword,
        role: 'editor'
      },
      {
        name: 'Ravi Sharma',
        email: 'viewer@example.com',
        password: hashedPassword,
        role: 'viewer'
      }
    ]);

    console.log('Created users...');

    // Create spaces
    const spaces = await Space.create([
      {
        name: 'Engineering Team',
        description: 'Technical documentation and engineering processes',
        key: 'ENG',
        owner: users[0]._id,
        members: [
          { user: users[0]._id, role: 'admin' },
          { user: users[1]._id, role: 'editor' },
          { user: users[2]._id, role: 'viewer' }
        ],
        isPublic: true
      },
      {
        name: 'Product Management',
        description: 'Product requirements, roadmaps, and specifications',
        key: 'PROD',
        owner: users[1]._id,
        members: [
          { user: users[1]._id, role: 'admin' },
          { user: users[0]._id, role: 'editor' }
        ],
        isPublic: false
      },
      {
        name: 'Company Wiki',
        description: 'General company information and policies',
        key: 'WIKI',
        owner: users[0]._id,
        members: [
          { user: users[0]._id, role: 'admin' },
          { user: users[1]._id, role: 'editor' },
          { user: users[2]._id, role: 'viewer' }
        ],
        isPublic: true
      }
    ]);

    console.log('Created spaces...');

    // Create pages
    const pages = await Page.create([
      {
        title: 'Getting Started Guide',
        content: `<h1>Welcome to Our Knowledge Base</h1>
        <p>This guide will help you get started with our platform and understand how to contribute effectively.</p>
        
        <h2>Quick Start</h2>
        <ol>
          <li>Create your first space</li>
          <li>Add team members</li>
          <li>Start documenting your processes</li>
        </ol>
        
        <h2>Best Practices</h2>
        <ul>
          <li>Use clear, descriptive titles</li>
          <li>Add relevant tags</li>
          <li>Keep content up to date</li>
          <li>Use templates for consistency</li>
        </ul>`,
        slug: 'getting-started-guide',
        space: spaces[2]._id,
        author: users[0]._id,
        lastModifiedBy: users[0]._id,
        tags: ['guide', 'onboarding', 'basics'],
        status: 'published',
        viewCount: 45
      },
      {
        title: 'API Documentation',
        content: `<h1>REST API Documentation</h1>
        <p>Complete documentation for our REST API endpoints.</p>
        
        <h2>Authentication</h2>
        <p>All API requests require authentication using JWT tokens.</p>
        <pre><code>Authorization: Bearer &lt;your-jwt-token&gt;</code></pre>
        
        <h2>Endpoints</h2>
        <h3>Users</h3>
        <ul>
          <li><code>GET /api/users</code> - Get all users</li>
          <li><code>POST /api/users</code> - Create new user</li>
          <li><code>PUT /api/users/:id</code> - Update user</li>
        </ul>
        
        <h3>Pages</h3>
        <ul>
          <li><code>GET /api/pages</code> - Get all pages</li>
          <li><code>POST /api/pages</code> - Create new page</li>
          <li><code>PUT /api/pages/:id</code> - Update page</li>
        </ul>`,
        slug: 'api-documentation',
        space: spaces[0]._id,
        author: users[1]._id,
        lastModifiedBy: users[1]._id,
        tags: ['api', 'documentation', 'development'],
        status: 'published',
        viewCount: 78
      },
      {
        title: 'Product Roadmap Q1 2024',
        content: `<h1>Product Roadmap - Q1 2024</h1>
        <p>Our strategic priorities and planned features for the first quarter.</p>
        
        <h2>Key Objectives</h2>
        <ul>
          <li>Improve user experience</li>
          <li>Enhance platform performance</li>
          <li>Add collaboration features</li>
        </ul>
        
        <h2>Planned Features</h2>
        <h3>January</h3>
        <ul>
          <li>Real-time collaboration</li>
          <li>Advanced search filters</li>
        </ul>
        
        <h3>February</h3>
        <ul>
          <li>Mobile app improvements</li>
          <li>Integration with Slack</li>
        </ul>
        
        <h3>March</h3>
        <ul>
          <li>Analytics dashboard</li>
          <li>Custom themes</li>
        </ul>`,
        slug: 'product-roadmap-q1-2024',
        space: spaces[1]._id,
        author: users[1]._id,
        lastModifiedBy: users[1]._id,
        tags: ['roadmap', 'planning', 'features'],
        status: 'published',
        viewCount: 32
      },
      {
        title: 'Code Review Guidelines',
        content: `<h1>Code Review Guidelines</h1>
        <p>Best practices for conducting effective code reviews.</p>
        
        <h2>Before Submitting</h2>
        <ul>
          <li>Test your changes thoroughly</li>
          <li>Write clear commit messages</li>
          <li>Update documentation if needed</li>
          <li>Run linting and formatting tools</li>
        </ul>
        
        <h2>Review Checklist</h2>
        <ul>
          <li>Code follows style guidelines</li>
          <li>Logic is clear and efficient</li>
          <li>Edge cases are handled</li>
          <li>Tests are included</li>
          <li>Security considerations addressed</li>
        </ul>
        
        <h2>Feedback Guidelines</h2>
        <ul>
          <li>Be constructive and specific</li>
          <li>Explain the "why" behind suggestions</li>
          <li>Acknowledge good practices</li>
          <li>Focus on the code, not the person</li>
        </ul>`,
        slug: 'code-review-guidelines',
        space: spaces[0]._id,
        author: users[0]._id,
        lastModifiedBy: users[0]._id,
        tags: ['code-review', 'development', 'best-practices'],
        status: 'published',
        viewCount: 56
      },
      {
        title: 'Remote Work Policy',
        content: `<h1>Remote Work Policy</h1>
        <p>Guidelines and expectations for remote work arrangements.</p>
        
        <h2>Eligibility</h2>
        <p>All full-time employees are eligible for remote work after completing their probationary period.</p>
        
        <h2>Work Hours</h2>
        <ul>
          <li>Core hours: 10 AM - 3 PM (local time)</li>
          <li>Flexible start/end times</li>
          <li>Minimum 4 hours overlap with team</li>
        </ul>
        
        <h2>Communication</h2>
        <ul>
          <li>Daily standup meetings</li>
          <li>Weekly team check-ins</li>
          <li>Slack for quick questions</li>
          <li>Video calls for complex discussions</li>
        </ul>
        
        <h2>Equipment</h2>
        <p>Company provides:</p>
        <ul>
          <li>Laptop and accessories</li>
          <li>Internet allowance</li>
          <li>Ergonomic equipment stipend</li>
        </ul>`,
        slug: 'remote-work-policy',
        space: spaces[2]._id,
        author: users[0]._id,
        lastModifiedBy: users[0]._id,
        tags: ['policy', 'remote-work', 'hr'],
        status: 'published',
        viewCount: 89
      }
    ]);

    console.log('Created pages...');

    // Create templates
    await Template.create([
      {
        name: 'Meeting Notes Template',
        description: 'Standard template for recording meeting notes',
        content: `<h1>Meeting Notes - [Meeting Title]</h1>
        
        <h2>Meeting Details</h2>
        <ul>
          <li><strong>Date:</strong> [Date]</li>
          <li><strong>Time:</strong> [Time]</li>
          <li><strong>Attendees:</strong> [List of attendees]</li>
          <li><strong>Meeting Type:</strong> [Weekly sync, Planning, Review, etc.]</li>
        </ul>
        
        <h2>Agenda</h2>
        <ol>
          <li>[Agenda item 1]</li>
          <li>[Agenda item 2]</li>
          <li>[Agenda item 3]</li>
        </ol>
        
        <h2>Discussion Points</h2>
        <ul>
          <li>[Key discussion point 1]</li>
          <li>[Key discussion point 2]</li>
        </ul>
        
        <h2>Action Items</h2>
        <ul>
          <li>[ ] [Action item] - Assigned to: [Name] - Due: [Date]</li>
          <li>[ ] [Action item] - Assigned to: [Name] - Due: [Date]</li>
        </ul>
        
        <h2>Next Steps</h2>
        <p>[Summary of next steps and follow-up actions]</p>`,
        category: 'meeting',
        author: users[0]._id,
        tags: ['meeting', 'notes', 'template'],
        usageCount: 12
      },
      {
        name: 'Project Plan Template',
        description: 'Template for creating project plans and specifications',
        content: `<h1>Project Plan - [Project Name]</h1>
        
        <h2>Project Overview</h2>
        <p><strong>Project Description:</strong> [Brief description of the project]</p>
        <p><strong>Project Owner:</strong> [Name]</p>
        <p><strong>Start Date:</strong> [Date]</p>
        <p><strong>Target Completion:</strong> [Date]</p>
        
        <h2>Objectives</h2>
        <ul>
          <li>[Primary objective 1]</li>
          <li>[Primary objective 2]</li>
          <li>[Primary objective 3]</li>
        </ul>
        
        <h2>Scope</h2>
        <h3>In Scope</h3>
        <ul>
          <li>[What's included in the project]</li>
        </ul>
        
        <h3>Out of Scope</h3>
        <ul>
          <li>[What's explicitly not included]</li>
        </ul>
        
        <h2>Timeline & Milestones</h2>
        <ul>
          <li><strong>Phase 1:</strong> [Description] - [Date]</li>
          <li><strong>Phase 2:</strong> [Description] - [Date]</li>
          <li><strong>Phase 3:</strong> [Description] - [Date]</li>
        </ul>
        
        <h2>Resources Required</h2>
        <ul>
          <li><strong>Team Members:</strong> [List of team members and roles]</li>
          <li><strong>Budget:</strong> [Budget requirements]</li>
          <li><strong>Tools/Software:</strong> [Required tools]</li>
        </ul>
        
        <h2>Risks & Mitigation</h2>
        <ul>
          <li><strong>Risk:</strong> [Risk description] - <strong>Mitigation:</strong> [How to address]</li>
        </ul>`,
        category: 'project',
        author: users[1]._id,
        tags: ['project', 'planning', 'template'],
        usageCount: 8
      },
      {
        name: 'API Documentation Template',
        description: 'Template for documenting API endpoints',
        content: `<h1>[API Name] Documentation</h1>
        
        <h2>Overview</h2>
        <p>[Brief description of the API and its purpose]</p>
        
        <h2>Base URL</h2>
        <pre><code>[https://api.example.com/v1]</code></pre>
        
        <h2>Authentication</h2>
        <p>[Description of authentication method]</p>
        <pre><code>Authorization: Bearer [token]</code></pre>
        
        <h2>Endpoints</h2>
        
        <h3>[Endpoint Name]</h3>
        <p><strong>Method:</strong> [GET/POST/PUT/DELETE]</p>
        <p><strong>URL:</strong> <code>[/endpoint/path]</code></p>
        <p><strong>Description:</strong> [What this endpoint does]</p>
        
        <h4>Parameters</h4>
        <ul>
          <li><strong>[parameter_name]</strong> (required/optional) - [Description]</li>
        </ul>
        
        <h4>Request Example</h4>
        <pre><code>[Request example]</code></pre>
        
        <h4>Response Example</h4>
        <pre><code>[Response example]</code></pre>
        
        <h4>Error Codes</h4>
        <ul>
          <li><strong>400:</strong> Bad Request - [Description]</li>
          <li><strong>401:</strong> Unauthorized - [Description]</li>
          <li><strong>404:</strong> Not Found - [Description]</li>
        </ul>`,
        category: 'documentation',
        author: users[1]._id,
        tags: ['api', 'documentation', 'template'],
        usageCount: 15
      }
    ]);

    console.log('Created templates...');

    // Create comments
    await Comment.create([
      {
        content: 'Great guide! This really helped me get started quickly.',
        page: pages[0]._id,
        author: users[2]._id
      },
      {
        content: 'Should we add a section about troubleshooting common issues?',
        page: pages[0]._id,
        author: users[1]._id
      },
      {
        content: 'The API documentation is very comprehensive. Thanks for putting this together!',
        page: pages[1]._id,
        author: users[0]._id
      },
      {
        content: 'We should update the roadmap based on the latest stakeholder feedback.',
        page: pages[2]._id,
        author: users[0]._id
      }
    ]);

    console.log('Created comments...');
    console.log('✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin (Arjun Krishnan): admin@example.com / password123');
    console.log('Editor (Priya Nair): editor@example.com / password123');
    console.log('Viewer (Ravi Sharma): viewer@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedData;