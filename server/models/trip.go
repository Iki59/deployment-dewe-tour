package models

type Trip struct {
	ID              int             `json:"id" gorm:"primaryKey:autoIncrement"`
	Title           string          `json:"title" gorm:"type: varchar(255)"`
	Country         CountryResponse `json:"country"`
	CountryID       int             `json:"country_id"`
	Accomodation    string          `json:"accomodation" gorm:"type: varchar(255)"`
	Transportation  string          `json:"transportation" gorm:"type: varchar(255)"`
	Eat             string          `json:"eat" gorm:"default:Included as Itinerary"`
	Day             int             `json:"day"`
	Night           int             `json:"night"`
	DateTrip        string          `json:"date_trip" gorm:"type: varchar(255)"`
	Price           int             `json:"price"`
	Quota           int             `json:"quota"`
	Description     string          `json:"description"`
	Image           string          `json:"image"`
	IncomeTripAdmin int             `json:"income_trip"`
}
