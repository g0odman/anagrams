import uvicorn
import os

if __name__ == "__main__":
    uvicorn.run(
        "app.api:app", host="0.0.0.0", port=int(os.environ.get("PORT", 80)), reload=True
    )
