package authdto

type LoginResponse struct {
	Email string `json:"email"`
	Token string `json:"token"`
	Role  string `json:"role"`
}

type CheckAuthResponse struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}
