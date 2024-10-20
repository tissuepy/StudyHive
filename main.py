import numpy
import pandas as pd
import flask
import os
from supabase import create_client, Client

url: str = "https://jgwefbfoqgeibneyinuf.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnd2VmYmZvcWdlaWJuZXlpbnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyMzI5ODMsImV4cCI6MjA0MzgwODk4M30.HdgAwr3t9LpHoRZvLmweSlCEgaVagUhAmeFDAYnF7aI"
supabase: Client = create_client(url, key)
response = supabase.table("userData").select("*").execute()
data = response.data
#print(response)

df = pd.DataFrame(data)
print(df)


users = [ # creating a dictionary with users)
    {"user_id": 1, "name": "Alice", "class": "Math101", "location": "Dorm A", "available_time": ["14:00", "16:00"]},
    {"user_id": 2, "name": "Johnny", "class": "Math101", "location": "Dorm B", "available_time": ["15:00", "17:00"]},
    {"user_id": 3, "name": "Nitish", "class": "Physics101", "location": "Dorm A", "available_time": ["13:00", "15:00"]},
    {"user_id": 4, "name": "Allan", "class": "Math101", "location": "Dorm B", "available_time": ["15:00", "17:00"]},
    {"user_id": 5, "name": "Nikita", "class": "Chem101", "location": "Dorm A", "available_time": ["15:00", "16:00"]},
    # Add more users
]

#users = df[]
userID = 1                      # we should auto send a user id from react to here so we know who is being compared 
currentUser = df[:userID]
#userMatch = df['score']['Value'].max()


def match_function(user1, user2):
    score = 0
    if user1["class"] == user2["class"]:
        score += 2
    if max(user1['available_time'][0], user2['available_time'][0]) < min(user1['available_time'][1], user2['available_time'][1]):
        score += 3
    #print(score)
    return score


def compare_users(users):
    match_results = []
    
    for i in range(len(users)):
        user1 = users[i]
        for j in range(i + 1, len(users)):
            user2 = users[j]
            
            # Calculate match score for user1 and user2
            score = match_function(user1, user2)
            match_results.append({
                "user1": user1['name'],
                "user2": user2['name'],
                "match_score": score
            })
    
    return match_results, score

match_results, score = compare_users(users)  # Unpack the returned tuple

# Loop through match_results
for result in match_results:
    print(f"Match score between {result['user1']} and {result['user2']}: {result['match_score']}")
