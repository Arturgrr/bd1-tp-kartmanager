package corrida

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/validator"
)

type UpdateCorridaReq struct {
	Name          string `json:"name"`
	Date          string `json:"date"`
	Track         string `json:"track"`
	CategorySlug  string `json:"categorySlug"`
	Season        string `json:"season"`
	Status        string `json:"status"`
}

func (req UpdateCorridaReq) Valid(context.Context) validator.Evaluator {
	var eval validator.Evaluator
	eval.CheckField(validator.NotBlank(req.Name), "name", "must not be blank")
	eval.CheckField(validator.NotBlank(req.Date), "date", "must not be blank")
	eval.CheckField(validator.NotBlank(req.Track), "track", "must not be blank")
	eval.CheckField(validator.NotBlank(req.CategorySlug), "categorySlug", "must not be blank")
	eval.CheckField(validator.NotBlank(req.Season), "season", "must not be blank")
	eval.CheckField(validator.NotBlank(req.Status), "status", "must not be blank")
	return eval
}
