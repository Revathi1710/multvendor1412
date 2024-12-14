import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = (props) => {
  return (
    <Card style={{ width: "100%" }}>
      <Card.Img variant="top" src={props.imgSrc} />
      <Card.Body>
        <Link to={`/ServiceView/${props._id}`} className="ellipsis2">
          <Card.Title>
            {props.name || "Card Title"}
          </Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
