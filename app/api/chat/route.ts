curl https://api.x.ai/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer xai-MNJNyZNXXdeS3kgcMNPv8lXE2LVKjx2xBzUH78ncv5dW6s2jfR8FDj71JiWM5yKGx6F56lzbiQe2erBp" \
    -d '{
      "messages": [
        {
          "role": "system",
          "content": "You are a test assistant."
        },
        {
          "role": "user",
          "content": "Testing. Just say hi and hello world and nothing else."
        }
      ],
      "model": "grok-4-latest",
      "stream": false,
      "temperature": 0
    }'
