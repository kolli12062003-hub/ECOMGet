pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/kolli12062003-hub/ECOMGet.git'
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                echo "Stopping old containers..."
                docker compose down || true

                echo "Building fresh images..."
                docker compose build --no-cache
                '''
            }
        }

        stage('Deploy Containers') {
            steps {
                withCredentials([
                    file(credentialsId: 'ecomget-backend-env', variable: 'BACKEND_ENV'),
                    file(credentialsId: 'ecomget-frontend-env', variable: 'FRONTEND_ENV')
                ]) {
                    sh '''
                    echo "Injecting environment files..."

                    # Remove old env files if exist
                    rm -f backend/.env
                    rm -f frontend/.env

                    # Copy new env files
                    cp $BACKEND_ENV backend/.env
                    cp $FRONTEND_ENV frontend/.env

                    # Fix permissions
                    chmod 644 backend/.env
                    chmod 644 frontend/.env

                    echo "Starting containers..."
                    docker compose up -d
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                echo "Running Containers:"
                docker ps
                '''
            }
        }
    }
}

