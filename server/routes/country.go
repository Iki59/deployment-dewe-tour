package routes

import (
	"dewe_tour/handlers"
	"dewe_tour/pkg/middleware"
	"dewe_tour/pkg/mysql"
	"dewe_tour/repository"

	"github.com/labstack/echo/v4"
)

func CountryRoutes(e *echo.Group) {
	countryRepository := repository.MakeRepository(mysql.DB)
	h := handlers.HandlerCountry(countryRepository)

	e.GET("/countries", h.FindCountries)
	e.GET("/country/:id", h.GetCountry)
	e.POST("/country", middleware.Auth(h.CreateCountry))
	e.DELETE("/country/:id", middleware.Auth(h.DeleteCountry))
}
