package main

import (
	"log"
	"os"
	"strconv"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	INSERT = iota
	UPDATE
	FIND
	REMOVE
)

type Product struct {
	gorm.Model // id | created_at | updated_at | deleted_at
	Code       string
	Price      uint
}

func create(db *gorm.DB) uint {
	product := Product{
		Code:  "D42",
		Price: 100,
	}

	var id uint = 0

	if result := db.Create(&product); result.Error == nil {
		log.Println("id:", product.ID)

		id = product.ID
	}

	return id
}

func update(db *gorm.DB, product Product) {
	// Update - update product's price to 200
	db.Model(&product).Update("Price", 200)
	log.Println(product)

	// Update - update multiple fields
	db.Model(&product).Updates(Product{
		Code:  "F42",
		Price: 300,
	})

	log.Println(product)
}

func find(db *gorm.DB, id int) Product {
	var product Product

	result := db.First(&product, id)
	log.Println(result.RowsAffected, product.Code, product.Price)

	return product
}

func remove(db *gorm.DB, product Product) {
	// Delete - delete product
	db.Delete(&product)
}

func main() {
	var id int = 1

	if 2 == len(os.Args) {
		id, _ = strconv.Atoi(os.Args[1])
	}

	dsn := "root:root@tcp(127.0.0.1:3306)/orm?parseTime=true"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&Product{})

	choose := INSERT

	switch choose {
	case INSERT:
		create(db)

	case UPDATE:
		p := find(db, id)
		update(db, p)

	case FIND:
		find(db, id)

	case REMOVE:
		p := find(db, id)
		remove(db, p)
	}
}
