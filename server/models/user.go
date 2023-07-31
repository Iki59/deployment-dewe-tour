package models

type User struct {
	ID       int    `json:"id" gorm:"primaryKey:autoIncrement"`
	FullName string `json:"full_name" gorm:"type: varchar(255)"`
	Email    string `json:"email" gorm:"type: varchar(255)"`
	Password string `json:"password" gorm:"type: varchar(255)"`
	Phone    string `json:"phone" gorm:"type: varchar(255)"`
	Address  string `json:"address" gorm:"type: varchar(255)"`
	Gender   string `json:"gender" gorm:"type: varchar(255)"`
	Image    string `json:"image" gorm:"type: varchar(255)"`
	Role     string `json:"role" gorm:"default:customer"`
}

type UserResponseTransaction struct {
	Id       int    `json:"id"`
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Gender   string `json:"gender"`
	Phone    string `json:"phone"`
}

func (UserResponseTransaction) TableName() string {
	return "users"
}
