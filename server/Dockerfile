FROM node:latest 
WORKDIR /app
COPY . .
# RUN npm install
# If you are building your code for production
RUN npm ci --only=production
CMD ["node", "app.js"]

