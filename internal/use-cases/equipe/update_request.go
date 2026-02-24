package equipe

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/validator"
)

type UpdateEquipeReq struct {
	Name        string `json:"name"`
	Color       string `json:"color"`
	FoundedYear int32  `json:"foundedYear"`
	City        string `json:"city"`
}

func (req UpdateEquipeReq) Valid(context.Context) validator.Evaluator {
	var eval validator.Evaluator
	eval.CheckField(validator.NotBlank(req.Name), "name", "must not be blank")
	eval.CheckField(validator.NotBlank(req.Color), "color", "must not be blank")
	eval.CheckField(req.FoundedYear > 0, "foundedYear", "must be positive")
	eval.CheckField(validator.NotBlank(req.City), "city", "must not be blank")
	return eval
}
