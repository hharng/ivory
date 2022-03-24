package model

import (
	"github.com/google/uuid"
)

type DbConnection struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Target struct {
	DbName        string `json:"dbName"`
	Schema        string `json:"schema"`
	Table         string `json:"table"`
	ExcludeSchema string `json:"excludeSchema"`
	ExcludeTable  string `json:"excludeTable"`
}

type CompactTableRequest struct {
	Connection DbConnection `json:"connection"`
	Target     *Target      `json:"target"`
	Ratio      int          `json:"ratio"`
}

type CompactTableModel struct {
	Uuid        uuid.UUID `json:"uuid"`
	Status      JobStatus `json:"status"`
	Command     string    `json:"command"`
	CommandArgs []string  `json:"commandArgs"`
	LogsPath    string    `json:"logsPath"`
	CreatedAt   int64     `json:"createdAt"`
}