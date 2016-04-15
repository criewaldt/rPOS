# -*- coding: utf-8 -*-

from flask import Flask, session
from flask import render_template, flash, redirect, request, url_for, abort, send_from_directory
import sqlite3
from sqlite3 import OperationalError
from flask import g

app = Flask(__name__)
app.secret_key = 'itsasecret'

### DB ###

DATABASE = '../db/db.sqlite'


# This function connects the db
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        #connect sqlite
        db = g._database = sqlite3.connect(DATABASE)
        #turn row results into a dict
        db.row_factory = make_dicts
        #init the db and make tables if they dont already exist
        init_db()
    return db

# This function connects db, executes sql string, then returns results
def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

# This function turns sqlite result rows into a dict with key:value pairs
# like this: results= { col_name : value }
# It's used when the db connection is initiated in get_db()
def make_dicts(cur, row):
    return dict((cur.description[idx][0], value)
                for idx, value in enumerate(row))

# This function (with generator context) is what ensures the db connection is
# closed after a view runs logic that requires the db
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# This function creates the db with tables if they doesnt already exist.
def init_db():
    db = get_db()
    try:
        #on first run, create tables
        db.execute('CREATE TABLE "users" ("username" TEXT, "email" TEXT, "user_id" TEXT)')
        db.commit()
        pass
    except OperationalError as e:
        #on successive run, handle the exception and continue on using the existing tables
        pass
        
### END: DB ###


#
# Example sqlite3 queries within a Flask view (db connection is closed after return)
#

@app.route('/')
def index():
    
    #sql query with one result
    result = query_db('select * from users', one=True)
    print result
    
    #sql query with args and many results
    # remember to use '?' and [args list] for sql injection protection
    results = query_db('select * from users where username == ? AND user_id == ?', ['chrisr4918', 'chrisr'], one=False)
    for result in results:
        print result['email']
    
    return render_template("index.html")

if __name__ == "__main__":

    app.run(debug=True)
