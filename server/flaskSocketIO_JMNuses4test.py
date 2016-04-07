#http://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO
from flask.ext.socketio import emit, send
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    print "new user"
    return render_template('waiter.html')


@socketio.on('connect', namespace='/')
def test_connect():
    print "new connection"


@socketio.on('message')
def handle_message(message):
    if message == 'buttonBuilder':
        send({'buttonBuilder': \
                 {'sandwiches':\
                      [{'burger':'10.50',\
                       'club':9.50}],\
                  'pasta':\
                       [{'parmagan':9.25,\
                        'alfrado':8.75}]}})
        print "button setup sent"
    if message['TEST']:
        print message['TEST']
    else: print message
   

if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0',port=8000)
