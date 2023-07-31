package routes

import (
	"dewe_tour/handlers"
	"dewe_tour/pkg/middleware"
	"dewe_tour/pkg/mysql"
	"dewe_tour/repository"

	"github.com/labstack/echo/v4"
)

func TransactionRoutes(e *echo.Group) {
	transactionRepository := repository.MakeRepository(mysql.DB)
	tripRepository := repository.MakeRepository(mysql.DB)
	userRepository := repository.MakeRepository(mysql.DB)
	h := handlers.HandlerTransaction(transactionRepository, tripRepository, userRepository)

	e.GET("/transactions", h.FindTransactions)
	e.GET("/transaction/:id", h.GetTransaction)
	e.POST("/transaction", middleware.Auth(h.CreateTransaction))
	e.GET("/my-transaction", middleware.Auth(h.GetMyTransaction))
	e.GET("/getpayment/:id", h.GetPayment)
	e.POST("/notification", h.Notification)

}
