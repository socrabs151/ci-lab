FROM jenkins/jenkins:lts-jdk21

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl git ca-certificates gnupg unzip \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && curl -fsSLo /tmp/docker.tgz https://download.docker.com/linux/static/stable/x86_64/docker-27.3.1.tgz \
    && tar -xzf /tmp/docker.tgz --strip-components=1 -C /usr/local/bin docker/docker \
    && curl -fsSLo /tmp/helm.tgz https://get.helm.sh/helm-v3.16.4-linux-amd64.tar.gz \
    && tar -xzf /tmp/helm.tgz --strip-components=1 -C /usr/local/bin linux-amd64/helm \
    && curl -fsSLo /usr/local/bin/kubectl https://dl.k8s.io/release/v1.31.4/bin/linux/amd64/kubectl \
    && chmod +x /usr/local/bin/kubectl \
    && curl -fsSLo /tmp/sonar.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-7.2.0.5079-linux-x64.zip \
    && unzip -q /tmp/sonar.zip -d /opt \
    && ln -s /opt/sonar-scanner-7.2.0.5079-linux-x64/bin/sonar-scanner /usr/local/bin/sonar-scanner \
    && npm install -g @railway/cli \
    && rm -rf /tmp/*.tgz /tmp/*.zip /var/lib/apt/lists/*

COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"
ENV CASC_JENKINS_CONFIG=/var/jenkins_home/casc_configs

COPY casc /var/jenkins_home/casc_configs

USER jenkins
