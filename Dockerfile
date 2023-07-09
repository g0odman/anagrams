FROM node:current-alpine3.16 AS build
COPY ./frontend /frontend
# Let's set current directory to main app dir 
WORKDIR /frontend
# Install dependencies
RUN npm ci
# Build the application
RUN npm run build

FROM python:3.8.13-slim-bullseye

COPY --from=build /frontend/build  /build

COPY ./backend/requirements.txt requirements.txt

RUN pip3 install -r ./requirements.txt

ADD ./backend /backend/
WORKDIR /backend/

CMD ["python3", "main.py"]