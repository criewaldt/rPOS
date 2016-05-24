from flask import session
from flask.ext.socketio import emit, join_room, leave_room, rooms
from .. import socketio

#kitchen
@socketio.on('joined', namespace='/')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    room = session.get('room')
    join_room(room)
    emit('status', {'msg': session.get('name') + ' has entered the room.'}, room=room)


@socketio.on('text', namespace='/')
def text(message):
    #sent by client
    room = message['room']
    if room == 'All':
        all_rooms = ['kitchen', 'server']
        # FYI: if i were to call flask.ext.socketio.rooms() to define all_rooms
        #  it would only return the rooms that the current session is in,
        #  not all open rooms within the socketio app.
        for room in all_rooms:
            emit('message', {'msg': session.get('name') + ':' + message['msg']}, room=room)
    else:
        emit('message', {'msg': session.get('name') + ':' + message['msg']}, room=room)


@socketio.on('left', namespace='/')
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    room = session.get('room')
    leave_room(room)
    emit('status', {'msg': session.get('name') + ' has left the room.'}, room=room)


