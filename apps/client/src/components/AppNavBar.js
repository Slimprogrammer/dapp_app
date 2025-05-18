import { sendToken } from "../utils/MetaMaskHelper";
import { useConnectionStore } from "../store/useConnectionStore";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { FaChevronRight, FaRandom } from "react-icons/fa";
import { Copy } from "lucide-react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { Offcanvas } from "react-bootstrap"; // Import Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css";


export default function AppNavBar() {
    const { walletAddress, user } = useConnectionStore();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("Home");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [selectedItem, setSelectedItem] = useState(null);
    const items = [
      {
        id: 1,
        name: "Home",
        icon: <FaChevronRight />,
        link: "/",
        title: "Home",
      },
      {
        id: 2,
        name: "My Account",
        icon: <FaChevronRight />,
        link: "/profile",
        title: "My Account",
      },
      {
        id: 3,
        name: "Staking",
        icon: <FaChevronRight />,
        link: "/staking",
        title: "Staking Dashboard",
      },
      {
        id: 4,
        name: "Trading",
        icon: <FaChevronRight />,
        link: "/trading",
        title: "Trading Dashboard",
      },
    ];
     const copyToClipboard = () => {
       navigator.clipboard
         .writeText(user.wallet_address)
         .then(() => {
           // Optional: Show a success message to the user
           alert("Link copied to clipboard!");
         })
         .catch((error) => {
           console.error("Failed to copy: ", error);
         });
     };

     const shortAddress = () => {
       try {
         let acc = "" + user.wallet_address;
         return (
           acc.substring(0, 4) +
           "..." +
           acc.substring(acc.length - 4, acc.length) +
           "  "
         );
       } catch (e) {
         console.log(e.message);
       }
     };
    const handleClick = (itemId) => {
        setSelectedItem(itemId);
        handleClose();
        setTitle(items[itemId-1].title);
        navigate(items[itemId-1].link);
    };
    const handlePaymentClick = async () => {
        //const result = await sendToken(walletAddress, "0x5Bee3f145Ac13729ad6844C7Fa5b333637C6ab5A", "ETH", 15);
       const result = await sendToken(
        walletAddress,
        "0x5Bee3f145Ac13729ad6844C7Fa5b333637C6ab5A",
        "ETH",
        15
    );
        if (result.success) {
            // Handle successful transaction
            user.has_joined = !user.has_joined;
        } else {
            alert(`Error: ${result.error}`);
        }
    };
    return !user ? (
      <div>user Loading ...</div>
    ) : (
      <div>
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              onClick={handleShow}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <span className="navbar-brand">{title}</span>
            <button>
              <FaRandom />
            </button>
          </div>
        </nav>

        <Offcanvas show={show} onHide={handleClose} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">WEB 3.0</h4>
                <div className="card-text">
                  <p>
                    {shortAddress()}
                    <Copy onClick={copyToClipboard} />
                  </p>
                  {user.has_joined ? (
                    <Button onClick={handlePaymentClick}>View Profile</Button>
                  ) : (
                    <Button onClick={handlePaymentClick}>Join us</Button>
                  )}
                </div>
              </div>
            </div>
            <Container>
              <ListGroup as="ul">
                {items.map((item) => (
                  <ListGroup.Item
                    as="li"
                    key={item.id}
                    active={item.id === selectedItem}
                    action
                    onClick={() => handleClick(item.id)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-2">{item.icon}</span> {/* Icon */}
                      <span>{item.name}</span> {/* Name */}
                    </div>
                    <FaChevronRight /> {/* Arrow */}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Container>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    );
}
