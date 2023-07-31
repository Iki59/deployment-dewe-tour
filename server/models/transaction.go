package models

type Transaction struct {
	ID       int                     `json:"id" gorm:"primaryKey:autoIncrement"`
	Quantity int                     `json:"quantity"`
	Total    int                     `json:"total"`
	Status   string                  `json:"status" gorm:"default:Waiting Payment"`
	TripID   int                     `json:"trip_id"`
	Trip     Trip                    `json:"trip" gorm:"foreignKey:TripID"`
	UserID   int                     `json:"user_id"`
	User     UserResponseTransaction `json:"user" gorm:"foreignKey:UserID"`
}
