import uvicorn
import os
import sys

if sys.platform == 'win32':
    os.environ['PORT'] = str(8000)

if __name__ == "__main__":
    uvicorn.run("app.api:app", host="0.0.0.0",
                port=int(os.environ['PORT']), reload=True)
