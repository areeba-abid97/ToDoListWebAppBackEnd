from flask import Flask, render_template,request,redirect,url_for 
from bson import ObjectId 
from pymongo import MongoClient 
import os

#App Name
app = Flask(__name__)

title = "TODO application with Flask, MongoDB, and Angular"  
heading = "TODO Application with Flask, MongoDB, and Angular"

#MongoDB Connection String
client = MongoClient("") #host uri  
db = client.mymongodb #Select the database  
todos = db.todo #Select the collection name  

def redirect_url():     
    url_for('index') 

@app.route("/") #Application Route for Default Route

#Display the Uncompleted Tasks
@app.route("/uncompleted") #Application Route for Uncompleted Tasks  
def tasks ():    
    todos_l = todos.find({"done":"no"})    
    a2="active"    
    return render_template('index.html',a2=a2,todos=todos_l,t=title,h=heading)  

#Display all the Tasks
@app.route("/list") #Application Route for List of All Tasks
def lists ():        
    todos_l = todos.find()    
    a1="active"    
    return render_template('index.html',a1=a1,todos=todos_l,t=title,h=heading)
    
if __name__ == "__main__":    
    app.run()   
