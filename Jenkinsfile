pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.BRANCH=env.GIT_BRANCH.substring(7)
                }
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
