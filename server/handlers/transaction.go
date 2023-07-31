package handlers

import (
	dto "dewe_tour/dto/result"
	transactionsdto "dewe_tour/dto/transactions"
	"dewe_tour/models"
	"dewe_tour/repository"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
	"gopkg.in/gomail.v2"
)

type handlertransaction struct {
	TransactionRepository repository.TransactionRepository
	TripRepository        repository.TripRepository
	UserRepository        repository.UserRepository
}

func HandlerTransaction(TransactionRepository repository.TransactionRepository, TripRepository repository.TripRepository, UserRepository repository.UserRepository) *handlertransaction {
	return &handlertransaction{
		TransactionRepository: TransactionRepository,
		TripRepository:        TripRepository,
		UserRepository:        UserRepository,
	}
}

func (h *handlertransaction) FindTransactions(c echo.Context) error {
	transactions, err := h.TransactionRepository.FindTransactions()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: transactions})
}

func (h *handlertransaction) GetTransaction(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: transaction})
}

func (h *handlertransaction) CreateTransaction(c echo.Context) error {
	request := new(transactionsdto.CreateTransactionRequest)

	Quantity, _ := strconv.Atoi(c.FormValue("quantity"))
	Total, _ := strconv.Atoi(c.FormValue("total"))
	TripID, _ := strconv.Atoi(c.FormValue("trip_id"))
	request.Quantity = Quantity
	request.Total = Total
	request.TripID = TripID
	userLogin := c.Get("userLogin")
	userId := int(userLogin.(jwt.MapClaims)["id"].(float64))

	validation := validator.New()
	err := validation.Struct(request)

	var transactionIsMatch = false
	var transactionId int
	for !transactionIsMatch {
		transactionId = int(time.Now().Unix())
		transactionData, _ := h.TransactionRepository.GetTransaction(transactionId)
		if transactionData.ID == 0 {
			transactionIsMatch = true
		}
	}

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	data := models.Transaction{
		ID:       transactionId,
		Quantity: request.Quantity,
		Total:    request.Total,
		TripID:   request.TripID,
		UserID:   userId,
		// Image:    request.Image,
	}

	response, err := h.TransactionRepository.CreateTransaction(data)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	// trip, _ := h.TripRepository.GetTrip(TripID)

	// if err != nil {
	// 	return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
	// 		Code:    http.StatusInternalServerError,
	// 		Message: err.Error()})
	// }

	// // trip.IncomeTripAdmin = trip.IncomeTripAdmin + Total

	// _, err = h.TripRepository.UpdateTrip(trip)

	// if err != nil {
	// 	return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
	// 		Code:    http.StatusInternalServerError,
	// 		Message: err.Error(),
	// 	})
	// }

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: response})
}

func (h *handlertransaction) GetMyTransaction(c echo.Context) error {
	claims := c.Get("userLogin")
	id := claims.(jwt.MapClaims)["id"].(float64)
	userID := int(id)

	transaction, err := h.TransactionRepository.GetMyTransaction(userID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: transaction})
}

func (h *handlertransaction) GetPayment(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	transaction, err := h.TransactionRepository.GetTransaction(id)
	fmt.Println(transaction)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	var s = snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)

	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(transaction.ID),
			GrossAmt: int64(transaction.Total),
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: transaction.User.FullName,
			Email: transaction.User.Email,
		},
	}

	snapResp, _ := s.CreateTransaction(req)

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: snapResp,
	})
}

func (h *handlertransaction) Notification(c echo.Context) error {
	var notificationPayload map[string]interface{}

	if err := c.Bind(&notificationPayload); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId := notificationPayload["order_id"].(string)

	order_Id, _ := strconv.Atoi(orderId)

	fmt.Println("ini payload yagesya", notificationPayload)

	transaction, _ := h.TransactionRepository.GetTransaction(order_Id)
	user, _ := h.UserRepository.GetUser(order_Id)

	trip, err := h.TripRepository.GetTrip(transaction.TripID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	trip.Quota = trip.Quota - transaction.Quantity
	trip.IncomeTripAdmin = trip.IncomeTripAdmin + transaction.Total

	_, err = h.TripRepository.UpdateTrip(trip)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		})
	}

	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			h.TransactionRepository.UpdateTransaction("Waiting Payment", order_Id)
		} else if fraudStatus == "accept" {

			SendMail("Approved", transaction, user)
			h.TransactionRepository.UpdateTransaction("Approved", order_Id)
		}
	} else if transactionStatus == "settlement" {

		SendMail("Approved", transaction, user)
		h.TransactionRepository.UpdateTransaction("Approved", order_Id)
	} else if transactionStatus == "deny" {
		h.TransactionRepository.UpdateTransaction("Failed", order_Id)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		h.TransactionRepository.UpdateTransaction("Failed", order_Id)
	} else if transactionStatus == "Waiting Payment" {
		h.TransactionRepository.UpdateTransaction("Waiting Payment", order_Id)
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: notificationPayload})

}

func SendMail(status string, transaction models.Transaction, user models.User) {
	if status != transaction.Status && (status == "Approved") {

		var CONFIG_SMTP_HOST = "smtp.gmail.com"
		var CONFIG_SMTP_PORT = 587
		var CONFIG_SENDER_NAME = "Dewe Tour <rizkiboediman@gmail.com>"
		var CONFIG_AUTH_EMAIL = os.Getenv("EMAIL_SYSTEM")
		var CONFIG_AUTH_PASSWORD = os.Getenv("PASSWORD_SYSTEM")

		var trip = transaction.Trip.Title
		var price = strconv.Itoa(transaction.Total)

		mailer := gomail.NewMessage()
		mailer.SetHeader("From", CONFIG_SENDER_NAME)
		mailer.SetHeader("To", transaction.User.Email)
		mailer.SetHeader("Subject", "Transaction Status")
		mailer.SetBody("text/html", fmt.Sprintf(`<!DOCTYPE html>
    <html lang="en">
      <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        h1 {
        color: brown;
        }
      </style>
      </head>
      <body>
      <h2>Product payment :</h2>
      <ul style="list-style-type:none;">
        <li>Title : %s</li>
        <li>Total payment: Rp.%s</li>
        <li>Status : <b>%s</b></li>
      </ul>
      </body>
    </html>`, trip, price, status))

		dialer := gomail.NewDialer(
			CONFIG_SMTP_HOST,
			CONFIG_SMTP_PORT,
			CONFIG_AUTH_EMAIL,
			CONFIG_AUTH_PASSWORD,
		)

		err := dialer.DialAndSend(mailer)
		if err != nil {
			log.Fatal(err.Error())
		}

		log.Println("Mail sent! to " + transaction.User.Email)
	}
}
