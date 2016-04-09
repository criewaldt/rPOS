This project requires:

Flask: Server for the POS
flask-socketio: for open sockets
flask-login: for user auth with server
xlrd: to read excel files (inventory, menu, etc)
xlwt: to write excel file (analytics output, etc)

+ any other future packages needed

How to install requirements:

1) cd to the directory where requirements.txt is located
2) activate your virtualenv
3) run: ‘pip install -r requirements.txt’ in shell

Run test.py to see how rPOS client works with database to store session and global data for POS.


************************GITHUB NOTES****************************
Starting Out:
cd into the directory that you want your local repo to be
then copy the address of your repo site

> git clone https://github.com/criewaldt/rPOS.git

You'll then need to cd into rPOS because a new directory was created
>cd rPOS

now create a branch to work on

>git branch BRANCHNAME

Check the branches availible
>git branch

you should see
*BRANCHNAME
master

indicating you are on BRANCHNAME, if not switch to it

>git checkout BRANCHNAME

Now do all your work on your local files, when you're done add the files to the staging area

>git add -A

when you enter that nothing happens, but it worked
then you need to commit the changes and add a message
>git commit -m "my message note about the work I just did"

now that you have committed the changes to BRANCHNAME you'll want to push them to the branch
>git push origin BRANCHNAME


Now sign into github account.  You should see a green button 'Compare &pull request" click it
it will give you space to write a note, and it will check that there is no conflict.  press the green button again after you make comment. You'll see another new green button now 'Merge pull request'

when it's been merged you'll see a grey button on the in the thread to delete the branch, do it.
Note that this deletes the remote version of the branch, your BRANCHNAME still exists on your local.

You're done!
next time you want to do work you just repeat the steps.  but first you have to make sure your version is current.
>git checkout BRANCHNAME
>git pull origin master

that will sink your locak BRANCHNAME back with the master branch.  If no one has added since you made your commits it will just say up to date

