from flask import Flask, request, jsonify
from flask_cors import CORS
from models import init_db, add_contact, get_all_contacts, update_contact

app = Flask(__name__)
CORS(app)

@app.route('/health')
def health():
    return {'status': 'ok'}

@app.route('/init_db')
def initialize_db():
    init_db()
    return {'status': 'db initialized'}

@app.route('/contacts', methods=['GET'])
def list_contacts():
    contacts = get_all_contacts()
    return jsonify(contacts)

@app.route('/contacts', methods=['POST'])
def create_contact():
    data = request.get_json()
    team_member = data.get('team_member')
    company_name = data.get('company_name')
    contact_details = data.get('contact_details', '')
    if not team_member or not company_name:
        return {'error': 'Missing required fields'}, 400
    add_contact(team_member, company_name, contact_details)
    return {'status': 'contact added'}

@app.route('/contacts/<int:contact_id>', methods=['PUT'])
def edit_contact(contact_id):
    data = request.get_json()
    team_member = data.get('team_member')
    company_name = data.get('company_name')
    contact_details = data.get('contact_details', '')
    if not team_member or not company_name:
        return {'error': 'Missing required fields'}, 400
    try:
        update_contact(contact_id, team_member, company_name, contact_details)
        return {'status': 'contact updated'}
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
