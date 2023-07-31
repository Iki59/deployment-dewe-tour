package tripsdto

type TripRequest struct {
	Title          string `json:"title" form:"title" validation:"required"`
	CountryID      int    `json:"country_id"`
	Accomodation   string `json:"accomodation" form:"accomodation" validation:"required"`
	Transportation string `json:"transportation" form:"transportation" validation:"required"`
	Day            int    `json:"day" form:"day" validation:"required"`
	Night          int    `json:"night" form:"night" validation:"required"`
	DateTrip       string `json:"date_trip" form:"date_trip" validation:"required"`
	Price          int    `json:"price" form:"price" validation:"required"`
	Quota          int    `json:"quota" form:"quota" validation:"required"`
	Description    string `json:"description" form:"description" validation:"required"`
	Image          string `json:"image" form:"image" validation:"required"`
}
