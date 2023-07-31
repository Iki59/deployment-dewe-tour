package routes

import (
	"dewe_tour/handlers"
	"dewe_tour/pkg/middleware"
	"dewe_tour/pkg/mysql"
	"dewe_tour/repository"

	"github.com/labstack/echo/v4"
)

func AuthRoutes(e *echo.Group) {
	authRepository := repository.MakeRepository(mysql.DB)
	h := handlers.HandlerAuth(authRepository)

	e.POST("/register", h.Register)
	e.POST("/login", h.Login)
	e.GET("/check-auth", middleware.Auth(h.CheckAuth))
}
