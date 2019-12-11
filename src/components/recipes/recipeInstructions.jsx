import React, { Component } from "react";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Badge,
  Row
} from "reactstrap";

class RecipeInstructions extends Component {
  render() {
    const { instructions } = this.props;

    return (
      <Card className="shadow">
        <CardHeader className="border-0">
          <Row>
            <h2 className="mb-0">Instrucciones</h2>
          </Row>
        </CardHeader>
        <ListGroup>
          {instructions.map((ins, index) => (
            <ListGroupItem key={index} className="justify-content-between">
              <Badge pill className="mr-2" color="primary">
                {index + 1}
              </Badge>
              {ins}
            </ListGroupItem>
          ))}
        </ListGroup>
      </Card>
    );
  }
}

export default RecipeInstructions;
