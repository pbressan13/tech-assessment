import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import Notice from "./Notice";

const NewOrderDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customer_email: "",
    order_items_attributes: [
      {
        product_name: "",
        quantity: "",
        unit_price: "",
      },
    ],
  });

  const [notice, setNotice] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseNotice = () => {
    setNotice((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (index, field, value) => {
    const newOrderItems = [...formData.order_items_attributes];
    newOrderItems[index] = {
      ...newOrderItems[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      order_items_attributes: newOrderItems,
    });
  };

  const handleCustomerEmailChange = (e) => {
    setFormData({
      ...formData,
      customer_email: e.target.value,
    });
  };

  const addOrderItem = () => {
    setFormData({
      ...formData,
      order_items_attributes: [
        ...formData.order_items_attributes,
        {
          product_name: "",
          quantity: "",
          unit_price: "",
        },
      ],
    });
  };

  const removeOrderItem = (index) => {
    const newOrderItems = formData.order_items_attributes.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      order_items_attributes: newOrderItems,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedItems = formData.order_items_attributes.map((item) => ({
        product_name: item.product_name,
        quantity: Math.max(1, parseInt(item.quantity) || 1),
        unit_price: Math.max(0, parseFloat(item.unit_price) || 0),
      }));

      const orderData = {
        customer_email: formData.customer_email,
        order_items_attributes: formattedItems,
      };

      await onSubmit(orderData);
      onClose();
      setFormData({
        customer_email: "",
        order_items_attributes: [
          { product_name: "", quantity: "", unit_price: "" },
        ],
      });
    } catch {
      setNotice({
        open: true,
        message: "Failed to create order. Please try again.",
        severity: "error",
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.customer_email &&
      formData.order_items_attributes.every(
        (item) =>
          item.product_name &&
          item.quantity &&
          item.unit_price &&
          !isNaN(parseInt(item.quantity)) &&
          !isNaN(parseFloat(item.unit_price)) &&
          parseInt(item.quantity) > 0 &&
          parseFloat(item.unit_price) >= 0
      )
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        disableEnforceFocus
        disableAutoFocus
        keepMounted
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">New Order</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box mb={3}>
              <TextField
                fullWidth
                label="Customer Email"
                type="email"
                value={formData.customer_email}
                onChange={handleCustomerEmailChange}
                required
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Order Items
            </Typography>

            {formData.order_items_attributes.map((item, index) => (
              <Box
                key={index}
                mb={2}
                p={2}
                border={1}
                borderColor="grey.300"
                borderRadius={1}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      value={item.product_name}
                      onChange={(e) =>
                        handleChange(index, "product_name", e.target.value)
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleChange(index, "quantity", e.target.value)
                      }
                      required
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Unit Price"
                      type="number"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleChange(index, "unit_price", e.target.value)
                      }
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      color="error"
                      onClick={() => removeOrderItem(index)}
                      disabled={formData.order_items_attributes.length === 1}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button variant="outlined" onClick={addOrderItem} sx={{ mt: 2 }}>
              Add Item
            </Button>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isFormValid()}
            >
              Create Order
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Notice
        open={notice.open}
        message={notice.message}
        severity={notice.severity}
        onClose={handleCloseNotice}
      />
    </>
  );
};

export default NewOrderDialog;
