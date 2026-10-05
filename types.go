package main

type Script struct {
	Block    []Block        `json:"blocks"`
	Metadata map[string]any `json:"metadata"`
}

type Block struct {
	BlockId int    `json:"blockId"`
	SlideId int    `json:"slideId"`
	HTML    string `json:"html"`
}

type PresentationState struct {
	Script         Script `json:"script"`
	CurrentBlockId int    `json:"currentBlockId"`
}

type PresentationPosition struct {
	BlockID int `json:"blockId"`
}
