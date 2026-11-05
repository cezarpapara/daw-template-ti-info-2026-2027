# Imaginea pentru containerul daw-react: Node.js 24 (LTS)
FROM node:24-alpine

WORKDIR /app

# Instalam dependintele din package.json (pentru o prima pornire rapida)
COPY app/package.json app/package-lock.json ./
RUN npm install

EXPOSE 5173

# La fiecare pornire: instaleaza pachetele noi (daca ati adaugat) si porneste Vite in modul dev
CMD ["sh", "-c", "npm install && npm run dev"]
