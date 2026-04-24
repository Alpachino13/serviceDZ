FROM node:18-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les modules
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application
CMD ["node", "server.js"]
