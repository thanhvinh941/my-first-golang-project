// internal/external/endpoint_resolver.go
package common

import (
	"fmt"
	"my-project/backend/internal/constant"
)

type EndpointResolver interface {
	GetEndpoint(cfg ProviderConfig, et constant.EndpointType) (string, error)
}

type StaticEndpointResolver struct{}

func NewStaticEndpointResolver() *StaticEndpointResolver {
	return &StaticEndpointResolver{}
}

// Tương tự Java: switch theo EndpointType, lấy từ ProviderConfig
func (r *StaticEndpointResolver) GetEndpoint(cfg ProviderConfig, et constant.EndpointType) (string, error) {
	switch et {
	case constant.MARKET:
		return cfg.Market, nil
	case constant.TRADING:
		return cfg.Trading, nil
	case constant.FOREIGN:
		return cfg.Foreign, nil
	case constant.STATIC_DATA:
		return cfg.StaticData, nil
	default:
		return "", fmt.Errorf("invalid endpoint type: %s", et)
	}
}
