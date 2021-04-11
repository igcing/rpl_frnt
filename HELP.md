#Fundamental of front project
## Docker and Angular

# How to use 
###BUILD
```sh 
docker build --rm -f "frntrpl/Dockerfile" -t frntrpl:latest frntrpl
```

###RUN
```sh 
docker run --rm -it -p 80:80/tcp frntrpl:latest
```
