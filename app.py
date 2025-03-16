# app.py
import sqlite3
from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime, timedelta

app = Flask(__name__)
DATABASE = 'cards.db'

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            list_type TEXT NOT NULL CHECK(list_type IN ('bid', 'watch', 'good')),
            bid_time TEXT,
            bid_gold INTEGER,
            seller TEXT,
            auction_end_time TEXT,
            outbid INTEGER DEFAULT 0,
            plan_to_rebid INTEGER DEFAULT 0,
            other_bid INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['GET'])
def index():
    conn = get_db_connection()
    cards = conn.execute('SELECT * FROM cards').fetchall()
    conn.close()
    bid_cards = [card for card in cards if card['list_type'] == 'bid']
    watch_cards = [card for card in cards if card['list_type'] == 'watch']
    good_cards = [card for card in cards if card['list_type'] == 'good']
    return render_template('index.html', bid_cards=bid_cards, watch_cards=watch_cards, good_cards=good_cards)

@app.route('/add', methods=['POST'])
def add_card():
    list_type = request.form.get('list_type')
    name = request.form.get('name')
    conn = get_db_connection()
    
    if list_type == 'bid':
        bid_time = request.form.get('bid_time')
        if not bid_time:
            bid_time = datetime.utcnow().isoformat()
        bid_gold = request.form.get('bid_gold')
        seller = request.form.get('seller')
        hours_left = request.form.get('hours_left')
        auction_end_time = None
        if hours_left:
            try:
                hours = float(hours_left)
                auction_end_time = (datetime.utcnow() + timedelta(hours=hours)).isoformat()
            except ValueError:
                auction_end_time = None
        outbid = 1 if request.form.get('outbid') == 'on' else 0
        plan_to_rebid = 1 if request.form.get('plan_to_rebid') == 'on' else 0
        conn.execute('''INSERT INTO cards 
                        (name, list_type, bid_time, bid_gold, seller, auction_end_time, outbid, plan_to_rebid) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                     (name, list_type, bid_time, bid_gold, seller, auction_end_time, outbid, plan_to_rebid))
    elif list_type == 'watch':
        hours_left = request.form.get('hours_left')
        auction_end_time = None
        if hours_left:
            try:
                hours = float(hours_left)
                auction_end_time = (datetime.utcnow() + timedelta(hours=hours)).isoformat()
            except ValueError:
                auction_end_time = None
        other_bid = 1 if request.form.get('other_bid') == 'on' else 0
        conn.execute('''INSERT INTO cards (name, list_type, auction_end_time, other_bid) 
                        VALUES (?, ?, ?, ?)''', 
                     (name, list_type, auction_end_time, other_bid))
    elif list_type == 'good':
        conn.execute('INSERT INTO cards (name, list_type) VALUES (?, ?)', (name, list_type))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route('/update/<int:card_id>', methods=['POST'])
def update_card(card_id):
    conn = get_db_connection()
    card = conn.execute('SELECT * FROM cards WHERE id = ?', (card_id,)).fetchone()
    if not card:
        conn.close()
        return redirect(url_for('index'))
    list_type = card['list_type']
    
    if list_type == 'bid':
        bid_time = request.form.get('bid_time')
        if not bid_time:
            bid_time = datetime.utcnow().isoformat()
        bid_gold = request.form.get('bid_gold')
        seller = request.form.get('seller')
        hours_left = request.form.get('hours_left')
        auction_end_time = None
        if hours_left:
            try:
                hours = float(hours_left)
                auction_end_time = (datetime.utcnow() + timedelta(hours=hours)).isoformat()
            except ValueError:
                auction_end_time = None
        outbid = 1 if request.form.get('outbid') == 'on' else 0
        plan_to_rebid = 1 if request.form.get('plan_to_rebid') == 'on' else 0
        conn.execute('''UPDATE cards SET bid_time = ?, bid_gold = ?, seller = ?, auction_end_time = ?, outbid = ?, plan_to_rebid = ?
                        WHERE id = ?''', (bid_time, bid_gold, seller, auction_end_time, outbid, plan_to_rebid, card_id))
    elif list_type == 'watch':
        hours_left = request.form.get('hours_left')
        auction_end_time = None
        if hours_left:
            try:
                hours = float(hours_left)
                auction_end_time = (datetime.utcnow() + timedelta(hours=hours)).isoformat()
            except ValueError:
                auction_end_time = None
        other_bid = 1 if request.form.get('other_bid') == 'on' else 0
        conn.execute('UPDATE cards SET auction_end_time = ?, other_bid = ? WHERE id = ?', (auction_end_time, other_bid, card_id))
    elif list_type == 'good':
        name = request.form.get('name')
        conn.execute('UPDATE cards SET name = ? WHERE id = ?', (name, card_id))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route('/delete/<int:card_id>', methods=['POST'])
def delete_card(card_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM cards WHERE id = ?', (card_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
