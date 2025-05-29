import React, { useEffect, useState } from "react";
import { useConnectionStore } from "../store/useConnectionStore";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Stack,
  Row,
  Col,
  Button,
  Card,
  ListGroup,
} from "react-bootstrap";
import Usdt from "../Assets/Images/usdt.png";
import Bnb from "../Assets/Images/bnb.png";
import Eth from "../Assets/Images/eth.png";
import Doge from "../Assets/Images/doge.png";
import Shib from "../Assets/Images/shib.png";
import Xrp from "../Assets/Images/xrp.png";
import Etc from "../Assets/Images/btc.png";
import Pepe from "../Assets/Images/pepe.png";
import Bch from "../Assets/Images/bch.png";
import Sol from "../Assets/Images/sol.png";

export default function Profile() {
  const { walletAddress, user } = useConnectionStore();
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(0);

  const [viewId, setViewId] = useState("Assets");
  useEffect(() => {
    if (user) {
      const fetchedAssets = user.toFullObject()["assets"]; // safeguard in case method is undefined
      if (fetchedAssets) {
        setAssets(fetchedAssets);
      }
    }
  }, [user]);

  const handleClick = (viewName, assetName) => {
    setViewId(viewName);
    setSelectedAsset(assetName);
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
            </Card>
            <Card className="mt-3">
              <Card.Header>Assets</Card.Header>
              <ListGroup variant="flush">
                {Object.keys(assets).map((symbol) => (
                  <ListGroup.Item
                    key={symbol}
                    onClick={() => handleClick("AssetDetails", symbol)}
                    style={{ backgroundColor: "aqua" }}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <Container>
                      <Row fluid className="d-flex gap-2 ">
                        <Col className="d-flex justify-content-left align-items-center">
                          <img
                            src={assets[symbol].logoUrl}
                            alt={assets[symbol].logoUrl}
                            style={{ width: "40px", height: "40px" }}
                          />
                          <div className="p-2">
                            <strong>{assets[symbol].asset_name}</strong>
                            <br />
                            <small>
                              Available: {assets[symbol].amount} | Freeze: 0
                            </small>
                          </div>
                        </Col>
                        <Col className="d-flex justify-content-end align-items-center">
                          <span>$0</span>
                        </Col>
                      </Row>
                    </Container>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
            <h2>User Assets:</h2>
            <ul>
              {assets.length > 0 ? (
                assets.map((asset, index) => (
                  <li key={index}>
                    {asset.asset_name}: {asset.amount}
                  </li>
                ))
              ) : (
                <p>No assets available.</p>
              )}
            </ul>
          </Container>
        </div>
      )}
    </div>
  );
}
