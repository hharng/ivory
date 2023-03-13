package model

import (
	"github.com/google/uuid"
)

type QueryType int8

const (
	BLOAT QueryType = iota
	ACTIVITY
	REPLICATION
	STATISTIC
	OTHER
)

type QueryCreation string

const (
	Manual QueryCreation = "manual"
	System               = "system"
)

type Query struct {
	Id          uuid.UUID     `json:"id"`
	Name        string        `json:"name"`
	Type        QueryType     `json:"type"`
	Creation    QueryCreation `json:"creation"`
	Description string        `json:"description"`
	Default     string        `json:"default"`
	Custom      string        `json:"custom"`
}

type QueryRequest struct {
	Name        *string    `json:"name"`
	Type        *QueryType `json:"type"`
	Description *string    `json:"description"`
	Query       string     `json:"query"`
}

type QueryRunRequest struct {
	QueryUuid   uuid.UUID `json:"queryUuid"`
	ClusterName string    `json:"clusterName"`
	Db          Database  `json:"db"`
}

type QueryKillRequest struct {
	Pid         int      `json:"pid"`
	ClusterName string   `json:"clusterName"`
	Db          Database `json:"db"`
}

type QueryChartRequest struct {
	ClusterName string   `json:"clusterName"`
	Db          Database `json:"db"`
}

type QueryField struct {
	Name        string `json:"name"`
	DataType    string `json:"dataType"`
	DataTypeOID uint32 `json:"dataTypeOID"`
}

type QueryRunResponse struct {
	Fields []QueryField `json:"fields"`
	Rows   [][]any      `json:"rows"`
}

type QueryChart struct {
	DbCount         int64  `json:"dbCount"`
	SchemaCount     int64  `json:"schemaCount"`
	ConnectionCount int64  `json:"connectionCount"`
	TotalSize       string `json:"totalSize"`
	IndexSize       string `json:"indexSize"`
	TableSize       string `json:"tableSize"`
	Uptime          string `json:"uptime"`
}
