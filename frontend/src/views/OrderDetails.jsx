import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OrdersController from "../controllers/OrdersController";
import Notice from "./Notice";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        const response = await OrdersController.getOrder(id);
        setOrder(response);
      } catch {
        setNotice({
          open: true,
          message: "Error fetching order.",
          severity: "error",
        });
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
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
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "grey.50",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back to Orders
          </Button>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 0 10px rgba(0,0,0,0.05)",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: "bold" }}
              >
                Order #{order.id}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
              >
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
                    <th style={{ textAlign: "left", padding: "8px" }}>
                      Product
                    </th>
                    <th style={{ textAlign: "right", padding: "8px" }}>
                      Quantity
                    </th>
                    <th style={{ textAlign: "right", padding: "8px" }}>
                      Unit Price
                    </th>
                    <th style={{ textAlign: "right", padding: "8px" }}>
                      Total
                    </th>
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
          </Paper>
        </Container>
      </Box>
      <Notice
        open={notice.open}
        message={notice.message}
        severity={notice.severity}
        onClose={handleCloseNotice}
      />
    </>
  );
};

export default OrderDetails;
