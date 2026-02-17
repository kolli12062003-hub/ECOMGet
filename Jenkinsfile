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
                sh '''
                docker compose up -d
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                docker ps
                '''
            }
        }
    }
}



