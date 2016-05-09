#http://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent
#http://flask-socketio.readthedocs.org/en/latest/
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
NOTE! error right now if keys contain white-space "my food" >change to> "my_food"
'''
buttons = {'buttonBuilder': 
                {'Appetizers':
                    {'Chicken':{'buffalo_wings':{'price':'10.50',
                           				 			 'mods':{'mild':{'price':'0.00'},
                           							 			'hot':{'price':'0.00'}}},
                       				'bbq_wings':{'price':'9.50'},                        	
                       				'honey_wings':{'price':'9.75'},
                      				'mozzarella sticks':{'price':'7.75'},
                   				   'mods':{'ExtraSauce':{'price':'0.50'},
                             					'marinara':{'price':'0.50'},
                             				   'blueCheese':{'price':'0.50'}}
                       },                      
                  'Salads':{'house':{'price':'3.50',
                            			'mods':{'Italian':{'price':'0.00'},
                           					'ranch':{'price':'0.00'},
                           					'vinaigrette':{'price':'0.00'}}},
                        	'cessar':{'price':'9.50',
                            			 'mods':{'Italian':{'price':'0.00'},
                           						'ranch':{'price':'0.00'},
                           						'vinaigrette':{'price':'0.00'}}},
                           'mods':{'ExtraDressing':{'price':'1.50'},
                            		  'baconBits':{'price':'10.50'},
                            		  'fetaCheese':{'price':'10.50'}}
                        },                     
                   'Fries':{'curly_fries': {'price':'5.50',
                            				'mods':{'regular':{'price':'0.00'},
                           							'large':{'price':'1.00'}}},
                        	'waffle_fries':{'price':'4.50',
                            				'mods':{'regular':{'price':'0.00'},
                           							'large':{'price':'1.00'}}},
                        	'steak_fries':{'price':'5.75',
                            				'mods':{'regular':{'price':'0.00'},
                           							'large':{'price':'1.00'}}},
                       	 'cheese_fries':{'price':'5.00',
                            				'mods':{'regular':{'price':'0.00'},
                           							'large':{'price':'1.00'}}},
                       	 'mods': {'gravy':{'price':'1.50'},
                            		'cheese':{'price':'1.50'},
                            		'bacon':{'price':'2.50'}}}
                  },

            'Favorites':{'burger':{'price':'3.50'},
                          'beer':{'price':'2.50'},
                          'coffee':{'price':'1.50'}}, 
                            
           'Fountain_Drinks': {'coke':{'price':'1.50',
                           				'mods':{'medium':{'price':'0.00'},
                           							'large':{'price':'0.75'},
                           							'xlarge':{'price':'1.25'}}},
                      			 'rootbeer':{'price':'1.50',
                           					 'mods':{'medium':{'price':'0.00'},
                           								'large':{'price':'0.75'},
                           								'xlarge':{'price':'1.25'}}},
                       			 'sprite':{'price':'1.50',
                           					'mods':{'medium':{'price':'0.00'},
                           							'large':{'price':'0.75'},
                           							'xlarge':{'price':'1.25'}}},
                       			 'water':{'price':'0.00'},
                      			 'mods':{'lemon':{'price':'0.00'},
                               			'FunStraw':{'price':'0.50'},
                              			 'NO_ice':{'price':'0.00'}}
                       },
                       
            'Alcohol':{'beer':{'bud':{'price':'5.00',
                           				'mods':{'12ozDraft':{'price':'0.00'},
                           					  	  '16ozDraft':{'price':'0.75'},
                           						  '16ozBottle':{'price':'0.25'}}},
                       	   	'corona':{'price':'5.50',
                           				'mods':{'12ozDraft':{'price':'0.00'},
                           							'16ozDraft':{'price':'0.75'},
                           							'16ozBottle':{'price':'0.25'}}},
                             'PBR':{'price':'4.50',
                           		   'mods':{'12ozDraft':{'price':'0.00'},
                           					'16ozDraft':{'price':'0.75'},
                           					'16ozBottle':{'price':'0.25'}}}},
                    'wine':{'red':{'price':'6.00',
                           		  'mods':{'8ozGlass':{'price':'0.00'},
                           					 '750Bottle':{'price':'0.25'}}},
                       		'white':{'price':'6.00',
                           			'mods':{'8ozGlass':{'price':'0.00'},
                           						'750Bottle':{'price':'0.25'}}},
                        	'mods':{'ice':{'price':'0.00'},
                            			'straw':{'price':'0.00'},
                           		 'lemon':{'price':'0.00'}}}
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
    socketio.run(app,host='10.10.10.31',port=8000)
