package usersdto

type UpdateUserRequest struct {
	FullName string `json:"full_name" form:"full_name"`
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
	Phone    string `json:"phone" form:"phone"`
	Address  string `json:"address" form:"address"`
	Image    string `json:"image" form:"image"`
}
