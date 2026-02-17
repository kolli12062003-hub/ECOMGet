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
                    docker compose down || true
                    docker compose build
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
                        cp $BACKEND_ENV backend/.env
                        cp $FRONTEND_ENV frontend/.env

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

