import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from .models import BookingHistory
import datetime

def predict_specific_booking(user_email, room_name, input_date, input_time):
    # 1. Load History data from the database
    data = list(BookingHistory.objects.filter(booked_by=user_email).values())
    if len(data) < 5:  # AI needs a small baseline of data to be accurate
        return {"status": "Low Data", "suggestion": "Keep booking to improve AI accuracy!"}

    df = pd.DataFrame(data)
    
    # 2. Feature Engineering: Convert strings to numeric values the AI can understand
    df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
    df['hour'] = df['start_time'].apply(lambda x: int(x.split(':')[0]))
    
    # 3. Train the Random Forest Model
    # X = Input features (Day, Hour), y = Target (Room used)
    model = RandomForestClassifier(n_estimators=100)
    model.fit(df[['day_of_week', 'hour']], df['room_name'])
    
    # 4. Process the user's current request
    try:
        target_day = pd.to_datetime(input_date).dayofweek
        target_hour = int(input_time.split(':')[0])
        
        # Get probability scores for all rooms
        probs = model.predict_proba([[target_day, target_hour]])
        classes = list(model.classes_)
        
        if room_name in classes:
            room_index = classes.index(room_name)
            probability = probs[0][room_index] * 100
        else:
            probability = 0

        return {
            "requested_room": room_name,
            "probability_of_usage": round(probability, 2),
            "status": "Verified Pattern" if probability > 50 else "New Pattern",
            "suggestion": f"You usually use {room_name} at this time!" if probability > 50 
                          else f"You don't typically book {room_name} now. Usually, you prefer {model.predict([[target_day, target_hour]])[0]}."
        }
    except Exception as e:
        return {"status": "Error", "suggestion": str(e)}