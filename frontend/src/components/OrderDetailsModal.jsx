import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OrdersController from "../controllers/OrdersController";
import Notice from "./Notice";

const OrderDetailsModal = ({ open, onClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [notice, setNotice] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseNotice = () => {
    setNotice((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await OrdersController.getOrder(orderId);
        setOrder(response);
      } catch {
        setNotice({
          open: true,
          message: "Failed to fetch order. Please try again.",
          severity: "error",
        });
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (!order) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography>Loading...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="div">
              Order #{order.id}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
              <Chip
                label={order.status}
                color={getStatusColor(order.status)}
                sx={{ textTransform: "capitalize" }}
              />
              <Typography color="textSecondary">
                Created: {order.formattedCreatedAt}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Customer Information
              </Typography>
              <Typography>Email: {order.customerEmail}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Summary
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Total: {order.formattedTotal}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Order Items
          </Typography>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px" }}>Product</th>
                  <th style={{ textAlign: "right", padding: "8px" }}>
                    Quantity
                  </th>
                  <th style={{ textAlign: "right", padding: "8px" }}>
                    Unit Price
                  </th>
                  <th style={{ textAlign: "right", padding: "8px" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>{item.product_name}</td>
                    <td style={{ textAlign: "right", padding: "8px" }}>
                      {item.quantity}
                    </td>
                    <td style={{ textAlign: "right", padding: "8px" }}>
                      ${item.unit_price.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right", padding: "8px" }}>
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </DialogContent>
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

export default OrderDetailsModal;
