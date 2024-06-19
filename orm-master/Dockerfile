ARG CPU
FROM ${CPU}/ubuntu:22.04
ARG CPU

# install deb packages
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install software-properties-common openssh-server wget curl git vim fontconfig openjdk-17-jre maven mariadb-server mariadb-client -y

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install nodejs -y

# install pip
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get install python3-pip -y

# install modules
RUN python3 -m pip install sqlalchemy sqlalchemy.orm pymysql matplotlib plotly ipywidgets jupyterlab jupyterhub
RUN npm install -g configurable-http-proxy yarn
RUN jupyterhub --generate-config

# install golang
RUN if [ "$CPU" = "amd64" ] ; then \
    wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz; \
    tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz; \
    rm go1.21.5.linux-amd64.tar.gz; \
else \
    wget https://go.dev/dl/go1.21.5.linux-arm64.tar.gz; \
    tar -C /usr/local -xzf go1.21.5.linux-arm64.tar.gz; \
    rm go1.21.5.linux-arm64.tar.gz; \
fi

# install jenkins
RUN wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
RUN echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
RUN apt-get update
RUN apt-get install jenkins -y

# set for connecting to ssh
RUN mkdir /var/run/sshd
RUN echo 'root:root' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' \
    /etc/ssh/sshd_config
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional \
    pam_loginuid.so@g' -i /etc/pam.d/sshd

# copy source code
COPY . /orm

# set jupyter
RUN echo 'c.Authenticator.allow_all = True' | tee -a /jupyterhub_config.py

# service start ssh and mariadb
# add user
# restore database
COPY service /
# set execute
RUN chmod +x /service

CMD ["/bin/bash", "-c", "/service; /bin/bash"]