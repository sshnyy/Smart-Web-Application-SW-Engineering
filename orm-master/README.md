# 개발 환경 설정

## 도커 설치

- 다운로드 설치: 도커 데스크탑 설치

```shell
https://www.docker.com/products/docker-desktop/
```

### 캐시 삭제 (option)

```shell
sudo docker builder prune --all
```

### 에러 발생  (option)
<!-- M3 기준: 아래 명령어 실행하고, 도커 이미지 만들어짐 -->

- ERROR [internal] load metadata for

```shell
rm ~/.docker/config.json
```

## 도커 이미지 만들기
<!-- M3 기준: 아래 명령어 변경해서 실행됨 -->

- CPU=amd64
- CPU=arm64v8

```shell
sudo docker build -t orm --build-arg CPU=arm64v8 .
```

## 도커 이미지 실행

```shell
sudo docker images --format="{{.Repository}} {{.ID}}" | grep "^orm" | cut -d' ' -f2 | xargs sudo docker run -it -d -p 8000:8000 -p 2222:22 -p 5500:5500 -p 8080:8080 --name orm
```

## 도커 이미지 실행 완료 후 도커 이미지 저장

```shell
sudo docker commit -m "complete" orm
sudo docker images
sudo docker tag <IMAGE ID> orm
```

## 실행 중인 도커 컨테이너 접속

```shell
sudo docker exec -it orm /bin/bash
```

### 오픈소스 라이선스

[image caption](https://www.apache.org/licenses/LICENSE-2.0)
