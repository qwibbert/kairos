FROM node:23-alpine AS frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build

FROM golang:1.24-alpine AS backend
WORKDIR /app
RUN apk add --update npm
ENV CGO_ENABLED=0
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend ./
RUN npm i
COPY --from=frontend /app/build /app/pb_public
RUN npm run build
RUN go build -o kairos main.go

FROM alpine:3.22.1
WORKDIR /app
RUN apk --update add ca-certificates
COPY --from=backend /app/kairos /app/kairos
EXPOSE 8090
CMD ["./kairos", "serve", "--http=0.0.0.0:8090"]
