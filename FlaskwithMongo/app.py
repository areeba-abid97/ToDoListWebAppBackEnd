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
    
if __name__ == "__main__":    
    app.run()   
