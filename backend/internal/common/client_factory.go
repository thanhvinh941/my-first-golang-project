package common

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"my-project/backend/internal/constant"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
)

type ClientFactory interface {
	GetClient(src constant.ProviderSource) (*http.Client, ProviderConfig, error)
}

type RestClientFactory struct {
	Providers ProviderProperties
	Server    ServerProperties
	Logger    *log.Logger
	// Có thể lưu per-source client nếu cần
	perSource map[constant.ProviderSource]*http.Client
}

func NewRestClientFactory(props ProviderProperties, server ServerProperties, logger *log.Logger) *RestClientFactory {
	if logger == nil {
		logger = log.New(os.Stdout, "", log.LstdFlags)
	}
	return &RestClientFactory{
		Providers: props,
		Server:    server,
		Logger:    logger,
		perSource: make(map[constant.ProviderSource]*http.Client),
	}
}

func (f *RestClientFactory) RegisterClient(src constant.ProviderSource, client *http.Client) {
	f.perSource[src] = client
}

func (f *RestClientFactory) GetClient(src constant.ProviderSource) (*http.Client, ProviderConfig, error) {
	key := src
	if key == "" {
		key = constant.MAS
	}

	cfg, ok := f.Providers.Providers[string(key)]
	if !ok {
		return nil, ProviderConfig{}, fmt.Errorf("provider not found: %s", key)
	}

	// Nếu đã có client riêng cho provider
	if c, ok := f.perSource[key]; ok && c != nil {
		return wrapWithLogging(c, f.Logger), cfg, nil
	}

	// Tạo client mặc định
	def := &http.Client{
		Timeout:   20 * time.Second,
		Transport: wrapTransportWithLogging(http.DefaultTransport, f.Logger),
	}

	return def, cfg, nil
}

// ---- Helper: Transport logging giống requestInterceptor của Java ----

func wrapWithLogging(c *http.Client, logger *log.Logger) *http.Client {
	tr := c.Transport
	if tr == nil {
		tr = http.DefaultTransport
	}
	c.Transport = wrapTransportWithLogging(tr, logger)
	return c
}

type loggingTransport struct {
	base   http.RoundTripper
	logger *log.Logger
}

func wrapTransportWithLogging(base http.RoundTripper, logger *log.Logger) http.RoundTripper {
	return &loggingTransport{base: base, logger: logger}
}

func (t *loggingTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	// Gắn headers giống Java
	req.Header.Set("X-Request-ID", uuid.NewString())
	if req.Header.Get("Content-Type") == "" {
		req.Header.Set("Content-Type", "application/json")
	}

	// Log request
	t.logger.Println("=== API CALL INFO ===")
	t.logger.Printf("➡️ URL: %s\n", req.URL.String())
	t.logger.Printf("➡️ Method: %s\n", req.Method)
	t.logger.Printf("➡️ Headers: %v\n", req.Header)

	// Log body (không phá stream)
	var bodyCopy []byte
	if req.Body != nil {
		buf, _ := io.ReadAll(req.Body)
		bodyCopy = buf
		// reset Body cho vòng đời request
		req.Body = io.NopCloser(bytes.NewBuffer(buf))
		t.logger.Printf("➡️ Body: %s\n", string(bodyCopy))
	} else {
		t.logger.Println("➡️ Body: <nil>")
	}

	// Execute
	resp, err := t.base.RoundTrip(req)
	if err != nil {
		t.logger.Printf("❌ Error: %v\n", err)
		t.logger.Println("======================")
		return nil, err
	}

	t.logger.Printf("⬅️ Response Status: %s\n", resp.Status)
	t.logger.Println("======================")
	return resp, nil
}
