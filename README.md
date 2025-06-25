# ♻️ RecycleApp

A simple application to classify recyclable materials using an AI model.

## 🚀 Usage

This project is designed to be run with Docker.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd recycle-app
    ```

2.  **Build and start the services:**
    This single command will build the frontend and backend Docker images and start the application.
    ```bash
    docker-compose up --build
    ```

3.  **Access the services:**
    - **Frontend App**: Open your browser to [http://localhost:5173](http://localhost:5173)
    - **Backend API Docs**: View the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs)

### Stopping the Application

To stop the services, press `Ctrl+C` in the terminal where `docker-compose` is running, or run:
```bash
docker-compose down
```
