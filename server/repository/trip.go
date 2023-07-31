package repository

import (
	"dewe_tour/models"
)

type TripRepository interface {
	FindTrips() ([]models.Trip, error)
	GetTrip(ID int) (models.Trip, error)
	CreateTrip(trip models.Trip) (models.Trip, error)
	UpdateTrip(trip models.Trip) (models.Trip, error)
	DeleteTrip(trip models.Trip) (models.Trip, error)
	SearchTrip(countryID int) ([]models.Trip, error)
	GetTripByName(name string) (models.Country, error)
}

func (r *repository) FindTrips() ([]models.Trip, error) {
	var trips []models.Trip
	err := r.db.Preload("Country").Find(&trips).Error

	return trips, err
}

func (r *repository) GetTrip(ID int) (models.Trip, error) {
	var trip models.Trip
	err := r.db.Preload("Country").First(&trip, ID).Error

	return trip, err
}

func (r *repository) CreateTrip(trip models.Trip) (models.Trip, error) {
	err := r.db.Create(&trip).Error
	return trip, err
}

func (r *repository) UpdateTrip(trip models.Trip) (models.Trip, error) {
	err := r.db.Save(&trip).Error
	return trip, err
}

func (r *repository) DeleteTrip(trip models.Trip) (models.Trip, error) {
	err := r.db.Delete(&trip).Error
	return trip, err
}

func (r *repository) SearchTrip(countryID int) ([]models.Trip, error) {
	// var country models.Country

	// err := r.db.Preload("Country").Preload("Country.Name").Where("name = ?", Country).Find(&trips).Error
	// err := r.db.Preload("Country", func(db *gorm.DB) *gorm.DB {
	// 	return db.Where("name = ?", countryName)
	// }).Find(&trips).Error

	// err := r.db.Joins("JOIN countries ON trips.country_id = countries.id").
	// 	Where("countries.name = ?", countryName).Find(&trips).Error

	var trips []models.Trip
	err := r.db.Where("country_id = ?", countryID).Preload("Country").Find(&trips).Error

	return trips, err
}

func (r *repository) GetTripByName(name string) (models.Country, error) {
	var country models.Country
	err := r.db.First(&country, "name = ?", name).Error

	return country, err
}
