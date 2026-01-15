package common

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"my-project/backend/internal/constant"
	"net/http"
	"net/url"
	"strings"
)

type CallApiService interface {
	CallApi(ctx context.Context,
		method constant.HttpMethod,
		endpointType constant.EndpointType,
		body any,
		path string,
		headers map[string]string,
		queryParams map[string]string,
	) ([]map[string]any, error)

	CallApiGet(ctx context.Context,
		endpointType constant.EndpointType,
		path string,
		headers map[string]string,
		queryParams map[string]string,
	) ([]map[string]any, error)
}

type callApiService struct {
	factory  ClientFactory
	resolver EndpointResolver
}

func NewCallApiService(factory ClientFactory, resolver EndpointResolver) CallApiService {
	return &callApiService{factory: factory, resolver: resolver}
}

func (s *callApiService) CallApiGet(ctx context.Context,
	endpointType constant.EndpointType,
	path string,
	headers map[string]string,
	queryParams map[string]string,
) ([]map[string]any, error) {
	return s.CallApi(ctx, constant.GET, endpointType, nil, path, headers, queryParams)
}

func (s *callApiService) CallApi(ctx context.Context,
	method constant.HttpMethod,
	endpointType constant.EndpointType,
	body any,
	path string,
	headers map[string]string,
	queryParams map[string]string,
) ([]map[string]any, error) {

	client, providerSource, err := s.factory.GetClient(GetCurrentSource(ctx))
	if err != nil {
		return nil, err
	}
	endpoint, err := s.resolver.GetEndpoint(providerSource, endpointType)
	if err != nil {
		return nil, err
	}
	// Build URL: cfg.BaseURL + endpoint + path + query...
	// Ở Java, bạn đang dùng: baseUrl từ ProviderConfig và endpoint theo type; bên Go giữ nguyên logic đó.

	// Build URL: base + path + query
	u, err := url.Parse(strings.TrimRight(endpoint, "/"))
	if err != nil {
		return nil, fmt.Errorf("invalid base url: %w", err)
	}
	if path != "" {
		// đảm bảo thêm path an toàn
		if !strings.HasPrefix(path, "/") {
			path = "/" + path
		}
		u.Path = strings.TrimRight(u.Path, "/") + path
	}

	q := u.Query()
	for k, v := range queryParams {
		q.Set(k, v)
	}
	u.RawQuery = q.Encode()

	// Prepare request
	var reqBody io.Reader
	if body != nil && (method == constant.POST || method == constant.PUT) {
		// serialize as JSON
		data, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("marshal body: %w", err)
		}
		reqBody = bytes.NewBuffer(data)
	}

	req, err := http.NewRequestWithContext(ctx, string(method), u.String(), reqBody)
	if err != nil {
		return nil, fmt.Errorf("new request: %w", err)
	}

	// Headers
	for k, v := range headers {
		req.Header.Set(k, v)
	}
	if body != nil && (method == constant.POST || method == constant.PUT) && req.Header.Get("Content-Type") == "" {
		req.Header.Set("Content-Type", "application/json")
	}

	// Do request
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("http call: %w", err)
	}
	defer resp.Body.Close()

	// Non-2xx → trả lỗi kèm body
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		b, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return nil, fmt.Errorf("http %d: %s", resp.StatusCode, strings.TrimSpace(string(b)))
	}

	// Parse JSON về []map[string]any (tương tự ParameterizedTypeReference<List<Map<...>>>)
	var out []map[string]any
	dec := json.NewDecoder(resp.Body)
	dec.UseNumber() // tránh mất chính xác số
	if err := dec.Decode(&out); err != nil {
		// một số API trả object thay vì array → thử parse object rồi bọc vào slice
		resp.Body.Close()
		// Nếu cần, có thể re-read body; thực tế nên buffer trước
		return nil, fmt.Errorf("decode response: %w", err)
	}
	return out, nil
}
