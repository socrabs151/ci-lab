pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git log -1 --pretty=format:"%h %s"'
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('SonarQube') {
      steps {
        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
          sh 'sonar-scanner'
        }
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
        archiveArtifacts artifacts: 'dist/*.tgz', fingerprint: true
      }
    }

    stage('Docker build') {
      steps {
        sh "docker build -t ci-lab:${BUILD_NUMBER} ."
      }
    }

    stage('Docker push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
          sh '''
            echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin
            docker tag ci-lab:$BUILD_NUMBER "$DOCKERHUB_USER/ci-lab:$BUILD_NUMBER"
            docker tag ci-lab:$BUILD_NUMBER "$DOCKERHUB_USER/ci-lab:latest"
            docker push "$DOCKERHUB_USER/ci-lab:$BUILD_NUMBER"
            docker push "$DOCKERHUB_USER/ci-lab:latest"
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([string(credentialsId: 'railway-token', variable: 'RAILWAY_TOKEN')]) {
          sh 'railway up --service ci-lab --detach --ci'
        }
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'reports/junit.xml'
    }
    success {
      withCredentials([string(credentialsId: 'mail-password', variable: 'MAIL_PASS')]) {
        sh '''
          printf "Subject: Jenkins #$BUILD_NUMBER SUCCESS\\nFrom: $MAIL_FROM\\nTo: $MAIL_TO\\nContent-Type: text/plain; charset=UTF-8\\n\\nJob: $JOB_NAME #$BUILD_NUMBER\\nStatus: SUCCESS\\nURL: $BUILD_URL\\n" > mail.txt
          curl -s --url "smtps://$MAIL_HOST:$MAIL_PORT" --ssl-reqd --mail-from "$MAIL_FROM" --mail-rcpt "$MAIL_TO" --user "$MAIL_USER:$MAIL_PASS" --upload-file mail.txt
        '''
      }
    }
    failure {
      withCredentials([string(credentialsId: 'mail-password', variable: 'MAIL_PASS')]) {
        sh '''
          printf "Subject: Jenkins #$BUILD_NUMBER FAILED\\nFrom: $MAIL_FROM\\nTo: $MAIL_TO\\nContent-Type: text/plain; charset=UTF-8\\n\\nJob: $JOB_NAME #$BUILD_NUMBER\\nStatus: FAILED\\nURL: $BUILD_URL\\n" > mail.txt
          curl -s --url "smtps://$MAIL_HOST:$MAIL_PORT" --ssl-reqd --mail-from "$MAIL_FROM" --mail-rcpt "$MAIL_TO" --user "$MAIL_USER:$MAIL_PASS" --upload-file mail.txt
        '''
      }
    }
  }
}
