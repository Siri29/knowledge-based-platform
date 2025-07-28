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
    const adminHashedPassword = await bcrypt.hash('admin123', 10);
    const userHashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        name: 'Arjun Krishnan',
        email: 'admin@example.com',
        password: adminHashedPassword,
        plainPassword: 'admin123',
        role: 'admin'
      },
      {
        name: 'Priya Nair',
        email: 'editor@example.com',
        password: userHashedPassword,
        plainPassword: 'password123',
        role: 'editor'
      },
      {
        name: 'Ravi Sharma',
        email: 'viewer@example.com',
        password: userHashedPassword,
        plainPassword: 'password123',
        role: 'viewer'
      },
      {
        name: 'Lakshmi Menon',
        email: 'lakshmi@example.com',
        password: userHashedPassword,
        plainPassword: 'password123',
        role: 'editor'
      },
      {
        name: 'Karthik Reddy',
        email: 'karthik@example.com',
        password: userHashedPassword,
        plainPassword: 'password123',
        role: 'editor'
      },
      {
        name: 'Deepika Iyer',
        email: 'deepika@example.com',
        password: userHashedPassword,
        plainPassword: 'password123',
        role: 'viewer'
      },
      {
        name: 'Suresh Kumar',
        email: 'suresh@example.com',
        password: userHashedPassword,
        plainPassword: 'password123',
        role: 'editor'
      },
      {
        name: 'Ananya Pillai',
        email: 'ananya@example.com',
        password: userHashedPassword,
        plainPassword: 'password123',
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
      },
      {
        name: 'Mobile App Project',
        description: 'Private mobile application development docs',
        key: 'MOBILE',
        owner: users[3]._id,
        members: [
          { user: users[3]._id, role: 'admin' },
          { user: users[4]._id, role: 'editor' }
        ],
        isPublic: false
      },
      {
        name: 'Data Science Hub',
        description: 'Machine learning and analytics documentation',
        key: 'DATASCIENCE',
        owner: users[4]._id,
        members: [
          { user: users[4]._id, role: 'admin' },
          { user: users[6]._id, role: 'editor' },
          { user: users[5]._id, role: 'viewer' }
        ],
        isPublic: true
      },
      {
        name: 'DevOps Playbook',
        description: 'Infrastructure and deployment guides',
        key: 'DEVOPS',
        owner: users[6]._id,
        members: [
          { user: users[6]._id, role: 'admin' },
          { user: users[0]._id, role: 'editor' }
        ],
        isPublic: false
      },
      {
        name: 'UI/UX Design System',
        description: 'Design patterns and component library',
        key: 'DESIGN',
        owner: users[5]._id,
        members: [
          { user: users[5]._id, role: 'admin' },
          { user: users[7]._id, role: 'viewer' }
        ],
        isPublic: true
      },
      {
        name: 'Security Protocols',
        description: 'Confidential security procedures and policies',
        key: 'SECURITY',
        owner: users[0]._id,
        members: [
          { user: users[0]._id, role: 'admin' },
          { user: users[6]._id, role: 'editor' }
        ],
        isPublic: false
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
      },
      {
        name: 'Bug Report Template',
        description: 'Standard template for reporting bugs and issues',
        content: `<h1>Bug Report - [Bug Title]</h1>
        
        <h2>Bug Summary</h2>
        <p><strong>Description:</strong> [Brief description of the bug]</p>
        <p><strong>Severity:</strong> [Critical/High/Medium/Low]</p>
        <p><strong>Priority:</strong> [P1/P2/P3/P4]</p>
        <p><strong>Reporter:</strong> [Your name]</p>
        <p><strong>Date:</strong> [Date reported]</p>
        
        <h2>Environment</h2>
        <ul>
          <li><strong>OS:</strong> [Operating System]</li>
          <li><strong>Browser:</strong> [Browser and version]</li>
          <li><strong>App Version:</strong> [Version number]</li>
          <li><strong>Device:</strong> [Desktop/Mobile/Tablet]</li>
        </ul>
        
        <h2>Steps to Reproduce</h2>
        <ol>
          <li>[Step 1]</li>
          <li>[Step 2]</li>
          <li>[Step 3]</li>
        </ol>
        
        <h2>Expected Behavior</h2>
        <p>[What should happen]</p>
        
        <h2>Actual Behavior</h2>
        <p>[What actually happens]</p>
        
        <h2>Screenshots/Videos</h2>
        <p>[Attach relevant media]</p>
        
        <h2>Additional Information</h2>
        <p>[Any other relevant details]</p>`,
        category: 'process',
        author: users[4]._id,
        tags: ['bug', 'report', 'issue', 'template'],
        usageCount: 23
      },
      {
        name: 'Feature Request Template',
        description: 'Template for requesting new features',
        content: `<h1>Feature Request - [Feature Name]</h1>
        
        <h2>Feature Summary</h2>
        <p><strong>Feature Title:</strong> [Clear, concise title]</p>
        <p><strong>Requested By:</strong> [Your name/team]</p>
        <p><strong>Date:</strong> [Date of request]</p>
        <p><strong>Priority:</strong> [High/Medium/Low]</p>
        
        <h2>Problem Statement</h2>
        <p>[What problem does this feature solve?]</p>
        
        <h2>Proposed Solution</h2>
        <p>[Describe your proposed solution]</p>
        
        <h2>User Stories</h2>
        <ul>
          <li>As a [user type], I want [functionality] so that [benefit]</li>
          <li>As a [user type], I want [functionality] so that [benefit]</li>
        </ul>
        
        <h2>Acceptance Criteria</h2>
        <ul>
          <li>[ ] [Criteria 1]</li>
          <li>[ ] [Criteria 2]</li>
          <li>[ ] [Criteria 3]</li>
        </ul>
        
        <h2>Mockups/Wireframes</h2>
        <p>[Attach design mockups if available]</p>
        
        <h2>Technical Considerations</h2>
        <ul>
          <li>[Technical requirement 1]</li>
          <li>[Technical requirement 2]</li>
        </ul>
        
        <h2>Business Impact</h2>
        <p>[How will this feature impact the business?]</p>`,
        category: 'project',
        author: users[3]._id,
        tags: ['feature', 'request', 'enhancement', 'template'],
        usageCount: 18
      },
      {
        name: 'Release Notes Template',
        description: 'Template for documenting software releases',
        content: `<h1>Release Notes - Version [X.Y.Z]</h1>
        
        <h2>Release Information</h2>
        <ul>
          <li><strong>Version:</strong> [X.Y.Z]</li>
          <li><strong>Release Date:</strong> [Date]</li>
          <li><strong>Release Type:</strong> [Major/Minor/Patch]</li>
          <li><strong>Release Manager:</strong> [Name]</li>
        </ul>
        
        <h2>🚀 New Features</h2>
        <ul>
          <li>[Feature 1 description]</li>
          <li>[Feature 2 description]</li>
        </ul>
        
        <h2>✨ Improvements</h2>
        <ul>
          <li>[Improvement 1]</li>
          <li>[Improvement 2]</li>
        </ul>
        
        <h2>🐛 Bug Fixes</h2>
        <ul>
          <li>Fixed [bug description]</li>
          <li>Resolved [issue description]</li>
        </ul>
        
        <h2>⚠️ Breaking Changes</h2>
        <ul>
          <li>[Breaking change 1 - migration steps]</li>
        </ul>
        
        <h2>📋 Known Issues</h2>
        <ul>
          <li>[Known issue 1 - workaround]</li>
        </ul>
        
        <h2>🔧 Technical Details</h2>
        <ul>
          <li><strong>Dependencies Updated:</strong> [List updated dependencies]</li>
          <li><strong>Database Changes:</strong> [Any schema changes]</li>
          <li><strong>API Changes:</strong> [New/modified endpoints]</li>
        </ul>
        
        <h2>📥 Download/Deployment</h2>
        <p>[Instructions for downloading or deploying this version]</p>`,
        category: 'documentation',
        author: users[6]._id,
        tags: ['release', 'notes', 'changelog', 'template'],
        usageCount: 9
      },
      {
        name: 'Onboarding Checklist Template',
        description: 'Template for new employee onboarding',
        content: `<h1>Employee Onboarding Checklist</h1>
        
        <h2>New Employee Information</h2>
        <ul>
          <li><strong>Name:</strong> [Employee Name]</li>
          <li><strong>Position:</strong> [Job Title]</li>
          <li><strong>Department:</strong> [Department]</li>
          <li><strong>Start Date:</strong> [Date]</li>
          <li><strong>Manager:</strong> [Manager Name]</li>
          <li><strong>Buddy:</strong> [Assigned Buddy]</li>
        </ul>
        
        <h2>Pre-First Day (HR)</h2>
        <ul>
          <li>[ ] Send welcome email with first day details</li>
          <li>[ ] Prepare workspace and equipment</li>
          <li>[ ] Create accounts (email, systems, tools)</li>
          <li>[ ] Prepare welcome packet</li>
          <li>[ ] Schedule first day meetings</li>
        </ul>
        
        <h2>First Day</h2>
        <ul>
          <li>[ ] Welcome and office tour</li>
          <li>[ ] Complete paperwork and documentation</li>
          <li>[ ] IT setup (laptop, accounts, access)</li>
          <li>[ ] Meet with manager and team</li>
          <li>[ ] Review job description and expectations</li>
          <li>[ ] Lunch with team/buddy</li>
        </ul>
        
        <h2>First Week</h2>
        <ul>
          <li>[ ] Complete mandatory training</li>
          <li>[ ] Review company policies and procedures</li>
          <li>[ ] Set up development environment</li>
          <li>[ ] Attend team meetings</li>
          <li>[ ] Begin initial projects/tasks</li>
          <li>[ ] Schedule regular 1:1s with manager</li>
        </ul>
        
        <h2>First Month</h2>
        <ul>
          <li>[ ] Complete role-specific training</li>
          <li>[ ] Meet with key stakeholders</li>
          <li>[ ] First project milestone</li>
          <li>[ ] 30-day check-in with HR</li>
          <li>[ ] Feedback session with manager</li>
        </ul>
        
        <h2>90-Day Review</h2>
        <ul>
          <li>[ ] Performance review</li>
          <li>[ ] Goal setting for next quarter</li>
          <li>[ ] Feedback collection</li>
          <li>[ ] Career development discussion</li>
        </ul>`,
        category: 'process',
        author: users[0]._id,
        tags: ['onboarding', 'hr', 'checklist', 'template'],
        usageCount: 7
      },
      {
        name: 'Technical Design Document Template',
        description: 'Template for technical design specifications',
        content: `<h1>Technical Design Document - [System/Feature Name]</h1>
        
        <h2>Document Information</h2>
        <ul>
          <li><strong>Author:</strong> [Author Name]</li>
          <li><strong>Date:</strong> [Date]</li>
          <li><strong>Version:</strong> [Version]</li>
          <li><strong>Status:</strong> [Draft/Review/Approved]</li>
          <li><strong>Reviewers:</strong> [List of reviewers]</li>
        </ul>
        
        <h2>Overview</h2>
        <p>[High-level description of the system or feature]</p>
        
        <h2>Goals and Objectives</h2>
        <ul>
          <li>[Primary goal 1]</li>
          <li>[Primary goal 2]</li>
        </ul>
        
        <h2>Requirements</h2>
        <h3>Functional Requirements</h3>
        <ul>
          <li>[Functional requirement 1]</li>
          <li>[Functional requirement 2]</li>
        </ul>
        
        <h3>Non-Functional Requirements</h3>
        <ul>
          <li><strong>Performance:</strong> [Performance requirements]</li>
          <li><strong>Scalability:</strong> [Scalability requirements]</li>
          <li><strong>Security:</strong> [Security requirements]</li>
          <li><strong>Availability:</strong> [Availability requirements]</li>
        </ul>
        
        <h2>System Architecture</h2>
        <p>[High-level architecture description]</p>
        <p>[Include architecture diagrams]</p>
        
        <h2>Detailed Design</h2>
        <h3>Components</h3>
        <ul>
          <li><strong>[Component 1]:</strong> [Description and responsibilities]</li>
          <li><strong>[Component 2]:</strong> [Description and responsibilities]</li>
        </ul>
        
        <h3>Data Models</h3>
        <p>[Database schema and data structures]</p>
        
        <h3>APIs</h3>
        <p>[API specifications and endpoints]</p>
        
        <h2>Implementation Plan</h2>
        <ul>
          <li><strong>Phase 1:</strong> [Description and timeline]</li>
          <li><strong>Phase 2:</strong> [Description and timeline]</li>
        </ul>
        
        <h2>Testing Strategy</h2>
        <ul>
          <li><strong>Unit Testing:</strong> [Approach]</li>
          <li><strong>Integration Testing:</strong> [Approach]</li>
          <li><strong>Performance Testing:</strong> [Approach]</li>
        </ul>
        
        <h2>Risks and Mitigation</h2>
        <ul>
          <li><strong>Risk:</strong> [Risk description] - <strong>Mitigation:</strong> [Mitigation strategy]</li>
        </ul>
        
        <h2>Monitoring and Observability</h2>
        <ul>
          <li>[Monitoring requirements]</li>
          <li>[Logging strategy]</li>
          <li>[Alerting setup]</li>
        </ul>`,
        category: 'documentation',
        author: users[6]._id,
        tags: ['technical', 'design', 'architecture', 'template'],
        usageCount: 11
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
    console.log('Admin (Arjun Krishnan): admin@example.com / admin123');
    console.log('Editor (Priya Nair): editor@example.com / password123');
    console.log('Viewer (Ravi Sharma): viewer@example.com / password123');
    console.log('Editor (Lakshmi Menon): lakshmi@example.com / password123');
    console.log('Editor (Karthik Reddy): karthik@example.com / password123');
    console.log('Viewer (Deepika Iyer): deepika@example.com / password123');
    console.log('Editor (Suresh Kumar): suresh@example.com / password123');
    console.log('Viewer (Ananya Pillai): ananya@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedData;