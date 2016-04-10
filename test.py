import sqlite3
from datetime import datetime
import json


#edit here

class nPOS:
    def __init__(self,):
        print("rPOS has started.")
        self.c, self.conn = self.connectDb()
        
        
    def createDb(self,):
        conn = sqlite3.connect('db/db.sqlite')
        c = conn.cursor()
        try:
            c.execute('''CREATE TABLE SessionDataLog
              ("userID" TEXT NOT NULL , "tableNumber" TEXT  NOT NULL, "OrderData" VARCHAR, "Notes" TEXT, "OpenDatetime" DATETIME PRIMARY KEY NOT NULL UNIQUE , "ClosedDatetime" TEXT , "BillTotal" REAL NOT NULL  DEFAULT 0.00 , "PaidTotal" REAL NOT NULL  DEFAULT 0.00)''')

            c.execute('''CREATE TABLE SessionData
              ("userID" TEXT NOT NULL , "tableNumber" TEXT  NOT NULL, "OrderData" VARCHAR, "Notes" TEXT, "OpenDatetime" DATETIME PRIMARY KEY NOT NULL UNIQUE , "ClosedDatetime" TEXT , "BillTotal" REAL NOT NULL  DEFAULT 0.00 , "PaidTotal" REAL NOT NULL  DEFAULT 0.00)''')

            print('[db] No sqlite DBs found. Creating them now.')
            print('[db] {}, {} tables created. This is where all records for rPOS will be stored.'.format('SessionDataLog','SessionData'))
            conn.commit()
        #unless database already exists
        except sqlite3.OperationalError:
            print("[db] [Welcome Back] Existing sqlite database found. I'll use that one.")
            pass
        return c, conn
        
    def connectDb(self,):
        c, conn = self.createDb()
        print('[db] Connected to database.')
        return c, conn
    
    def closeDb(self,):
        print('[db] Closing database.')
        self.conn.close()

    def saveDb(self,):
        self.conn.commit()
        print("[db] Database saved.")

    def inputOrder(self, orderInfo):
        
        openDatetime = datetime.now()
        closedDatetime = None

        #parse orderInfo
        userId = orderInfo['userId']
        tableNumber = orderInfo['tableNumber']
        orderData = orderInfo['orderData']
        notes = orderInfo['notes']

        billTotal = sum([item['price'] for item in orderData['order']])
        paidTotal = 0.0
        
        inputItem = (userId, tableNumber, json.dumps(orderData), notes, openDatetime, closedDatetime, billTotal, paidTotal)
        
        self.c.execute("""INSERT INTO SessionData VALUES
                        (?,?,?,?,?,?,?,?)""", inputItem)
        print("[rPOS] Table #:{} - Order saved by: {}.".format(tableNumber, userId))
        self.saveDb()

    def closeOrder(self,tableNumber, userId):
        now = datetime.now()
        self.c.execute("""UPDATE SessionData
                          SET ClosedDatetime='{d}'
                          WHERE tableNumber=='{t}'
            """.format(d=now, t=tableNumber),)
        print("[rPOS] Table #:{} - This table has been closed by: {}.".format(tableNumber, userId))
        self.saveDb()

    def initSession(self, userId):
        print("[rPOS] [initSession] Initiated by: {}".format(userId))

    def checkoutSession(self, userId):
        print("[rPOS] [checkoutSession] Initiated by: {}".format(userId))

        #do something
        print("[rPOS] [checkoutSession] [Success] All important stuff confirmed. Session complete for: {}".format(userId))

        #close db connection
        self.closeDb()

        #exit
        print('Done.')
        
       
if __name__ == "__main__":
    
    #TEST INFO
    userId = 'test server station #1'
    tableNumber = "table21"

    #TEST ORDER
    ORDER = {
        'userId' : userId,
        'tableNumber' : tableNumber,
        'notes' : 'Test order, ready for the cooks!',
        
        'orderData' : {'order':[
                {'name':'burger',
                   'price':12.50,
                   'mods':['no pickles', 'extra cheese']},
                {'name':'fries',
                   'price':3.50,
                   'mods':[]},
                {'name':'soda',
                   'price':2,
                   'mods':[]},
                {'name':'water',
                   'price':0,
                   'mods':['add lemon']}
                              ]
                     }}

    
    #start the client
    pos = nPOS()

    #init a daily session to do business
    pos.initSession(userId)

    #input some orders
    pos.inputOrder(ORDER)

    #close some orders
    pos.closeOrder(tableNumber, userId)

    #do the daily 'checkout' for each terminal
    pos.checkoutSession(userId)

    #done
    
    
