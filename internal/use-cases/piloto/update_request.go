package piloto

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/validator"
)

type UpdatePilotoReq struct {
	Name          string `json:"name"`
	Slug          string `json:"slug"`
	Number        int32  `json:"number"`
	BirthYear     int32  `json:"birthYear"`
	City          string `json:"city"`
	TeamSlug      string `json:"teamSlug"`
	CategorySlug  string `json:"categorySlug"`
}

func (req UpdatePilotoReq) Valid(context.Context) validator.Evaluator {
	var eval validator.Evaluator
	eval.CheckField(validator.NotBlank(req.Name), "name", "must not be blank")
	eval.CheckField(validator.NotBlank(req.Slug), "slug", "must not be blank")
	eval.CheckField(req.Number >= 0, "number", "must be >= 0")
	eval.CheckField(req.BirthYear > 0, "birthYear", "must be positive")
	eval.CheckField(validator.NotBlank(req.City), "city", "must not be blank")
	eval.CheckField(validator.NotBlank(req.TeamSlug), "teamSlug", "must not be blank")
	eval.CheckField(validator.NotBlank(req.CategorySlug), "categorySlug", "must not be blank")
	return eval
}
