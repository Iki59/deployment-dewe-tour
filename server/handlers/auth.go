package handlers

import (
	authdto "dewe_tour/dto/auth"
	dto "dewe_tour/dto/result"
	"dewe_tour/models"
	"dewe_tour/pkg/bcrypt"
	jwtToken "dewe_tour/pkg/jwt"
	"dewe_tour/repository"
	"log"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type handlerAuth struct {
	AuthRepository repository.AuthRepository
}

func HandlerAuth(AuthRepository repository.AuthRepository) *handlerAuth {
	return &handlerAuth{AuthRepository}
}

func (h *handlerAuth) Register(c echo.Context) error {
	request := new(authdto.AuthRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}
	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	password, err := bcrypt.HashingPassword(request.Password)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	user := models.User{
		FullName: request.FullName,
		Email:    request.Email,
		Password: password,
		Gender:   request.Gender,
		Phone:    request.Phone,
		Address:  request.Address,
	}

	data, err := h.AuthRepository.Register(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: data})
}

func (h *handlerAuth) Login(c echo.Context) error {
	request := new(authdto.LoginRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	user := models.User{
		Email:    request.Email,
		Password: request.Password,
	}

	user, err := h.AuthRepository.Login(user.Email)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	isValid := bcrypt.CheckPasswordHash(request.Password, user.Password)
	if !isValid {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: "wrong email or password!"})
	}

	claims := jwt.MapClaims{}
	claims["id"] = user.ID
	claims["exp"] = time.Now().Add(time.Hour * 2).Unix()

	token, errGenerateToken := jwtToken.GenerateToken(&claims)
	if errGenerateToken != nil {
		log.Println(errGenerateToken)
		return echo.NewHTTPError(http.StatusUnauthorized)
	}

	loginResponse := authdto.LoginResponse{
		Email: user.Email,
		Token: token,
		Role:  user.Role,
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: loginResponse})

}

func (h *handlerAuth) CheckAuth(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	user, err := h.AuthRepository.GetUserAuth(int(userId))

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	CheckAuthResponse := authdto.CheckAuthResponse{
		Id:    user.ID,
		Email: user.Email,
		Role:  user.Role,
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: CheckAuthResponse})
}
