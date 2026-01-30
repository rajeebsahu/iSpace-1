
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from .models import BookingHistory
import datetime

def predict_specific_booking(room_name, input_date, input_time):
    # 1. Determine Category
    is_seat_request = "-S" in room_name
    required_type = "SeatBooking" if is_seat_request else "RoomBooking"

    # 2. Filter History
    data = list(BookingHistory.objects.filter(BookingType=required_type).values())
    
    if len(data) < 5:
        return {
            "status": "Low Data", 
            "suggestion": f"Need more {required_type} history to generate accurate patterns."
        }

    df = pd.DataFrame(data)
    
    # --- DATA CLEANING ---
    # Remove rows where start_time or date is 'N/A', empty, or None
    df = df[df['start_time'].notna()]
    df = df[df['start_time'] != 'N/A']
    df = df[df['date'].notna()]
    df = df[df['date'] != 'N/A']

    # Re-verify count after cleaning
    if len(df) < 5:
        return {
            "status": "Low Data", 
            "suggestion": "Insufficient valid history records (cleaned) to generate patterns."
        }

    # 3. Feature Engineering: Numeric conversion
    try:
        # Convert date to day of week (0=Monday, 6=Sunday)
        df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
        
        # Safely extract hour, ignoring rows that don't match HH:MM format
        def extract_hour(time_val):
            return int(str(time_val).split(':')[0])

        df['hour'] = df['start_time'].apply(extract_hour)
        
    except Exception as e:
        return {"status": "Processing Error", "suggestion": f"Data format error: {str(e)}"}
    
    # 4. Train Model
    model = RandomForestClassifier(n_estimators=100)
    model.fit(df[['day_of_week', 'hour']], df['room_name'])
    
    try:
        target_day = pd.to_datetime(input_date).dayofweek
        target_hour = int(input_time.split(':')[0])
        
        # Get probability scores
        probs = model.predict_proba([[target_day, target_hour]])
        classes = list(model.classes_)
        
        if room_name in classes:
            room_index = classes.index(room_name)
            probability = probs[0][room_index] * 100
        else:
            probability = 0

        # Most likely alternative within the SAME category
        top_suggestion = model.predict([[target_day, target_hour]])[0]

        return {
            "requested_room": room_name,
            "booking_type": required_type,
            "probability_of_usage": round(probability, 2),
            "status": "Verified Pattern" if probability > 40 else "New Pattern",
            "suggestion": f"You usually use {room_name} at this time." if probability > 40 
                          else f"You don't typically book {room_name} now. Usually, you prefer {top_suggestion}."
        }
    except Exception as e:
        return {"status": "Error", "suggestion": str(e)}