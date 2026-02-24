package admin

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/validator"
)

type LoginAdminReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (req LoginAdminReq) Valid(context.Context) validator.Evaluator {
	var eval validator.Evaluator
	eval.CheckField(validator.Matches(req.Email, validator.EmailRX), "email", "must be a valid email")
	eval.CheckField(validator.NotBlank(req.Password), "password", "must be not blank")
	return eval
}
