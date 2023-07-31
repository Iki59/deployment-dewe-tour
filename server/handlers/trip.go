package handlers

import (
	"context"
	dto "dewe_tour/dto/result"
	"dewe_tour/models"
	"dewe_tour/repository"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type handlertrip struct {
	TripRepository repository.TripRepository
}

func HandlerTrip(TripRepository repository.TripRepository) *handlertrip {
	return &handlertrip{TripRepository}
}

func (h *handlertrip) FindTrips(c echo.Context) error {
	trips, err := h.TripRepository.FindTrips()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: trips})
}

func (h *handlertrip) CreateTrip(c echo.Context) error {
	// var err error
	dataFile := c.Get("dataFile").(string)
	fmt.Println(dataFile)

	CountryID, _ := strconv.Atoi(c.FormValue("country_id"))
	Day, _ := strconv.Atoi(c.FormValue("day"))
	Night, _ := strconv.Atoi(c.FormValue("night"))
	Price, _ := strconv.Atoi(c.FormValue("price"))
	Quota, _ := strconv.Atoi(c.FormValue("quota"))

	request := models.Trip{
		Title:          c.FormValue("title"),
		CountryID:      CountryID,
		Accomodation:   c.FormValue("accomodation"),
		Transportation: c.FormValue("transportation"),
		Day:            Day,
		Night:          Night,
		DateTrip:       c.FormValue("date_trip"),
		Price:          Price,
		Quota:          Quota,
		Description:    c.FormValue("description"),
		Image:          dataFile,
	}

	validation := validator.New()
	err := validation.Struct(request)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	response, err := h.TripRepository.CreateTrip(request)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: response,
	})
}

func (h *handlertrip) GetTrip(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	trip, err := h.TripRepository.GetTrip(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: trip})

}

func (h *handlertrip) UpdateTrip(c echo.Context) error {
	ctx := context.Background()
	CLOUD_NAME := os.Getenv("CLOUD_NAME")
	API_KEY := os.Getenv("API_KEY")
	API_SECRET := os.Getenv("API_SECRET")
	// var err error
	dataFile := c.Get("dataFile").(string)

	CountryID, _ := strconv.Atoi(c.FormValue("country_id"))
	Day, _ := strconv.Atoi(c.FormValue("day"))
	Night, _ := strconv.Atoi(c.FormValue("night"))
	Price, _ := strconv.Atoi(c.FormValue("price"))
	Quota, _ := strconv.Atoi(c.FormValue("quota"))

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, _ := cld.Upload.Upload(ctx, dataFile, uploader.UploadParams{Folder: "dewe_tour"})

	request := models.Trip{
		Title:          c.FormValue("title"),
		CountryID:      CountryID,
		Accomodation:   c.FormValue("accomodation"),
		Transportation: c.FormValue("transportation"),
		Day:            Day,
		Night:          Night,
		DateTrip:       c.FormValue("date_trip"),
		Price:          Price,
		Quota:          Quota,
		Description:    c.FormValue("description"),
		Image:          resp.SecureURL,
	}

	id, _ := strconv.Atoi(c.Param("id"))

	trip, err := h.TripRepository.GetTrip(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Title != "" {
		trip.Title = request.Title
	}

	if request.CountryID != 0 {
		trip.CountryID = request.CountryID
	}

	if request.Accomodation != "" {
		trip.Accomodation = request.Accomodation
	}

	if request.Transportation != "" {
		trip.Transportation = request.Transportation
	}

	if request.Day != 0 {
		trip.Day = request.Day
	}

	if request.Night != 0 {
		trip.Night = request.Night
	}

	if request.DateTrip != "" {
		trip.DateTrip = request.DateTrip
	}

	if request.Price != 0 {
		trip.Price = request.Price
	}

	if request.Quota != 0 {
		trip.Quota = request.Quota
	}

	if request.Description != "" {
		trip.Description = request.Description
	}

	if request.Image != "" {
		trip.Image = resp.SecureURL
	}

	data, err := h.TripRepository.UpdateTrip(trip)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}

func (h *handlertrip) DeleteTrip(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	trip, err := h.TripRepository.GetTrip(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	data, err := h.TripRepository.DeleteTrip(trip)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusBadRequest,
		Data: data})
}

func (h *handlertrip) SearchTrip(c echo.Context) error {
	countryQuery := c.QueryParam("country")

	country, err := h.TripRepository.GetTripByName(countryQuery)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	trip, err := h.TripRepository.SearchTrip(country.ID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: trip})
}
