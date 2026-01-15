package common

import (
	"os"

	"github.com/goccy/go-yaml"
)

type ProviderConfig struct {
	BaseURL    string `json:"baseUrl"    yaml:"baseUrl"`
	Market     string `json:"market"     yaml:"market"`
	Trading    string `json:"trading"    yaml:"trading"`
	Foreign    string `json:"foreign"    yaml:"foreign"`
	StaticData string `json:"staticData" yaml:"staticData"`
}

type ProviderProperties struct {
	// key là ProviderSource.Value() — ví dụ "MAS", "OPENAI"
	Providers map[string]ProviderConfig `json:"providers" yaml:"providers"`
}

type ServerProperties struct {
	Port int `json:"port" yaml:"port"`
}

type RootConfig struct {
	Config struct {
		Providers ProviderProperties `yaml:"providers"`
		Server    ServerProperties   `yaml:"server"`
	} `yaml:"config"`
}

func LoadConfigYAML(path string) (ProviderProperties, ServerProperties, error) {
	var root RootConfig
	b, err := os.ReadFile(path)
	if err != nil {
		return ProviderProperties{}, ServerProperties{}, err
	}
	if err := yaml.Unmarshal(b, &root); err != nil {
		return ProviderProperties{}, ServerProperties{}, err
	}
	return root.Config.Providers, root.Config.Server, nil
}
