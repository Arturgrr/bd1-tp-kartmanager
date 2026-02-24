package resultado

import (
	"context"

	"github.com/arturgrr/bd1-kartmanager/internal/validator"
)

type UpdateResultadoReq struct {
	PilotoCpf   string `json:"pilotoCpf"`
	EquipeSlug  string `json:"equipeSlug"`
	MelhorVolta string `json:"melhorVolta"`
	TempoTotal  string `json:"tempoTotal"`
	Pontos      int32  `json:"pontos"`
}

func (req UpdateResultadoReq) Valid(context.Context) validator.Evaluator {
	var eval validator.Evaluator
	eval.CheckField(validator.NotBlank(req.PilotoCpf), "pilotoCpf", "must not be blank")
	eval.CheckField(validator.NotBlank(req.EquipeSlug), "equipeSlug", "must not be blank")
	eval.CheckField(validator.NotBlank(req.TempoTotal), "tempoTotal", "must not be blank")
	return eval
}
