package models

type Country struct {
	ID   int    `json:"id" gorm:"primaryKey:autoIncrement"`
	Name string `json:"name" gorm:"type: varchar(255)"`
}

type CountryResponse struct {
	ID   int    `json:"id" gorm:"primaryKey:autoIncrement"`
	Name string `json:"name" gorm:"type: varchar(255)"`
}

func (CountryResponse) TableName() string {
	return "countries"
}
