package handlers

import (
	countrydto "dewe_tour/dto/country"
	dto "dewe_tour/dto/result"
	"dewe_tour/models"
	"dewe_tour/repository"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type handlercountry struct {
	CountryRepository repository.CountryRepository
}

func HandlerCountry(CountryRepository repository.CountryRepository) *handlercountry {
	return &handlercountry{CountryRepository}
}

func (h *handlercountry) FindCountries(c echo.Context) error {
	country, err := h.CountryRepository.FindCountries()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: country})
}

func (h *handlercountry) CreateCountry(c echo.Context) error {
	request := new(countrydto.CountryRequest)
	if err := c.Bind(&request); err != nil {
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

	data := models.Country{
		Name: request.Name,
	}

	response, err := h.CountryRepository.CreateCountry(data)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: response})
}

func (h *handlercountry) GetCountry(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	country, err := h.CountryRepository.GetCountry(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: country})
}

func (h *handlercountry) DeleteCountry(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	station, err := h.CountryRepository.GetCountry(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	data, err := h.CountryRepository.DeleteCountry(station)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: data})
}
