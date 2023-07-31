package middleware

import (
	"context"
	"net/http"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/labstack/echo/v4"
)

func UploadFile(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		file, err := c.FormFile("image")
		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		src, err := file.Open()
		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}
		defer src.Close()

		ctx := context.Background()
		CLOUD_NAME := os.Getenv("CLOUD_NAME")
		API_KEY := os.Getenv("API_KEY")
		API_SECRET := os.Getenv("API_SECRET")
		// var err error

		cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

		resp, _ := cld.Upload.Upload(ctx, src, uploader.UploadParams{Folder: "dewe_tour"})

		c.Set("dataFile", resp.SecureURL)
		return next(c)
	}
}
