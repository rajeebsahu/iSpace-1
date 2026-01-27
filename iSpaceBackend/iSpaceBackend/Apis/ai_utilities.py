import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from .models import BookingHistory
import datetime

def predict_specific_booking(room_name, input_date, input_time):
    # 1. Determine Category: Seats usually contain "-S" (e.g., B1-S1)
    is_seat_request = "-S" in room_name
    required_type = "SeatBooking" if is_seat_request else "RoomBooking"

    # 2. Filter History: Load only records that match the requested category
    data = list(BookingHistory.objects.filter(BookingType=required_type).values())
    print(data)
    
    # Check for minimum data requirements in that specific category
    if len(data) < 5:
        return {
            "status": "Low Data", 
            "suggestion": f"Need more {required_type} history to generate accurate patterns."
        }

    df = pd.DataFrame(data)
    
    # 3. Feature Engineering: Numeric conversion for ML
    df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
    df['hour'] = df['start_time'].apply(lambda x: int(x.split(':')[0]))
    
    # 4. Train Model: Trained ONLY on the relevant category (Room or Seat)
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