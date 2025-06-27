# Enigma CRM

## Setup Instructions

1. **Create and activate a virtual environment:**
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

3. **Initialize the database:**
   ```sh
   venv/bin/python -c 'from backend.models import init_db; init_db()'
   ```

4. **Run the backend server:**
   ```sh
   venv/bin/python backend/app.py
   ```

The backend will be available at `http://127.0.0.1:5000/`.

## API Endpoints

- `GET /contacts` — List all contacts
- `POST /contacts` — Add a new contact (JSON: team_member, company_name, contact_details)
- `GET /health` — Health check
