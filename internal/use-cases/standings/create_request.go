package standings

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/validator"
)

type CreatePilotoTemporadaReq struct {
	PilotoCpf     string `json:"pilotoCpf"`
	Temporada     string `json:"temporada"`
	CategoriaSlug string `json:"categoriaSlug"`
	EquipeSlug    string `json:"equipeSlug"`
	Pontos        int32  `json:"pontos"`
	Vitorias      int32  `json:"vitorias"`
	Podios        int32  `json:"podios"`
	MelhorVolta   string `json:"melhorVolta"`
	Posicao       int32  `json:"posicao"`
}

func (req CreatePilotoTemporadaReq) Valid(context.Context) validator.Evaluator {
	var eval validator.Evaluator
	eval.CheckField(validator.NotBlank(req.PilotoCpf), "pilotoCpf", "must not be blank")
	eval.CheckField(validator.NotBlank(req.Temporada), "temporada", "must not be blank")
	eval.CheckField(validator.NotBlank(req.CategoriaSlug), "categoriaSlug", "must not be blank")
	eval.CheckField(validator.NotBlank(req.EquipeSlug), "equipeSlug", "must not be blank")
	return eval
}
