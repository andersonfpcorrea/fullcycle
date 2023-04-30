FROM golang:alpine AS builder
WORKDIR /go
COPY hello-world.go .
RUN go build hello-world.go

# Optimazation
FROM scratch
WORKDIR /go
COPY --from=builder /go .
ENTRYPOINT [ "./hello-world" ] 