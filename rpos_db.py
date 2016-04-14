import sqlite3
from datetime import datetime
import json


#edit here

class rPOS:
    def __init__(self,):
        print("rPOS has started.")
        self.c, self.conn = self.connectDb()

    def __enter__(self,):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.closeDb()

    def createDb(self,):
        conn = sqlite3.connect('db/db.sqlite')
        c = conn.cursor()
        try:
            c.execute("""CREATE TABLE "main"."MasterTransactionLog"
("table_id" TEXT NOT NULL , "datetime_created" DATETIME PRIMARY KEY  NOT NULL  UNIQUE ,
"datetime_closed" DATETIME, "order_data" VARCHAR, "bill_total" FLOAT NOT NULL  DEFAULT 0.00,
"balance" FLOAT NOT NULL  DEFAULT 0.00, "user_id" TEXT NOT NULL, "order_id" TEXT NOT NULL)""")

            print('[db] No sqlite DB found. Creating them now.')
            print('[db] TransactionLog table created. This is where all records for rPOS will be stored.')
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

    def start_user_session(self, user_id):
        try:
            c.execute("""CREATE TABLE "main"."CurrentUser_OpenTables_{}""".format(user_id))
            c.execute("""CREATE TABLE "main"."CurrentUser_TransactionLog_{}""".format(user_id))

            print('[db] Starting user session for {}'.format(user_id))
            self.conn.commit()
        #unless database already exists
        except sqlite3.OperationalError:
            print("[db] [SESSION] User session found for {}. I'll use that one.".format(user_id))
            pass
        

    def checkout_user_session(self, ):
        #check for open session
        #check for open tables, if so return error
        #return checkout info
        pass

    def input_order(self, user_id, order_item):

        table_id = order_item['table_id']
        order_data = order_item['order_data']
        datetime_created = datetime.now()
        datetime_closed = None
        bill_total = order_item['bill_total']
        balance = order_item['balance']
        user_id = order_item['user_id']
        order_id = order_item['order_id']
        closed=False
        #transactionlog schema:
        
        order = (
            table_id, datetime_created, datetime_closed,
            json.dumps(order_data), bill_total, balance, user_id, order_id, closed)

        
        self.c.execute("""INSERT INTO CurrentUser_OpenTables_{} VALUES
                        (?,?,?,?,?,?,?,?,?)""", order)
        print("[rPOS] Table #:{} - Order saved by: {}.".format(user_id, table_id, user_id))
        self.saveDb()

    def apply_payment(self, user_id, table_id, order_id, payment_amt=0):
        self.c.execute("""SELECT balance FROM TransactionLog WHERE table_id='{}'""".format(table_id))
        result = self.c.fetchone()
        balance = result[0]
        now = datetime.now()
        closed=False

        new_balance = (balance - payment_amt)
        if new_balance <= 0:
            closed=True
            new_balance = 0.0
        self.c.execute("""UPDATE TransactionLog
                          SET datetime_closed='{d}', balance='{b}', closed='{c}'
                          WHERE table_id='{t}' AND user_id='{u}' AND order_id='{o}' 
            """.format(d=now, t=table_id, c=closed, b=new_balance, u=user_id, o=order_id),)
        print("[rPOS] Table #:{} - This table has been closed.".format(table_id))
        self.saveDb()
        return True

    

    
        
       
if __name__ == "__main__":

    #sqlite3 tables (user_id):
    # CurrentUser_OpenTables_{}
    # CurrentUser_TransactionLog_{}
    # MasterTransactionLog
    
    #order array from client
    order_data = {'order':[
            {'name':'burger',
                'price':12.50,},
            {'name':'soda',
                'price':2.50,},
                    ]}

    #calc bill total from order array
    bill_total = sum(item['price'] for item in order_data['order'])

    #test order encoding
    TEST_ORDER = {
        'table_id':'21',
        'order_data':order_data['order'],
        'bill_total':bill_total,
        'balance':bill_total,
        'user_id':'chrisr',
        'order_id':'1234',
        }


    """
    #start the client
    with rPOS() as pos:

        #input some orders
        pos.input_order('chrisr', TEST_ORDER)

        pos.apply_payment('chrisr', '21', '1234', 15.00)
    """

