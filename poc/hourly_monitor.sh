#!/bin/bash
PROGRESS_FILE="/home/ubuntu/acc-tools/poc/hourly_progress.txt"

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    PROCESSED=$(grep -c '^\s*\[[0-9]' /home/ubuntu/acc-tools/poc/review_output.log 2>/dev/null || echo 0)
    RELEVANT=$(grep -c 'ASSET-RELEVANT' /home/ubuntu/acc-tools/poc/review_output.log 2>/dev/null || echo 0)
    PCT=$(echo "scale=1; $PROCESSED * 100 / 460" | bc 2>/dev/null || echo "0")
    
    # Check if process is still running
    if ps aux | grep -q "[1]5184\|[1]5185"; then
        STATUS="RUNNING"
    else
        STATUS="COMPLETED"
    fi
    
    echo "[$TIMESTAMP] Status: $STATUS | Progress: $PROCESSED/460 ($PCT%) | Asset-relevant: $RELEVANT" >> $PROGRESS_FILE
    
    # If completed, break
    if [ "$STATUS" = "COMPLETED" ]; then
        echo "[$TIMESTAMP] Review process completed!" >> $PROGRESS_FILE
        break
    fi
    
    sleep 3600  # Wait 1 hour
done
