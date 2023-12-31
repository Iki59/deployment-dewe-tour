package middleware

import (
	dto "dewe_tour/dto/result"
	jwtToken "dewe_tour/pkg/jwt"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

type Result struct {
	Code    int         `json:"code"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

func Auth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		token := c.Request().Header.Get("Authorization")

		if token == "" {
			return c.JSON(http.StatusUnauthorized, dto.ErrorResult{
				Code:    http.StatusBadRequest,
				Message: "unauthorized",
			})
		}

		token = strings.Split(token, " ")[1]
		claims, err := jwtToken.DecodeToken(token)

		if err != nil {
			return c.JSON(http.StatusUnauthorized, Result{
				Code:    http.StatusUnauthorized,
				Message: "unauthorized",
			})
		}

		c.Set("userLogin", claims)
		return next(c)
	}
}
