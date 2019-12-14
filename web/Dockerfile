
#-----------------------------
# Build Angular - Will do this outside of docker container for speed
#-----------------------------

# # pull the node container from docker hub, 
# # so that we can build our angular app
# FROM node:latest as build-env 

# # this will create the app folder, if it does not exist
# # and set it as the working location for future commands 
# WORKDIR /app

# # copy the source code from the machine and location where docker is executing, into the container env
# COPY . . 

# # install npm within this container, and then build the production enviornment of the angular app 
# RUN npm install && npm run build --prod

#-----------------------------
# Angular Application Server
#-----------------------------

# pull the nginx container from docker hub, 
# which will be used as our application server to run the angular app
FROM nginx:alpine

# copy over the built production files from the build-env container
# and put them inside this container, at the root folder for nginx

COPY ./dist/web /usr/share/nginx/html
# uncomment this command if decide to build using docker build-env
# COPY --from=build-env /app/dist/web /usr/share/nginx/html

# remove the default config, because if we don't then it will still be used in nginx
# nginx uses every single config file in this config.d director. 
RUN rm /etc/nginx/conf.d/default.conf

# move our neginx configuration from the angular project to the config nginx uses, so that we can configure
# the nginx environment. 
COPY nginx.conf /etc/nginx/conf.d/

# The reason this is a cmd, is that we do not want to run nginx in the shell env, 
# which is what happens if you use the "RUN" statement  
CMD ["nginx", "-g", "daemon off;"]
