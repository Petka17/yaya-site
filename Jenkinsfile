pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker') {
            steps {
                sh 'make build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'make push'
            }
        }
    }
}
