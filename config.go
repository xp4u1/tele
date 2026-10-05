package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

type Config struct {
	Server ServerConfig `mapstructure:"server"`
}

type ServerConfig struct {
	Address     string `mapstructure:"address"`
	OpenBrowser bool   `mapstructure:"open_browser"`
}

func LoadConfig() (*Config, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return nil, fmt.Errorf("get config directory: %w", err)
	}

	appDir := filepath.Join(configDir, "tele")
	configFile := filepath.Join(appDir, "config.toml")

	v := viper.New()
	v.SetConfigFile(configFile)
	v.SetConfigType("toml")

	v.SetDefault("server.address", "127.0.0.1:7700")
	v.SetDefault("server.open_browser", false)

	if err := v.ReadInConfig(); err != nil {
		if !os.IsNotExist(err) {
			return nil, fmt.Errorf("read config: %w", err)
		}

		if err := os.MkdirAll(appDir, 0o755); err != nil {
			return nil, fmt.Errorf("create config directory: %w", err)
		}

		if err := v.WriteConfigAs(configFile); err != nil {
			return nil, fmt.Errorf("create config file: %w", err)
		}
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("unmarshal config: %w", err)
	}

	return &cfg, nil
}
