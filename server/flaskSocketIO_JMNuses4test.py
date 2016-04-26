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
'''
NOTE! error right now if keys contain whitespace (my food > my_food)
'''
buttons = {'buttonBuilder': 
                {'entre':
                    {'burgers':
                      {'bbq_burger':
                           {'price':'10.50'},
                       'veggie_burger':
                           {'price':'9.50'},
                       'mods':
                           {'cheese':{'price':'10.50'},
                            'bacon':{'price':'10.50'},
                            'pickles':{'price':'10.50'}
                            }
                       },
                       
                  'pasta':
                       {'parmagan':
                            {'price':'10.50'},
                        'alfrado':
                            {'price':'9.50'},
                        'mods':
                           {'sauce':{'price':'10.50'},
                            'broccoli':{'price':'10.50'},
                            'garlic':{'price':'10.50'}
                            }
                        }
                       },
                  
           'drinks':
                    {'soda':
                      {'coke':
                           {'price':'1.50'},
                       'rootbeer':
                           {'price':'1.50'},
                       'mods':
                           {'lemon':{'price':'10.50'},
                            'straw':{'price':'10.50'},
                            'ice':{'price':'10.50'}
                            }
                       },
                       
                  'alcohol':
                       {'beer':
                            {'price':'5.50'},
                        'wine':
                            {'price':'6.50'},
                        'mods':
                           {'glass':{'price':'10.50'},
                            'lemon':{'price':'10.50'},
                            'shot':{'price':'10.50'}
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
def handle_message(data):
    dataIN = json.loads(data)
    print dataIN
    print dataIN.itervalues().next()
    print dataIN.iterkeys().next()
    if dataIN.iterkeys().next() == "buttonBuilder":
        send(json.dumps(buttons))
        print "button setup sent"

    else:
        print data
        print type(data)
        print dataIN
        print type(dataIN)
    

if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0',port=8000)
