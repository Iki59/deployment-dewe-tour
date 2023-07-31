package authdto

type AuthRequest struct {
	FullName string `json:"full_name" form:"full_name" validation:"required"`
	Email    string `json:"email" form:"email" validation:"required"`
	Password string `json:"password" form:"password" validation:"required"`
	Gender   string `json:"gender" form:"gender" validation:"required"`
	Phone    string `json:"phone" form:"phone" validation:"required"`
	Address  string `json:"address" form:"address" validation:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" form:"email" validate:"required"`
	Password string `json:"password" form:"password" validate:"required"`
}
