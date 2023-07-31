package handlers

import (
	"context"
	dto "dewe_tour/dto/result"
	"dewe_tour/models"
	"dewe_tour/repository"
	"net/http"
	"os"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type handlerUser struct {
	UserRepository repository.UserRepository
}

func HandlerUser(UserRepository repository.UserRepository) *handlerUser {
	return &handlerUser{UserRepository}
}

func (h *handlerUser) FindUsers(c echo.Context) error {
	users, err := h.UserRepository.FindUsers()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: users})
}

func (h *handlerUser) GetUser(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := int(userLogin.(jwt.MapClaims)["id"].(float64))

	user, err := h.UserRepository.GetUser(userId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: user})
}

func (h *handlerUser) UpdateUser(c echo.Context) error {
	ctx := context.Background()
	CLOUD_NAME := os.Getenv("CLOUD_NAME")
	API_KEY := os.Getenv("API_KEY")
	API_SECRET := os.Getenv("API_SECRET")
	// var err error
	dataFile := c.Get("dataFile").(string)

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
	resp, _ := cld.Upload.Upload(ctx, dataFile, uploader.UploadParams{Folder: "dewe_tour"})

	request := models.User{
		FullName: c.FormValue("full_name"),
		Email:    c.FormValue("email"),
		// Password: c.FormValue("password"),
		Phone:   c.FormValue("phone"),
		Address: c.FormValue("address"),
		Image:   resp.SecureURL,
	}

	id, _ := strconv.Atoi(c.Param("id"))

	user, err := h.UserRepository.GetUser(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.FullName != "" {
		user.FullName = request.FullName
	}

	if request.Email != "" {
		user.Email = request.Email
	}

	// if request.Password != "" {
	// 	user.Password = request.Password
	// }

	if request.Phone != "" {
		user.Phone = request.Phone
	}

	if request.Address != "" {
		user.Address = request.Address
	}

	if request.Image != "" {
		user.Image = resp.SecureURL
	}

	data, err := h.UserRepository.UpdateUser(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}

func (h *handlerUser) ChangeImage(c echo.Context) error {
	ctx := context.Background()
	CLOUD_NAME := os.Getenv("CLOUD_NAME")
	API_KEY := os.Getenv("API_KEY")
	API_SECRET := os.Getenv("API_SECRET")
	// var err error
	dataFile := c.Get("dataFile").(string)

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
	resp, _ := cld.Upload.Upload(ctx, dataFile, uploader.UploadParams{Folder: "dewe_tour"})

	request := models.User{
		Image: resp.SecureURL,
	}

	userLogin := c.Get("userLogin")
	userId := int(userLogin.(jwt.MapClaims)["id"].(float64))

	user, err := h.UserRepository.GetUser(userId)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Image != "" {
		user.Image = resp.SecureURL
	}

	data, err := h.UserRepository.ChangeImage(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}

func (h *handlerUser) DeleteUser(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	user, err := h.UserRepository.GetUser(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	data, err := h.UserRepository.DeleteUser(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusBadRequest,
		Data: data})
}
