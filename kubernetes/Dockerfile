FROM golang:alpine AS builder
WORKDIR /go
COPY server.go .
RUN go build server.go

# Optimazation
FROM scratch
WORKDIR /go
COPY --from=builder /go .
ENTRYPOINT [ "./server" ] 

# FROM golang:alpine
# WORKDIR /go
# COPY server.go .
# RUN go build server.go
# CMD [ "./server" ] 