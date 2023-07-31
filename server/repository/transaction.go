package repository

import (
	"dewe_tour/models"
	"fmt"
)

type TransactionRepository interface {
	FindTransactions() ([]models.Transaction, error)
	GetTransaction(ID int) (models.Transaction, error)
	CreateTransaction(transaction models.Transaction) (models.Transaction, error)
	GetMyTransaction(UserID int) ([]models.Transaction, error)
	UpdateTransaction(status string, ID int) (models.Transaction, error)
	GetPayment(transaction models.Transaction) (models.Transaction, error)
}

func (r *repository) FindTransactions() ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := r.db.Preload("Trip").Preload("Trip.Country").Preload("User").Find(&transactions).Error

	return transactions, err
}

func (r *repository) CreateTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Create(&transaction).Error
	return transaction, err
}

func (r *repository) GetTransaction(ID int) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Preload("Trip").Preload("Trip.Country").Preload("User").First(&transaction, ID).Error

	return transaction, err
}

func (r *repository) GetMyTransaction(UserID int) ([]models.Transaction, error) {
	var mytransaction []models.Transaction

	err := r.db.Where("user_id = ?", UserID).Preload("User").Preload("Trip").Preload("Trip.Country").Find(&mytransaction).Error
	return mytransaction, err
}

func (r *repository) UpdateTransaction(status string, ID int) (models.Transaction, error) {
	var transaction models.Transaction

	r.db.First(&transaction, ID)
	fmt.Println(status)

	if status != transaction.Status && status == "Approved" {
		r.db.First(&transaction, transaction.ID)
	}

	transaction.Status = status
	err := r.db.Save(&transaction).Error

	return transaction, err
}

func (r *repository) GetPayment(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Save(&transaction).Error

	return transaction, err
}
