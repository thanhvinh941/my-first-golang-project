package service

import (
	"context"
	"my-project/backend/internal/common"
	"my-project/backend/internal/constant"
)

type IExternalSymbolService interface {
	GetSymbolStaticData(ctx context.Context) (map[string]any, error)
}

type ExternalSymbolService struct {
	call common.CallApiService
}

func NewExternalSymbolService(call common.CallApiService) IExternalSymbolService {
	return &ExternalSymbolService{call: call}
}

func (s *ExternalSymbolService) GetSymbolStaticData(ctx context.Context) (map[string]any, error) {
	// Set provider source trong context (fallback "mas" nếu không set)
	// Nếu bạn set ở handler, có thể bỏ dòng sau:
	ctx = common.WithCurrentSource(ctx, constant.MAS)

	headers := map[string]string{
		// Nếu cần token/headers khác, thêm ở đây
		// "Authorization": "Bearer <token>",
	}
	query := map[string]string{
		// Nếu cần tham số query, thêm ở đây
	}

	// Gọi GET tới endpoint STATIC_DATA, path rỗng (vì staticData đã là "media/config")
	// Nếu bạn muốn bổ sung path con, truyền "xxx" thay vì "".
	data, err := s.call.CallApiGet(ctx, "symbol_static_data.json", "", headers, query)
	if err != nil {
		return nil, err
	}

	// Trường hợp API trả về mảng -> lấy phần tử đầu tiên, hoặc merge tùy ý
	if len(data) == 0 {
		return map[string]any{}, nil
	}
	return data[0], nil
}
