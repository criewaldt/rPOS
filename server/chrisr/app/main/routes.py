from flask import session, redirect, url_for, render_template, request
from . import main
from .forms import LoginForm
import datetime
import json
from flask.ext.socketio import rooms

@main.route('/', methods=['GET', 'POST'])
def index():
    sampleOrder = [{'name':'burger',
            'category':'hot',
            'datetime':str(datetime.datetime.now()),
                    'id':str(datetime.datetime.now())},
                   {'name':'salad',
            'category':'cold',
            'datetime':str(datetime.datetime.now()),
                    'id':str(datetime.datetime.now())}]
    return render_template('kitchen.html', order=sampleOrder)


@main.route('/kitchen')
def kitchen():
    """Chat room. The user's name and room must be stored in
    the session."""
    name = 'kitchen 1'
    room = 'kitchen'
    #set session variables
    session['name'] = name
    session['room'] = room
    sampleOrder = [{'name':'burger',
            'category':'hot',
            'datetime':str(datetime.datetime.now()),
                    'id':str(datetime.datetime.now())},
                   {'name':'salad',
            'category':'cold',
            'datetime':str(datetime.datetime.now()),
                    'id':str(datetime.datetime.now())}]
    return render_template('kitchen.html', name=name, room=room, order=sampleOrder)

@main.route('/server')
def server():
    """Chat room. The user's name and room must be stored in
    the session."""
    name = 'server 1'
    room = 'server'
    #set session variables
    session['name'] = name
    session['room'] = room
    
    return render_template('server.html', name=name, room=room)

