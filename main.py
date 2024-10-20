import pandas as pd
from supabase import create_client, Client

# Supabase connection details
url: str = "https://jgwefbfoqgeibneyinuf.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnd2VmYmZvcWdlaWJuZXlpbnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyMzI5ODMsImV4cCI6MjA0MzgwODk4M30.HdgAwr3t9LpHoRZvLmweSlCEgaVagUhAmeFDAYnF7aI"
supabase: Client = create_client(url, key)

# Function to fetch user data from Supabase
def fetch_users_from_supabase():
    response = supabase.table("userData").select("*").execute()
    data = response.data
    df = pd.DataFrame(data)  # Convert to pandas DataFrame for easier processing
    return df

# Match function to calculate the match score between two users
def match_function(user1, user2):
    score = 0
    if user1["Course Number"] == user2["Course Number"]:
        score += 2
    if max(user1['available_time'][0], user2['available_time'][0]) < min(user1['available_time'][1], user2['available_time'][1]):
        score += 3
    return score

# Function to compare all users and calculate match scores
def compare_users(users):
    match_results = []
    
    for i in range(len(users)):
        user1 = users[i]
        for j in range(i + 1, len(users)):
            user2 = users[j]
            
            # Calculate match score for user1 and user2
            score = match_function(user1, user2)
            match_results.append({
                "user1": user1['Name'],
                "user2": user2['Name'],
                "match_score": score
            })
    
    return match_results

# Function to find the best match for each user based on the highest match score
def find_best_matches(match_results):
    best_matches = {}  # Dictionary to store best matches for each user
    
    # Iterate over all match results
    for result in match_results:
        user1 = result['user1']
        user2 = result['user2']
        score = result['match_score']
        
        # Check if user1 has a better match
        if user1 not in best_matches or best_matches[user1]['score'] < score:
            best_matches[user1] = {'match': user2, 'score': score}
        
        # Check if user2 has a better match
        if user2 not in best_matches or best_matches[user2]['score'] < score:
            best_matches[user2] = {'match': user1, 'score': score}
    
    # Create final match list (considering only the best mutual matches)
    final_matches = []
    matched_users = set()  # To track already paired users

    for user1, match_info in best_matches.items():
        user2 = match_info['match']
        if user1 not in matched_users and user2 not in matched_users:
            final_matches.append({
                'user1': user1,
                'user2': user2,
                'match_score': match_info['score']
            })
            matched_users.add(user1)
            matched_users.add(user2)
    
    return final_matches

# Function to update the match_score in Supabase for the best matches
def upload_to_supabase(final_matches):
    for match in final_matches:
        # Update match_score for user1
        data_user1 = {
            "match_score": match['match_score']  # Update match_score for user1
        }
        supabase.table("userData").update(data_user1).eq("Name", match['user1']).execute()

        # Update match_score for user2
        data_user2 = {
            "match_score": match['match_score']  # Update match_score for user2
        }
        supabase.table("userData").update(data_user2).eq("Name", match['user2']).execute()

# Main execution
# 1. Fetch users from Supabase
df_users = fetch_users_from_supabase()

# 2. Convert DataFrame rows to list of dictionaries for easier processing
users = df_users.to_dict(orient='records')

# 3. Compare users to calculate match scores
match_results = compare_users(users)

# 4. Find best matches
final_matches = find_best_matches(match_results)

# 5. Upload the final matches to Supabase
upload_to_supabase(final_matches)

# Print the final matches for verification
for match in final_matches:
    print(f"Best match: {match['user1']} and {match['user2']} with score {match['match_score']}")
