from backend.cilery import app
from chat.models import Profile 
from time import sleep
  
@app.task
def threading(a, b, c):
    sleep(c)
    return a + b