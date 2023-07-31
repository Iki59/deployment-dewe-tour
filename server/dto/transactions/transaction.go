package transactionsdto

type CreateTransactionRequest struct {
	Quantity int `json:"quantity" form:"quantity" validation:"required"`
	Total    int `json:"total" form:"total" validation:"required"`
	TripID   int `json:"trip_id" form:"trip_id" validation:"required"`
}
