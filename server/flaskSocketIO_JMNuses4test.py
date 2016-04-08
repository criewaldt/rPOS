#http://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO
from flask.ext.socketio import emit, send
import time
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

#when live this JSON should be built by reading an excel sheet
buttons = {'buttonBuilder': 
                 {'entre':
                      {'burger':
                           {'price':'10.50'},
                       'veggie burger':
                           {'price':'9.50'},
                       'mods':
                           {'cheese':'1.50',
                            'bacon':'0.75',
                            'pickles':'0.50',
                            },
                       
                  'pasta':
                       {'parmagan':
                            {'price':'10.50'},
                        'alfrado':
                            {'price':'9.50'},
                        'mods':
                           {'sauce':'2.00',
                            'broccoli':'1.75',
                            'garlic':'0.50',
                            }
                        }
                       }
                  }
           }
                  
           

@app.route('/')
def index():
    print "new user"
    return render_template('waiter.html')


@socketio.on('connect', namespace='/')
def test_connect():
    print "new connection"


@socketio.on('message')
def handle_message(message):
    dataIN = json.loads(message)
    print dataIN
    print dataIN.itervalues().next()
    print dataIN.iterkeys().next()
    if dataIN.iterkeys().next() == "buttonBuilder":
        send(json.dumps(buttons))
        print "button setup sent"

    else:
        print message
        print type(message)
        print dataIN
        print type(dataIN)
    
   

if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0',port=8000)