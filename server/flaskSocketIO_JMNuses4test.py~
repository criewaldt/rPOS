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
    return render_template('index.html')


@socketio.on('connect', namespace='/')
def test_connect():
    print "new connection"


@socketio.on('message')
def handle_message(message):
    if message == 'buttonBuilder':
        send({'buttonBuilder': \
                 {'burgers':\
                      [{'BBQ':'10.50',\
                       'CHZ':9.50}],\
                  'chicken':\
                       [{'club':9.25,\
                        'melt':8.75}]}})
    else: print message
   

if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0',port=8000)
