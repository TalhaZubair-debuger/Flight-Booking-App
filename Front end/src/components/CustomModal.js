import React from "react";
import { Button, Modal, Box, Typography } from "@mui/material";

const CustomModal = ({ open, handleClose, message }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          borderRadius: 5,
          borderColor: "white",
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="div" align="center">
          Alert!
        </Typography>
        <Typography variant="body2" align="center">
          {message}
        </Typography>
        <Button
          sx={{
            mt: 2,
            backgroundColor: "#ffb703",
            color: "white",
            "&:hover": {
              backgroundColor: "#fb8500",
            },
          }}
          onClick={handleClose}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomModal;
