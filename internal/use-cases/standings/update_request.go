package standings

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/validator"
)

type UpdatePilotoTemporadaReq struct {
	EquipeSlug  string `json:"equipeSlug"`
	Pontos      int32  `json:"pontos"`
	Vitorias    int32  `json:"vitorias"`
	Podios      int32  `json:"podios"`
	MelhorVolta string `json:"melhorVolta"`
	Posicao     int32  `json:"posicao"`
}

func (req UpdatePilotoTemporadaReq) Valid(context.Context) validator.Evaluator {
	var eval validator.Evaluator
	eval.CheckField(validator.NotBlank(req.EquipeSlug), "equipeSlug", "must not be blank")
	return eval
}
