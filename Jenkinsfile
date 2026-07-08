// =============================================================================
// Smart Campus Frontend — Jenkins Pipeline
// =============================================================================
// Prerequisites:
//   1. Jenkins plugins: Pipeline, Git, NodeJS, Pipeline: AWS Steps
//   2. Jenkins credentials:
//      - 'aws-credentials' : AWS Access Key + Secret Key (for S3 sync)
//   3. Jenkins global tools:
//      - NodeJS 22 named 'NodeJS-22'
//   4. Environment variables set in Jenkins:
//      - S3_BUCKET        : Frontend S3 bucket name
//      - CLOUDFRONT_DIST  : CloudFront distribution ID
// =============================================================================

pipeline {
    agent any

    // tools {
    //     nodejs 'NodeJS-22'
    // }

    environment {
        S3_BUCKET       = 'smart-campus-frontend-chanuka'  // Change to your bucket name
        CLOUDFRONT_DIST = credentials('cloudfront-distribution-id')
        AWS_REGION      = 'ap-south-1'
    }

    options {
        timeout(time: 10, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    triggers {
        // GitHub webhook via ngrok
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.GIT_BRANCH}"
                echo "Commit: ${env.GIT_COMMIT}"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                bat 'npm ci'  // Use 'sh "npm ci"' on Linux Jenkins
            }
        }

        stage('Lint') {
            steps {
                echo '🔍 Running linter...'
                bat 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                bat 'npm test -- --run'  // --run for non-interactive vitest
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Building production bundle...'
                // No VITE_API_BASE_URL needed — CloudFront routes /api/* to backend
                bat 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                }
            }
        }

        stage('Deploy to S3') {
            steps {
                echo '🚀 Uploading to S3...'
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    // Sync dist/ to S3 bucket
                    // --delete removes files from S3 that are no longer in dist/
                    // --cache-control sets caching headers
                    bat """
                        aws s3 sync dist/ s3://${S3_BUCKET}/ ^
                            --delete ^
                            --cache-control "public, max-age=31536000, immutable" ^
                            --exclude "index.html" ^
                            --exclude "*.json"
                    """

                    // Upload index.html and JSON with short cache (for updates)
                    bat """
                        aws s3 cp dist/index.html s3://${S3_BUCKET}/index.html ^
                            --cache-control "public, max-age=0, must-revalidate"
                    """

                    // Upload any JSON files (manifest, etc.)
                    bat """
                        aws s3 sync dist/ s3://${S3_BUCKET}/ ^
                            --exclude "*" ^
                            --include "*.json" ^
                            --cache-control "public, max-age=0, must-revalidate"
                    """
                }
            }
        }

        stage('Invalidate CloudFront') {
            steps {
                echo '🌐 Invalidating CloudFront cache...'
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    bat """
                        aws cloudfront create-invalidation ^
                            --distribution-id ${CLOUDFRONT_DIST} ^
                            --paths "/index.html" "/*.json"
                    """
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Frontend deployment failed!'
        }
        success {
            echo '✅ Frontend deployed to S3 + CloudFront successfully!'
        }
        always {
            cleanWs()
        }
    }
}
