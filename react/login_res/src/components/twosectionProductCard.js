import React from "react";
import { Card, Button } from "react-bootstrap";

const ProductCardTwo = (props) => {
  return (
    <Card style={{ width: "100%" }}>
      <Card.Img variant="top" src={props.imgSrc} />
      <Card.Body>
        <Card.Title className="ellipsis2 productnameTwo">{props.name || "Card Title"}</Card.Title>
        {/*<Card.Text>
          {props.description || "Some quick example text to build on the card title and make up the bulk of the card's content."}
        </Card.Text>
        <div className="product-actions">
          <Button variant="primary">Buy Now</Button>
          <Button variant="secondary">Add to cart</Button>
        </div>*/}
      </Card.Body>
    </Card>
  );
};

export default ProductCardTwo;
