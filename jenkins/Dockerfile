FROM jenkins/jenkins:lts-jdk21

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl git ca-certificates gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && curl -fsSLo /tmp/docker.tgz https://download.docker.com/linux/static/stable/x86_64/docker-27.3.1.tgz \
    && tar -xzf /tmp/docker.tgz --strip-components=1 -C /usr/local/bin docker/docker \
    && curl -fsSLo /tmp/helm.tgz https://get.helm.sh/helm-v3.16.4-linux-amd64.tar.gz \
    && tar -xzf /tmp/helm.tgz --strip-components=1 -C /usr/local/bin linux-amd64/helm \
    && curl -fsSLo /usr/local/bin/kubectl https://dl.k8s.io/release/v1.31.4/bin/linux/amd64/kubectl \
    && chmod +x /usr/local/bin/kubectl \
    && rm -rf /tmp/*.tgz /var/lib/apt/lists/*

COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"
ENV CASC_JENKINS_CONFIG=/var/jenkins_home/casc_configs

COPY casc /var/jenkins_home/casc_configs

USER jenkins
