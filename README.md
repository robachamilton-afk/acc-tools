# ACC Tools - Site Inspection & Data Scraper Product Suite

**Autodesk Construction Cloud (ACC) integration tools** designed to streamline construction project data management and site inspections.

## Overview

ACC Tools is a **product-focused monorepo** containing tightly integrated applications for construction professionals working with Autodesk Construction Cloud. The suite combines powerful document scraping capabilities with intuitive site inspection interfaces, designed for commercialization as a tiered product offering.

## Product Vision

Transform the way construction teams interact with design documentation and conduct site inspections by:
- **Automating data extraction** from design documents (PDFs, DWGs, DOCX)
- **Converting unstructured data** into structured ACC data models
- **Streamlining site inspections** with mobile-friendly interfaces
- **Integrating seamlessly** with Autodesk Construction Cloud workflows

## Product Packages

### 1. **Data Scraper** (`packages/scraper`)
Intelligent document parsing and data extraction engine.

**Status:** 🔨 In Development  
**Monetization:** Tiered product (Basic/Pro/Enterprise)  

**Key Features:**
- Multi-format document parsing (PDF, DWG, DOCX, Excel)
- Intelligent data extraction using ML/NLP
- Batch processing for large document sets
- Custom extraction rules and templates
- Quality assurance and validation
- Export to ACC data models

**Use Cases:**
- Extract specifications from PDF documents
- Parse drawing metadata from DWG files
- Convert Excel schedules to structured data
- Bulk process project documentation

### 2. **Site Inspection App** (`packages/site-inspection`)
Mobile-optimized site inspection and reporting interface.

**Status:** 🔨 In Development  
**Monetization:** Tiered product (Basic/Pro/Enterprise)  

**Key Features:**
- Mobile-responsive inspection forms
- Photo capture and annotation
- Offline mode with sync
- Custom inspection templates
- Real-time collaboration
- ACC integration for instant updates
- Report generation (PDF/Excel)

**Use Cases:**
- Daily site inspections
- Quality control checks
- Safety audits
- Progress tracking
- Defect management

### 3. **Unified API** (`packages/api`)
Backend API serving both scraper and inspection applications.

**Key Features:**
- RESTful API architecture
- JWT authentication
- Role-based access control
- Webhook support for ACC events
- Rate limiting and usage tracking
- Multi-tenant architecture

## Technology Stack

### Backend
- **Python 3.11+** - Core language
- **FastAPI** - Web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and job queue
- **Celery** - Asynchronous task processing
- **PyPDF2, python-docx** - Document parsing
- **spaCy, transformers** - NLP/ML for intelligent extraction

### Frontend
- **React 18+** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Query** - Data fetching
- **PWA** - Progressive Web App for offline support

### Integrations
- **Autodesk Construction Cloud API** - Primary integration
- **Autodesk Forge API** - Document viewing and conversion
- **AWS S3** - File storage (production)

### Infrastructure
- **Docker** - Containerization
- **Kubernetes** - Orchestration (production)
- **GitHub Actions** - CI/CD

## Repository Structure

```
acc-tools/
├── docs/                          # Comprehensive documentation
│   ├── ARCHITECTURE.md            # System design
│   ├── API_CONTRACTS.md           # API documentation
│   ├── ACC_INTEGRATION.md         # ACC integration guide
│   ├── DEPLOYMENT.md              # Deployment guide
│   └── MONETIZATION.md            # Product tiers and pricing
├── packages/                      # Monorepo packages
│   ├── scraper/                   # Data scraper package
│   │   ├── backend/               # Scraper backend
│   │   ├── frontend/              # Scraper UI
│   │   └── ml-models/             # ML models for extraction
│   ├── site-inspection/           # Site inspection package
│   │   ├── backend/               # Inspection backend
│   │   ├── frontend/              # Inspection UI (PWA)
│   │   └── mobile/                # Mobile app (future)
│   ├── shared/                    # Shared utilities
│   │   ├── components/            # React components
│   │   ├── utils/                 # Python/JS utilities
│   │   ├── types/                 # TypeScript types
│   │   └── database/              # Database models
│   └── api/                       # Unified backend API
│       ├── auth/                  # Authentication
│       ├── routes/                # API routes
│       └── integrations/          # ACC/Forge integrations
├── docker/                        # Docker configurations
│   ├── docker-compose.yml         # Development setup
│   ├── docker-compose.prod.yml    # Production setup
│   ├── Dockerfile.api             # API container
│   ├── Dockerfile.scraper         # Scraper container
│   └── Dockerfile.frontend        # Frontend container
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose**
- **Node.js 18+** and **pnpm**
- **Python 3.11+**
- **Autodesk Construction Cloud account** (for ACC integration)
- **Forge API credentials** (for document viewing)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/robachamilton-afk/acc-tools.git
   cd acc-tools
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your ACC/Forge credentials
   ```

3. **Start services:**
   ```bash
   docker-compose up -d
   ```

4. **Access applications:**
   - Data Scraper: http://localhost:3001
   - Site Inspection: http://localhost:3002
   - API Documentation: http://localhost:8000/docs

### Development Setup

See [docs/DEVELOPMENT_SETUP.md](docs/DEVELOPMENT_SETUP.md) for detailed local development instructions.

## Product Tiers & Monetization

### Free Tier
- 10 documents/month scraping
- Basic site inspection forms
- 1 user
- Community support

### Basic Tier ($29/month)
- 100 documents/month scraping
- Custom inspection templates
- 5 users
- Email support
- Basic ACC integration

### Pro Tier ($99/month)
- 1,000 documents/month scraping
- Advanced ML extraction
- Unlimited users
- Priority support
- Full ACC integration
- Custom branding

### Enterprise Tier (Custom pricing)
- Unlimited document scraping
- On-premise deployment option
- Dedicated support
- Custom integrations
- SLA guarantees
- White-label option

See [docs/MONETIZATION.md](docs/MONETIZATION.md) for detailed pricing and feature comparison.

## ACC Integration

### Required Credentials

1. **ACC Account** - Autodesk Construction Cloud account
2. **Forge App** - Create app at https://forge.autodesk.com/
3. **API Keys:**
   - Client ID
   - Client Secret
   - Callback URL

### Integration Features

- **Document Access:** Read documents from ACC projects
- **Data Model Export:** Write extracted data to ACC
- **Webhook Events:** Real-time updates from ACC
- **User Authentication:** ACC SSO integration
- **Project Sync:** Automatic project synchronization

See [docs/ACC_INTEGRATION.md](docs/ACC_INTEGRATION.md) for detailed integration guide.

## Key Features

### Data Scraper Features

| Feature | Description | Tier |
|---------|-------------|------|
| PDF Parsing | Extract text, tables, and metadata from PDFs | Free+ |
| DWG Parsing | Extract drawing metadata and attributes | Basic+ |
| Batch Processing | Process multiple documents simultaneously | Basic+ |
| ML Extraction | Intelligent data extraction using ML models | Pro+ |
| Custom Rules | Define custom extraction rules and templates | Pro+ |
| Quality Assurance | Automated validation and error detection | Pro+ |
| ACC Export | Direct export to ACC data models | Basic+ |

### Site Inspection Features

| Feature | Description | Tier |
|---------|-------------|------|
| Mobile Interface | Responsive design for mobile devices | Free+ |
| Photo Capture | Take and annotate photos | Free+ |
| Offline Mode | Work without internet, sync later | Basic+ |
| Custom Forms | Create custom inspection templates | Basic+ |
| Collaboration | Real-time multi-user collaboration | Pro+ |
| Report Generation | Generate PDF/Excel reports | Basic+ |
| ACC Integration | Push inspections to ACC | Basic+ |

## Security & Compliance

- ✅ **Data Encryption:** All data encrypted at rest and in transit
- ✅ **Authentication:** JWT-based authentication with ACC SSO
- ✅ **Authorization:** Role-based access control (RBAC)
- ✅ **Audit Logging:** Comprehensive audit trail
- ✅ **Multi-Tenant:** Complete data isolation between customers
- ✅ **GDPR Compliant:** Data privacy and right to deletion
- ✅ **SOC 2 Ready:** Security controls for enterprise customers

## Roadmap

### Phase 1: MVP (Q1 2026)
- [x] Repository setup and architecture
- [ ] Basic PDF scraping
- [ ] Simple site inspection forms
- [ ] ACC authentication
- [ ] Free tier launch

### Phase 2: Beta (Q2 2026)
- [ ] Advanced ML extraction
- [ ] Custom inspection templates
- [ ] Offline mode
- [ ] Basic/Pro tier launch
- [ ] Payment integration (Stripe)

### Phase 3: Production (Q3 2026)
- [ ] Enterprise features
- [ ] White-label option
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics
- [ ] API for third-party integrations

### Phase 4: Scale (Q4 2026)
- [ ] Multi-region deployment
- [ ] Advanced ML models
- [ ] Industry-specific templates
- [ ] Marketplace for custom templates

## Documentation

- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and data flow
- **[API Contracts](docs/API_CONTRACTS.md)** - Complete API documentation
- **[ACC Integration](docs/ACC_INTEGRATION.md)** - ACC/Forge integration guide
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- **[Monetization Strategy](docs/MONETIZATION.md)** - Pricing and tiers

## Contributing

This is a commercial product repository. Contributions are limited to Main Character Energy team members and authorized contractors.

## License

Proprietary - All Rights Reserved  
© 2026 Main Character Energy

Commercial licensing available for Enterprise tier customers.

## Support

- **Free Tier:** Community support (GitHub Discussions)
- **Basic/Pro Tier:** Email support (support@maincharacterenergy.com)
- **Enterprise Tier:** Dedicated support with SLA

## Contact

- **Website:** https://maincharacterenergy.com
- **Email:** info@maincharacterenergy.com
- **Sales:** sales@maincharacterenergy.com

---

**Last Updated:** January 2026  
**Repository:** https://github.com/robachamilton-afk/acc-tools
