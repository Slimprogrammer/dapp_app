import React, { useEffect, useState } from "react";
import { useConnectionStore } from "../store/useConnectionStore";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  ListGroup,
  Nav, // Import Nav for tabs
  Tab, // Import Tab for tab content
} from "react-bootstrap";
import styles from "../Assets/styles/Profile.module.css";

export default function Profile() {
  const { user } = useConnectionStore();
  const [assets, setAssets] = useState({});
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [viewId, setViewId] = useState("Assets");
  // New state for managing active tab within AssetDetails
  const [assetDetailTab, setAssetDetailTab] = useState("detail");

  useEffect(() => {
    if (user) {
      const assetList = user.getAllAssets(); // returns array of Asset instances
      const assetMap = {};
      for (const asset of assetList) {
        assetMap[asset.asset_name] = asset; // preserve full Asset class instances
      }
      setAssets(assetMap);
    }
  }, [user]);

  const handleClick = (viewName, assetSymbol = null) => {
    setViewId(viewName);
    setSelectedAsset(assetSymbol);
    // When switching to AssetDetails, reset the inner tab to 'detail'
    if (viewName === "AssetDetails") {
      setAssetDetailTab("detail");
    }
    console.log(`Switched to view: ${viewName}`);
    if (assetSymbol) {
      console.log(`Selected Asset: ${assetSymbol}`);
    }
  };

  const handleBackToAssets = () => {
    handleClick("Assets");
  };

  // Handler for changing tabs within AssetDetails
  const handleAssetDetailTabChange = (tabKey) => {
    setAssetDetailTab(tabKey);
  };

  return (
    <div className="p-4">
      {user && (
        <div>
          <Container className="mt-4">
            <Card className="p-3">
              <Row className="mb-3">
                <Col>
                  <strong>Total Funds (USDT)</strong>
                  <br />${user.total_asset_available}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Staking Account (USDT)</strong>
                  <br />
                  $0
                </Col>
                <Col>
                  <strong>Trading Account (USDT)</strong>
                  <br />
                  $0
                </Col>
              </Row>

              {/* Removed the row containing the main navigation buttons */}
              {/*
              <Row fluid className="d-flex gap-2 ">
                <Col className="d-flex justify-content-center align-items-center">
                  <Button
                    onClick={() => handleClick("Assets")}
                    variant="primary"
                  >
                    Assets
                  </Button>
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                  <Button
                    onClick={() => handleClick("Deposit")}
                    variant="primary"
                  >
                    Deposit
                  </Button>
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                  <Button
                    onClick={() => handleClick("Withdraw")}
                    variant="primary"
                  >
                    Withdraw
                  </Button>
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                  <Button onClick={() => handleClick("Swap")} variant="primary">
                    Swap
                  </Button>
                </Col>
              </Row>
              */}
            </Card>

            {/* Conditionally render Assets List or Asset Details */}
            {viewId === "Assets" && (
              <Card className="mt-3">
                <Card.Header>Assets</Card.Header>
                <ListGroup variant="flush">
                  {Object.keys(assets).length > 0 ? (
                    Object.keys(assets).map((symbol) => (
                      <ListGroup.Item
                        key={symbol}
                        onClick={() => handleClick("AssetDetails", symbol)}
                        className={`${styles.assetListItem} d-flex justify-content-between align-items-center`}
                      >
                        <Container>
                          <Row fluid className="d-flex gap-2 ">
                            <Col className="d-flex justify-content-left align-items-center">
                              <img
                                src={
                                  assets[symbol]?.logoUrl ||
                                  "https://placehold.co/40x40/cccccc/ffffff?text=No+Logo"
                                } // Add a fallback logo
                                alt={`${
                                  assets[symbol]?.asset_name || symbol
                                } logo`}
                                style={{ width: "40px", height: "40px" }}
                              />
                              <div className="p-2">
                                <strong>{assets[symbol]?.asset_name}</strong>
                                <br />
                                <small>
                                  Available:{" "}
                                  {assets[symbol]?.total_asset_available} |
                                  Freeze: 0
                                </small>
                              </div>
                            </Col>
                            <Col className="d-flex justify-content-end align-items-center">
                              <span>$0</span>
                            </Col>
                          </Row>
                        </Container>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item>No assets to display.</ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            )}

            {/* Asset Details View with Tabs */}
            {viewId === "AssetDetails" &&
              selectedAsset &&
              assets[selectedAsset] && (
                <Card className="mt-3">
                  <Card.Header className="d-flex align-items-center">
                    <Button
                      variant="link"
                      onClick={handleBackToAssets}
                      className="p-0 me-2"
                      aria-label="Back to Assets"
                    >
                      &larr; {/* Left arrow character */}
                    </Button>
                    <h5 className="mb-0 me-auto">
                      {assets[selectedAsset].asset_name}
                    </h5>
                    <Nav
                      variant="tabs"
                      activeKey={assetDetailTab}
                      onSelect={handleAssetDetailTabChange}
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="detail">Detail</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="deposit">Deposit</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="withdraw">Withdraw</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="swap">Swap</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>
                  <Card.Body>
                    <Tab.Container
                      activeKey={assetDetailTab}
                      onSelect={handleAssetDetailTabChange}
                    >
                      <Tab.Content>
                        <Tab.Pane eventKey="detail">
                          {/* Detail Content */}
                          <h6>Asset Information</h6>
                          {Object.keys(assets[selectedAsset].toKeyValue()).map(
                            (key) => {
                              const value =
                                assets[selectedAsset].toKeyValue()[key];
                              return (
                                <div key={key}>
                                  {value &&
                                  typeof value === "object" &&
                                  !Array.isArray(value) ? (
                                    <details className="mb-2">
                                      <summary>
                                        <strong>{key}</strong>
                                      </summary>
                                      <div style={{ paddingLeft: "1rem" }}>
                                        {Object.keys(value).map((subKey) => (
                                          <p key={subKey}>
                                            <strong>{subKey}:</strong>{" "}
                                            {typeof value[subKey] === "object"
                                              ? JSON.stringify(
                                                  value[subKey],
                                                  null,
                                                  2
                                                )
                                              : value[subKey]?.toString()}
                                          </p>
                                        ))}
                                      </div>
                                    </details>
                                  ) : (
                                    <p>
                                      <strong>{key}:</strong>{" "}
                                      {typeof value === "object"
                                        ? JSON.stringify(value, null, 2)
                                        : value?.toString()}
                                    </p>
                                  )}
                                </div>
                              );
                            }
                          )}

                          {/* <h6>Asset Information</h6>
                          <p>ID: {assets[selectedAsset].id}</p>
                          <p>User ID: {assets[selectedAsset].user_id}</p>
                          <p>
                            Available:{" "}
                            {assets[selectedAsset].total_asset_available}
                          </p>
                          <p>
                            Staked: {assets[selectedAsset].total_asset_staked}
                          </p>
                          <p>
                            Unstaked:{" "}
                            {assets[selectedAsset].total_asset_unstaked}
                          </p>
                          <p>
                            Withdrawn:{" "}
                            {assets[selectedAsset].total_asset_withdrawn}
                          </p>
                          <p>
                            Deposited:{" "}
                            {assets[selectedAsset].total_asset_deposited}
                          </p>
                          <p>
                            Pending: {assets[selectedAsset].total_asset_pending}
                          </p>
                          <p>
                            Traded: {assets[selectedAsset].total_asset_traded}
                          </p>
                          <p>
                            Earned: {assets[selectedAsset].total_asset_earned}
                          </p>
                          */}
                        </Tab.Pane>
                        <Tab.Pane eventKey="deposit">
                          {/* Deposit Content */}
                          <h6>Deposit {assets[selectedAsset].asset_name}</h6>
                          <p>
                            Deposit functionality for{" "}
                            {assets[selectedAsset].asset_name} goes here.
                          </p>
                          {/* Example: Input for amount, deposit address display */}
                          <div className="mb-3">
                            <label
                              htmlFor="depositAmount"
                              className="form-label"
                            >
                              Amount
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="depositAmount"
                              placeholder="Enter amount"
                            />
                          </div>
                          <Button variant="success">Initiate Deposit</Button>
                        </Tab.Pane>
                        <Tab.Pane eventKey="withdraw">
                          {/* Withdraw Content */}
                          <h6>Withdraw {assets[selectedAsset].asset_name}</h6>
                          <p>
                            Withdraw functionality for{" "}
                            {assets[selectedAsset].asset_name} goes here.
                          </p>
                          {/* Example: Input for amount, recipient address */}
                          <div className="mb-3">
                            <label
                              htmlFor="withdrawAmount"
                              className="form-label"
                            >
                              Amount
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="withdrawAmount"
                              placeholder="Enter amount"
                            />
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor="withdrawAddress"
                              className="form-label"
                            >
                              Recipient Address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="withdrawAddress"
                              placeholder="Enter address"
                            />
                          </div>
                          <Button variant="danger">Initiate Withdrawal</Button>
                        </Tab.Pane>
                        <Tab.Pane eventKey="swap">
                          {/* Swap Content */}
                          <h6>Swap {assets[selectedAsset].asset_name}</h6>
                          <p>
                            Swap functionality for{" "}
                            {assets[selectedAsset].asset_name} goes here.
                          </p>
                          {/* Example: Swap form */}
                          <div className="mb-3">
                            <label
                              htmlFor="swapFromAmount"
                              className="form-label"
                            >
                              Amount to Swap
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="swapFromAmount"
                              placeholder="Enter amount"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="swapToAsset" className="form-label">
                              Swap To
                            </label>
                            <select className="form-select" id="swapToAsset">
                              <option>Select Asset</option>
                              {/* Filter out the current asset from options */}
                              {Object.keys(assets)
                                .filter((s) => s !== selectedAsset)
                                .map((s) => (
                                  <option key={s} value={s}>
                                    {assets[s].asset_name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <Button variant="info">Perform Swap</Button>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </Card.Body>
                </Card>
              )}

            {/* Other top-level views (Deposit, Withdraw, Swap) - these are now separate from AssetDetails */}
            {viewId === "Deposit" &&
              !selectedAsset && ( // Ensure these only show if no specific asset is selected for detail
                <Card className="mt-3">
                  <Card.Header>Deposit Funds (General)</Card.Header>
                  <Card.Body>
                    <p>
                      This is a general deposit section, not tied to a specific
                      asset from the list.
                    </p>
                    <Button onClick={handleBackToAssets}>Back to Assets</Button>
                  </Card.Body>
                </Card>
              )}

            {viewId === "Withdraw" && !selectedAsset && (
              <Card className="mt-3">
                <Card.Header>Withdraw Funds (General)</Card.Header>
                <Card.Body>
                  <p>
                    This is a general withdraw section, not tied to a specific
                    asset from the list.
                  </p>
                  <Button onClick={handleBackToAssets}>Back to Assets</Button>
                </Card.Body>
              </Card>
            )}

            {viewId === "Swap" && !selectedAsset && (
              <Card className="mt-3">
                <Card.Header>Swap Assets (General)</Card.Header>
                <Card.Body>
                  <p>
                    This is a general swap section, not tied to a specific asset
                    from the list.
                  </p>
                  <Button onClick={handleBackToAssets}>Back to Assets</Button>
                </Card.Body>
              </Card>
            )}
          </Container>
        </div>
      )}
    </div>
  );
}
