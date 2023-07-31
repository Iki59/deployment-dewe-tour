package repository

import "dewe_tour/models"

type AuthRepository interface {
	Register(user models.User) (models.User, error)
	Login(email string) (models.User, error)
	GetUserAuth(ID int) (models.User, error)
}

func (r *repository) Register(users models.User) (models.User, error) {
	err := r.db.Create(&users).Error

	return users, err
}

func (r *repository) Login(email string) (models.User, error) {
	var user models.User
	err := r.db.First(&user, "email=?", email).Error

	return user, err
}

func (r *repository) GetUserAuth(ID int) (models.User, error) {
	var user models.User
	err := r.db.First(&user, ID).Error

	return user, err
}

func (r *repository) CheckAuth(ID int) (models.User, error) {
	var user models.User
	err := r.db.First(&user, ID).Error

	return user, err
}
