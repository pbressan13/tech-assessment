import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import OrdersTable from "../components/OrdersTable";
import NewOrderDialog from "../components/NewOrderDialog";
import Notice from "../components/Notice";
import OrdersController from "../controllers/OrdersController";
import { subscribeToOrders } from "../services/actionCable";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notice, setNotice] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const handleOrdersChange = (newOrders) => {
      setOrders(newOrders);
    };

    OrdersController.addListener(handleOrdersChange);
    OrdersController.fetchOrders().catch(() => {
      setNotice({
        open: true,
        message: "Failed to fetch orders",
        severity: "error",
      });
    });

    // Subscribe to Action Cable updates
    const unsubscribe = subscribeToOrders((data) => {
      if (data.type === "order_created") {
        OrdersController.fetchOrders();
      } else if (
        data.type === "order_processing" ||
        data.type === "order_completed" ||
        data.type === "order_cancelled"
      ) {
        OrdersController.fetchOrders();
      }
    });

    return () => {
      OrdersController.removeListener(handleOrdersChange);
      unsubscribe();
    };
  }, []);

  const handleCreateOrder = async (orderData) => {
    try {
      await OrdersController.createOrder(orderData);
      setIsFormOpen(false);
      setNotice({
        open: true,
        message: "Order created successfully",
        severity: "success",
      });
      // Refresh orders after creating a new one
      await OrdersController.fetchOrders();
    } catch {
      setNotice({
        open: true,
        message: "Failed to create order",
        severity: "error",
      });
    }
  };

  const handleCloseNotice = () => {
    setNotice((prev) => ({ ...prev, open: false }));
  };

  const getStatusCount = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  const cardStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  const cardContentStyle = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "grey.50",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              Order Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
              size="large"
            >
              New Order
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={cardStyle}>
                <CardContent sx={cardContentStyle}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      noWrap
                    >
                      Total Orders
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div">
                    {OrdersController.orderCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={cardStyle}>
                <CardContent sx={cardContentStyle}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <ShoppingCartIcon color="warning" sx={{ mr: 1 }} />
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      noWrap
                    >
                      Pending Orders
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div">
                    {getStatusCount("pending")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={cardStyle}>
                <CardContent sx={cardContentStyle}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <ShoppingCartIcon color="info" sx={{ mr: 1 }} />
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      noWrap
                    >
                      Processing
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div">
                    {getStatusCount("processing")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={cardStyle}>
                <CardContent sx={cardContentStyle}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <ShoppingCartIcon color="success" sx={{ mr: 1 }} />
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      noWrap
                    >
                      Completed
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div">
                    {getStatusCount("completed")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 0 10px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "medium" }}>
              Orders List
            </Typography>
            <OrdersTable orders={orders} />
          </Paper>
        </Box>

        <NewOrderDialog
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateOrder}
        />

        <Notice
          open={notice.open}
          message={notice.message}
          severity={notice.severity}
          onClose={handleCloseNotice}
        />
      </Container>
    </Box>
  );
};

export default Dashboard;
