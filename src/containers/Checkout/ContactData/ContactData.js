import React, { Component } from "react";

import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Input from "../../../components/UI/Input/Input";
import Modal from '../../../components/UI/Modal/Modal';

class ContactData extends Component {
  // this state is a template to enable form creation and holds the 'value' for each item in the order form,
  // updated on changes, and the value for loading, which is changed upon order submission

  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          label: "Name",
          name: "name",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          label: "Email",
          name: "email",
          placeholder: "Your email",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          label: "Street",
          name: "street",
          placeholder: "Street",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
      },
      postal: {
        elementType: "input",
        elementConfig: {
          type: "text",
          label: "Postal Code",
          name: "postal",
          placeholder: "Postal Code",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 7
        },
        valid: false,
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          label: "Country",
          name: "country",
          placeholder: "Country",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
      },
      delivery: {
        elementType: "select",
        elementConfig: {
          options: [
            { name: "standard", displayValue: "Standard" },
            { name: "overnight", displayValue: "Overnight" },
          ],
          label: "Delivery Method",
          name: "delivery",
        },
        value: "Standard",
      },
    },
    loading: false,
  };

  orderHandler = (e) => {
    e.preventDefault();

    const orderFormEntryValidity = Object.values(this.state.orderForm)
      .map((element) => {
        return [element.elementConfig.name, element.valid];
      })
    
    const invalidOrderFormEntries = orderFormEntryValidity.filter(element => element[1] === false);

    console.log(invalidOrderFormEntries)
    if (invalidOrderFormEntries.length > 0) {
      const invalidElements = invalidOrderFormEntries.map(element => element[0]);

      let alertString = '';
      invalidElements.forEach((element, idx) => {
        if (idx > 0) alertString += `, ${element}`;
        else alertString += element;
      })

      return alert(`Please correct ${alertString}`)
    } 

    else this.submitOrder({
      customer: {
        name: this.state.orderForm.name.value,
        email: this.state.orderForm.email.value,
        street: this.state.orderForm.street.value,
        postal: this.state.orderForm.postal.value,
        country: this.state.orderForm.country.value,
      },
      totalPrice: this.props.totalPrice,
      ingredients: this.props.ingredients,
      deliveryMethod: this.state.orderForm.delivery.value,
    });
  };

  submitOrder = (order) => {
    // firebase endpoint, so use .json extension
    this.setState({ loading: true });

    axios
      .post("/orders.json", order)
      .then((response) => {
        this.setState({ loading: false });
        this.props.history.push("/", {});
      })
      .catch((error) => {
        this.setState({ loading: false });
        this.props.err(true, error.message);
      });
  };

  inputChangedHandler = (e) => {
    //note this is not a deep clone -> see the state.orderForm[e.target.name].elementConfig, but we're only setting state on the value property here.
    const orderForm = { ...this.state.orderForm };
    orderForm[e.target.name].value = e.target.value;

    if (e.target.name !== "delivery") {
      const isValid = this.checkValidity(
        e.target.value,
        orderForm[e.target.name].validation
      );
      orderForm[e.target.name].valid = isValid;
    }
    this.setState({ orderForm });
  };

  checkValidity = (value, rules) => {
    let isValid = false;

    if (rules.required) {
      isValid = value.trim() !== "";
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength;
    }

    return isValid;
  };

  render() {
    // console.log('ContactData props:', this.props)
    let formInputs = Object.values(this.state.orderForm).map((element) => {
      return (
        <Input
          key={element.elementConfig.name}
          elementType={element.elementType}
          elementConfig={element.elementConfig}
          validation={element.validation}
          changed={this.inputChangedHandler}
        />
      );
    });

    let output = (
      <div className={classes.ContactData}>
        <h4>Enter your contact info</h4>
        <form onSubmit={this.orderHandler}>
          {formInputs}
          <Button btnType="Success" clicked={() => {}}>
            ORDER
          </Button>
        </form>
      </div>
    );

    if (this.state.loading) output = <Spinner />;
    return output;
  }
}

export default ContactData;
