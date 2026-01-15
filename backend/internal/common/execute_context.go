// internal/external/execute_context.go
package common

import (
	"context"
	"my-project/backend/internal/constant"
)

type ctxKey string

const sourceKey ctxKey = "providerSource"

func WithCurrentSource(ctx context.Context, src constant.ProviderSource) context.Context {
	return context.WithValue(ctx, sourceKey, src)
}

func GetCurrentSource(ctx context.Context) constant.ProviderSource {
	v := ctx.Value(sourceKey)
	if s, ok := v.(constant.ProviderSource); ok {
		return s
	}
	// Fallback giống Java: nếu không set thì dùng MAS
	return constant.MAS
}
