import sqlite3
from datetime import datetime

DB_PATH = 'backend/db.sqlite3'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_member TEXT NOT NULL,
            company_name TEXT NOT NULL,
            contact_details TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def add_contact(team_member, company_name, contact_details):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        INSERT INTO contacts (team_member, company_name, contact_details, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (team_member, company_name, contact_details, datetime.now()))
    conn.commit()
    conn.close()

def get_all_contacts():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        SELECT id, team_member, company_name, contact_details, timestamp
        FROM contacts
        ORDER BY timestamp DESC
    ''')
    rows = c.fetchall()
    conn.close()
    return [
        {
            'id': row[0],
            'team_member': row[1],
            'company_name': row[2],
            'contact_details': row[3],
            'timestamp': row[4],
        }
        for row in rows
    ]

def update_contact(contact_id, team_member, company_name, contact_details):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        UPDATE contacts
        SET team_member = ?, company_name = ?, contact_details = ?, timestamp = ?
        WHERE id = ?
    ''', (team_member, company_name, contact_details, datetime.now(), contact_id))
    conn.commit()
    conn.close()
