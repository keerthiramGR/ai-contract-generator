# ContractAI FastAPI Backend

This is the FastAPI production-ready backend for the ContractAI platform, built with Python 3.12, SQLAlchemy 2.0, JWT Security, and service-based architecture integrations.

## Tech Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL (via Supabase) with SQLAlchemy 2.0 ORM (support for local SQLite fallback out-of-the-box)
- **Validation**: Pydantic V2
- **PDF Generation**: ReportLab
- **Emails**: FastAPI-Mail
- **Authentication**: JWT, bcrypt hashing, OAuth2 Password Bearer
- **AI Integrations**: OpenAI GPT-4o
- **Testing**: Pytest & httpx

## Project Structure
- `app/core/`: Global configurations, logger setups, JWT/cryptography helpers, and database connections.
- `app/models/`: Declarative SQLAlchemy models matching database schema layouts.
- `app/schemas/`: Input/output verification Pydantic schemas.
- `app/services/`: Business service wrappers (OpenAI calls, storage handlers, emailers, analytics).
- `app/middleware/`: CORS setups, request-response execution logging, and custom token contexts.
- `app/routers/`: Interactive endpoints grouped by logic layers.
- `tests/`: Integration tests for auth and contracts flows.

## Getting Started

1. Set up python environment and install packages:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Start development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Visit [http://localhost:8000/docs](http://localhost:8000/docs) to explore the interactive API Documentation.

## Running Tests
Run tests with `pytest`:
```bash
pytest
```
