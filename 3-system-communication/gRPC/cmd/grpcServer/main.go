package main

import (
	"database/sql"

	"github.com/devfullcycle/goexpert/14-gRPC/internal/database"
	"github.com/devfullcycle/goexpert/14-gRPC/internal/pb"
	"github.com/devfullcycle/goexpert/14-gRPC/internal/service"
	"google.golang.org/grpc"
)

func main() {
	db, err := sql.Open("sqlite3", "./db.sqltie")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	categoryDb := database.NewCategory(db)
	categoryService := service.NewCategoryService(categoryDb)

	grpcServer := grpc.NewServer()
}
