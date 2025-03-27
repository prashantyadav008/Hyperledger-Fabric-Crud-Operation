package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Asset represents a simple asset with additional fields
type Asset struct {
	ID     string `json:"id"`
	Color  string `json:"color"`
	Amount string `json:"amount"`
	Owner  string `json:"owner"`
}

// SmartContract provides functions for CRUD operations
type SmartContract struct {
	contractapi.Contract
}

// CreateAsset adds a new asset to the ledger
func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, id string, color string, amount string, owner string) error {
	exists, err := s.AssetExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("asset with ID %s already exists", id)
	}

	asset := Asset{
		ID:     id,
		Color:  color,
		Amount: amount,
		Owner:  owner,
	}

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, assetJSON)
}

// ReadAsset retrieves an asset from the ledger
func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read asset from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the asset %s does not exist", id)
	}

	var asset Asset
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// UpdateAsset updates an existing asset on the ledger
func (s *SmartContract) UpdateAsset(ctx contractapi.TransactionContextInterface, id string, color string, amount string, owner string) error {
	exists, err := s.AssetExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("asset with ID %s does not exist", id)
	}

	asset := Asset{
		ID:     id,
		Color:  color,
		Amount: amount,
		Owner:  owner,
	}

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, assetJSON)
}

// DeleteAsset removes an asset from the ledger
func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.AssetExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("asset with ID %s does not exist", id)
	}

	return ctx.GetStub().DelState(id)
}

// AssetExists checks if an asset exists in the ledger
func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, err
	}
	return assetJSON != nil, nil
}

// GetAllAssets returns all assets stored in the ledger
func (s *SmartContract) GetAllAssets(ctx contractapi.TransactionContextInterface) ([]*Asset, error) {
	// Use a range query to fetch all assets
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf("failed to get assets by range: %v", err)
	}
	defer resultsIterator.Close()

	var assets []*Asset
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to iterate over assets: %v", err)
		}

		var asset Asset
		err = json.Unmarshal(queryResponse.Value, &asset)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal asset: %v", err)
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating asset chaincode: %s\n", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting asset chaincode: %s\n", err)
	}
}
