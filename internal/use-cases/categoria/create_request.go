package categoria

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/validator"
)

type CreateCategoriaReq struct {
	Slug        string `json:"slug"`
	Name        string `json:"name"`
	MinAge      int32  `json:"minAge"`
	MaxAge      int32  `json:"maxAge"`
	Description string `json:"description"`
}

func (req CreateCategoriaReq) Valid(context.Context) validator.Evaluator {
	var eval validator.Evaluator
	eval.CheckField(validator.NotBlank(req.Slug), "slug", "must not be blank")
	eval.CheckField(validator.NotBlank(req.Name), "name", "must not be blank")
	eval.CheckField(req.MinAge >= 0, "minAge", "must be >= 0")
	eval.CheckField(req.MaxAge >= req.MinAge, "maxAge", "must be >= minAge")
	eval.CheckField(validator.NotBlank(req.Description), "description", "must not be blank")
	return eval
}
