package routes

import (
	"dewe_tour/handlers"
	"dewe_tour/pkg/middleware"
	"dewe_tour/pkg/mysql"
	"dewe_tour/repository"

	"github.com/labstack/echo/v4"
)

func TripRoutes(e *echo.Group) {
	tripRepository := repository.MakeRepository(mysql.DB)
	h := handlers.HandlerTrip(tripRepository)

	e.GET("/trips", h.FindTrips)
	e.GET("/trip/:id", h.GetTrip)
	e.POST("/trip", middleware.Auth(middleware.UploadFile(h.CreateTrip)))
	e.PATCH("/trip/:id", middleware.Auth(middleware.UploadFile(h.UpdateTrip)))
	e.DELETE("/trip/:id", middleware.Auth(h.DeleteTrip))
	e.GET("/trip", h.SearchTrip)
}
